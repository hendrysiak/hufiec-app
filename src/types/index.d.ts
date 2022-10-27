import { Buffer } from 'buffer';

export declare global {
  interface Window {
    Buffer: Buffer;
  }
}