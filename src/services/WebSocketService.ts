import { AppDispatch } from "../store/store";
import { ISocketSend, EMethod } from "./types";
import { socketStream } from "../store/slices/portfolioSlice";

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimeout: any;
  private dispatch: AppDispatch;
  private subscribedAssets: Set<string> = new Set();

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket("wss://stream.binance.com:9443/ws");

    this.socket.onopen = () => {
      console.log("WebSocket Connected");
      this.subscribeToStoredAssets();
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.s && data.P && data.c) {
        this.dispatch(socketStream(data));
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket Error", error);
      this.reconnect();
    };

    this.socket.onclose = () => {
      console.log("WebSocket Closed");
      this.reconnect();
    };
  }

  private reconnect() {
    this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
  }

  private subscribeToStoredAssets() {
    const storedPortfolio = JSON.parse(
      localStorage.getItem("portfolio") || "[]"
    );
    const symbols = storedPortfolio.map(
      (asset: any) => `${asset.params.toLowerCase()}@ticker`
    );

    if (symbols.length) {
      this.send({
        method: EMethod.SUBSCRIBE,
        id: "init-subscribe",
        params: symbols,
      });

      symbols.forEach((s: string) => this.subscribedAssets.add(s));
    }
  }

  public send(params: ISocketSend) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(params));
    }
  }

  public subscribe(symbol: string) {
    const ticker = `${symbol.toLowerCase()}@ticker`;
    if (!this.subscribedAssets.has(ticker)) {
      this.send({
        method: EMethod.SUBSCRIBE,
        id: `sub-${symbol}`,
        params: [ticker],
      });
      this.subscribedAssets.add(ticker);
    }
  }

  public unsubscribe(symbol: string) {
    const ticker = `${symbol.toLowerCase()}@ticker`;
    if (this.subscribedAssets.has(ticker)) {
      this.send({
        method: EMethod.UNSUBSCRIBE,
        id: `unsub-${symbol}`,
        params: [ticker],
      });
      this.subscribedAssets.delete(ticker);
    }
  }

  public close() {
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.close();
    }
    clearTimeout(this.reconnectTimeout);
    console.log("WebSocket Connection Closed");
  }
}

export default WebSocketService;
