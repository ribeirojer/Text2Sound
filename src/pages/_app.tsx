import { HistoryProvider } from "@/contexts/HistoryContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
	return (
			<HistoryProvider>
			<Component {...pageProps} />
		</HistoryProvider>
	)
	
}
