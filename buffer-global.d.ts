// src/globals.d.ts

// Extend the Window interface to include Buffer
interface Window {
    Buffer: typeof import("buffer").Buffer;
  }