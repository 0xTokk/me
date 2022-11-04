declare global {
  interface Window {
    ethereum: any;
  }
}

export interface Guest {
  wallet: string;
  timestamp: string;
  message: string;
}