declare global {
  interface Window {
    ethereum: any;
  }
}

export interface Guest {
  id: number;
  wallet: string;
  message: string;
  signed: boolean;
}