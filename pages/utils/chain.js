import { configureChains, createClient, WagmiConfig } from "wagmi";
import { Chain } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const polygonMumbaiChain = {
  id: 80001,
  name: "Polygon Testnet",
  network: "Mumbai",
  iconUrl: "https://example.com/icon.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/polygon_mumbai"],
    },
  },
  blockExplorers: {
    default: { name: "polygonscan", url: "https://polygonscan.com" },
  },
  testnet: true,
};
export const { provider, chains } = configureChains(
  [polygonMumbaiChain],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);
