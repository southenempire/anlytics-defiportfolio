// Create a new file src/utils/ethereum.ts
export function initializeEthereum() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Store the original provider
        const originalProvider = window.ethereum;
        
        // Create a proxy to prevent direct modification
        const ethereumProxy = new Proxy(originalProvider, {
          set(target, prop, value) {
            if (prop === 'ethereum') {
              console.warn('Prevented modification of window.ethereum');
              return false;
            }
            target[prop] = value;
            return true;
          }
        });
        
        Object.defineProperty(window, 'ethereum', {
          value: ethereumProxy,
          configurable: false,
          writable: false
        });
      } catch (e) {
        console.warn('Could not protect window.ethereum:', e);
      }
    }
  }
  
  // Then in your main.tsx or App.tsx
