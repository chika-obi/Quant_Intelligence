# Quant Edge: Professional Research & Trading Dashboard

Quant Edge is a high-performance, institutional-grade research dashboard designed for the analysis and deployment of machine learning models in Forex and financial markets. It bridges the gap between academic research and real-world trading execution.

## 🚀 Key Features

### 📊 Advanced Analytics
- **Model Performance**: Real-time tracking of LSTM, GRU, and Transformer-based models with RMSE and trend analysis.
- **Efficiency Analysis**: Deep dive into computational overhead, latency, and resource utilization.
- **Interactive Candlestick Engine**: High-performance D3.js charting for real-time price action visualization.

### 🔬 Research & Methodology
- **Formal Methodology**: Dedicated section for research abstracts, technical architecture diagrams, and statistical summaries (P-Values, Information Ratios).
- **Research Mode**: Toggle academic typography (Crimson Pro) and professional layout for publication-ready presentation.
- **AI Analyst**: Automated research summaries and market intelligence powered by the Gemini API.

### 🛠 Strategy & Execution
- **Visual Strategy Builder**: No-code, drag-and-drop interface for constructing complex trading logic blocks.
- **Live Simulation (Paper Trading)**: Risk-free environment with virtual balance, PnL tracking, and real-time trade execution.
- **AI Quant Assistant**: Floating chat interface for technical analysis and model insights.

### 💳 Management
- **Subscription System**: Tiered access (Free, Pro, Enterprise) with integrated billing and usage tracking.
- **Configurable Thresholds**: Fine-tune confidence levels, learning rates, and notification settings.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS (Utility-first design)
- **Animations**: Framer Motion (motion/react)
- **Data Visualization**: D3.js, Recharts
- **AI Engine**: Google Gemini API (@google/genai)
- **Icons**: Lucide React

## ⚙️ Setup & Configuration

### Environment Variables
To enable AI features, you must provide a Gemini API key. Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Research Mode
Enable **Research Mode** in the settings to switch the dashboard to an academic-focused layout. This mode prioritizes readability, formal typography, and detailed statistical data, making it ideal for screen-capturing for publications or presentations.

## 👤 Author
**Kpanuku Chika-Obi**  
*Computational Efficiency Analysis of ML Models for Forex Prediction*

---
*Disclaimer: This platform is for research and simulation purposes only. Virtual trading does not involve real capital.*
