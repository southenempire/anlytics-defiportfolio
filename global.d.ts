export {}; // Ensure this is treated as a module

declare global {
  interface Window {
    Jupiter: {
      init: (config: {
        displayMode: string;
        integratedTargetId: string;
        endpoint: string;
        defaultExplorer?: string;
        formProps?: {
          initialInputMint?: string;
          initialOutputMint?: string;
          fixedOutputMint?: boolean;
        };
      }) => void;
      _instance: any;
    };
  }
}