export type Screen = 'overview' | 'efficiency' | 'resources' | 'config' | 'comparison' | 'backtest' | 'methodology' | 'subscription' | 'strategy' | 'simulation' | 'intelligence' | 'brokerage';

export type UserRole = 'admin' | 'researcher' | 'viewer';

export interface UserConfig {
  userId: string;
  email: string;
  displayName?: string;
  confidenceThreshold?: number;
  learningRate?: number;
  notificationsEnabled?: boolean;
  researchMode?: boolean;
  role: UserRole;
  updatedAt?: string;
}

export interface ModelMetric {
  name: string;
  type: string;
  rmse: string;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: string;
  color: string;
}

export interface AppConfig {
  learningRate: number;
  batchSize: number;
  epochs: number;
  confidenceThreshold: number;
  autoExecute: boolean;
  notifications: boolean;
  researchMode: boolean;
}

export interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export interface Trade {
  id: string;
  pair: string;
  type: 'Long' | 'Short';
  entryPrice: number;
  exitPrice?: number;
  size: number; // in lots
  leverage: number;
  pnl: number;
  status: 'Active' | 'Closed';
  timestamp: string;
  exitTimestamp?: string;
  stopLoss?: number;
  takeProfit?: number;
}

export interface MarketPrice {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
}
