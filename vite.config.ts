import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cjsInterop } from "vite-plugin-cjs-interop";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = process.env.NODE_ENV === "production";
  const noExternal = [/^@orderly.*$/, "@uiw/react-split"];
  if (isProduction) {
    noExternal.push("ethers");
  }

  return {
    define: {
      // Make env variables available at build time
      'import.meta.env.VITE_ORDERLY_BROKER_ID': JSON.stringify(env.VITE_ORDERLY_BROKER_ID || 'qell'),
      'import.meta.env.VITE_ORDERLY_BROKER_NAME': JSON.stringify(env.VITE_ORDERLY_BROKER_NAME || 'Qell'),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME || 'Qell'),
      'import.meta.env.VITE_APP_DESCRIPTION': JSON.stringify(env.VITE_APP_DESCRIPTION || 'CEX-level performance. Ethereum security.'),
      'import.meta.env.VITE_NETWORK_ID': JSON.stringify(env.VITE_NETWORK_ID || 'mainnet'),
      'import.meta.env.VITE_MAINNET_URL': JSON.stringify(env.VITE_MAINNET_URL || ''),
      'import.meta.env.VITE_TESTNET_URL': JSON.stringify(env.VITE_TESTNET_URL || ''),
      'import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID': JSON.stringify(env.VITE_WALLET_CONNECT_PROJECT_ID || ''),
    },
    server: {
      host: true,
      port: 5173,
    },
    ssr: {
      noExternal,
    },
    plugins: [
      remix({
        ssr: true,
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      tsconfigPaths(),
      cjsInterop({
        dependencies: ["bs58", "@coral-xyz/anchor", "lodash"],
      }),
      nodePolyfills({
        include: ["buffer", "crypto"],
      }),
    ],
  };
});
