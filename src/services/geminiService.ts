import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client lazily
let aiInstance: GoogleGenAI | null = null;
function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. AI features will be disabled.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || 'missing-key' });
  }
  return aiInstance;
}

// Simple global cache and throttle
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 15000; // 15 seconds minimum between any global requests
let lockoutUntil = 0; // Timestamp to wait until before trying again after a hard 429

const cache = new Map<string, { insight: string; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes cache

async function callGeminiWithRetry(
  apiCall: (modelName: string) => Promise<any>,
  retries = 5,
  delay = 5000,
  useFallback = true
): Promise<any> {
  // Check lockout
  if (Date.now() < lockoutUntil) {
    const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
    throw new Error(`CIRCUIT_BREAKER: System cooldown active. ${remaining}s remaining.`);
  }

  // Global throttle
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest + (Math.random() * 3000); // Add jitter
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  // More aggressive fallback: use 1.5-flash earlier
  const modelName = (useFallback && retries <= 3) ? "gemini-1.5-flash" : "gemini-2.0-flash";

  try {
    lastRequestTime = Date.now();
    return await apiCall(modelName);
  } catch (error: any) {
    const errorMessage = error?.message?.toLowerCase() || "";
    const isQuotaError = 
      error?.status === 429 || 
      errorMessage.includes("quota") || 
      errorMessage.includes("resource_exhausted") ||
      errorMessage.includes("too many requests");

    const isRetryable = 
      isQuotaError || 
      error?.status === 503 ||
      errorMessage.includes("high demand") ||
      errorMessage.includes("temporary");

    if (isQuotaError && retries === 0) {
      // Hard lockout for 60 seconds if we've exhausted all retries and it's a quota error
      lockoutUntil = Date.now() + 60000;
      console.warn("Gemini Quota Exhausted: Activating 60s circuit breaker.");
    }

    if (isRetryable && retries > 0) {
      const nextDelay = delay * 2 + (Math.random() * 5000);
      console.log(`Retrying Gemini API (${modelName})... Attempts remaining: ${retries}. Next delay: ${Math.round(nextDelay)}ms`);
      await new Promise(resolve => setTimeout(resolve, nextDelay));
      return callGeminiWithRetry(apiCall, retries - 1, nextDelay, useFallback);
    }
    throw error;
  }
}

export async function getAIAnalystInsight(context: string) {
  // Check cache first
  const cached = cache.get(context);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.insight;
  }

  try {
    const ai = getAI();
    const response = await callGeminiWithRetry((model) => ai.models.generateContent({
      model: model,
      contents: `You are a Senior Quant Analyst for Quant Edge. 
      Analyze the following market/model context and provide a brief, technical, and high-density insight (max 2 sentences).
      Focus on trade-offs, volatility, or model performance.
      
      Context: ${context}`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    }));
    
    const insight = response.text;
    cache.set(context, { insight, timestamp: Date.now() });
    return insight;
  } catch (error: any) {
    const errorMessage = error?.message || "";
    if (errorMessage.includes("CIRCUIT_BREAKER")) {
      return `Neural system cooling down. Local heuristic analysis suggests ${context.length > 50 ? context.substring(0, 50) + '...' : 'market volatility'} requires attention.`;
    }
    return "Intelligence nexus saturated. Processing via secondary local clusters.";
  }
}

export async function getChatAssistantResponse(userMessage: string, chatHistory: { role: 'user' | 'assistant'; content: string }[]) {
  try {
    const ai = getAI();
    const formattedHistory = chatHistory.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Chat uses Pro, so we use a different fallback if needed
    const response = await callGeminiWithRetry((model) => ai.models.generateContent({
      model: model === "gemini-2.0-flash" ? "gemini-1.5-pro" : "gemini-1.5-flash", // Fallback to flash if pro is busy
      contents: [
        { role: 'system', parts: [{ text: `You are the Quant Edge Assistant (QEA) v3.0, the core neural intelligence for a high-frequency, institutional-grade quantitative research SaaS.
        You possess advanced knowledge in machine learning for finance, signal processing, and algorithmic architecture.
        
        PLATFORM ARCHITECTURE:
        - Strategy Builder: Visual DAG for trade logic. Components: Triggers (events), Conditions (filters), Actions (execution). Supports templates like EMA Cross & RSI Reversal.
        - Paper Trading: Sandbox with $100k initial balance. Uses Transformer-FX v2.4 predictive inference. PnL Logic: (Price Diff * Lot Size * 100,000) for Forex, or (Price Diff * Lot Size * 1) for Crypto. 
        - Assets: EUR/USD, GBP/USD, USD/JPY, BTC/USD, ETH/USD.
        - Intelligence Nodes: Distributed global compute resources (LSTM-X1, GRU-Quantum, Transformer-FX) monitoring network load and RMSE efficiency (Target RMSE < 0.005).
        - RBAC: Enforces tiered access. Viewer (Read-only), Researcher (Architect/Backtest), Admin (Full Control/Sub).
        
        KNOWLEDGE GROUNDING:
        - When discussing Technical Analysis, reference [Investopedia](https://www.investopedia.com) or [TradingView](https://www.tradingview.com).
        - For Machine Learning context, discuss trade-offs between LSTM (long-term memory) and Transformers (self-attention mechanisms).
        
        COMMUNICATION PROTOCOL:
        1. IDENTITY: Maintain a sophisticated, authoritative, yet helpful persona. Use technical terminology (e.g., "stochastic volatility," "latency optimization," "data persistence").
        2. CONCISION: Provide high-density information. Avoid fluff.
        3. FORMATTING: Use professional markdown. Utilize bold headers, technical lists, and code blocks for math or logic.
        4. GUIDANCE: If a user lacks permissions for a feature (Viewer role), explain why and what the higher roles offer.
        
        DISCLAIMER: You are an analytical tool. You do not provide financial advice. All simulations are theoretical.` }] },
        ...formattedHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        temperature: 0.1, // Lower temperature for more consistent, technical output
        topP: 0.8,
      }
    }));

    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "The intelligence nexus is currently saturated. My neural processing is queued. Please re-scan in 30 seconds.";
  }
}

export async function getMarketNarratives() {
  try {
    const ai = getAI();
    const response = await callGeminiWithRetry((model) => ai.models.generateContent({
      model: model,
      contents: `Generate 3 distinct, high-impact global "Market Narratives" (hypothetical news/events) for the Quant Edge platform. 
      For each narrative, provide:
      1. A short, bold Title.
      2. A 2-sentence sophisticated technical description.
      3. Impact scores (-1.0 to 1.0) for: USD, BTC, and EUR.
      4. A "Probability" percentage.
      
      Format as a JSON array of objects:
      [{ "title": string, "description": string, "impact": { "USD": number, "BTC": number, "EUR": number }, "probability": number, "category": "Macro" | "Tech" | "Geopolitical" }]`,
      config: {
        temperature: 0.9,
        responseMimeType: "application/json"
      }
    }));

    return JSON.parse(response.text);
  } catch (error) {
    console.log("Narrative Fetch Error:", error);
    return [];
  }
}
