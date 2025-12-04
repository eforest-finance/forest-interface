import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { captureException } from '@sentry/nextjs';

type SignalRParams = {
  url: string;
};

type HandlerFn = (data: any) => void;

const messageType: Array<string> = ['ReceiveSymbolBidInfo', 'ReceiveSymbolBidInfos', 'ReceiveSymbolAuctionInfo'];

export default class SignalR {
  private connection: HubConnection | null;
  private url: string;
  private handlerMap: Map<string, Array<HandlerFn>>;
  static instance: SignalR | null;

  constructor({ url }: SignalRParams) {
    this.url = url;
    this.connection = new HubConnectionBuilder()
      .withUrl(this.url, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();
    this.handlerMap = new Map();
    // this.initAndStart();
  }

  static getInstance({ url }: SignalRParams) {
    if (!SignalR.instance) {
      SignalR.instance = new SignalR({ url });
    }
    return SignalR.instance;
  }

  initAndStart = async () => {
    this.connection?.onclose((err) => {
      console.log('onclose', err);
    });
    this.listen();
    try {
      console.log('socket start');
      await this.connection?.start();
      console.log('socket start end');
    } catch (err) {
      console.log('socket err', err);
      captureException(err);
    }
  };

  listen = () => {
    try {
      messageType.length &&
        messageType.forEach((name) => {
          this.connection?.on(name, (data) => {
            this.dispatchMessage(name, data);
          });
        });
    } catch (err) {
      console.log('listen err', err);
      captureException(err);
    }
  };

  registerHandler = (message: string, handler: HandlerFn) => {
    try {
      const handlers = this.handlerMap.get(message);
      if (handlers) {
        this.handlerMap.set(message, [...handlers, handler]);
      } else {
        this.handlerMap.set(message, [handler]);
      }
    } catch (err) {
      console.log('registerHandler err', err);
      captureException(err);
    }
  };

  unRegisterHandler = (message: string, handler: HandlerFn) => {
    try {
      const handlers = this.handlerMap.get(message);
      if (handlers) {
        this.handlerMap.set(
          message,
          handlers.filter((fn) => fn !== handler),
        );
      }
    } catch (err) {
      console.log('unsubscribe err', err);
      captureException(err);
    }
  };

  dispatchMessage = (message: string, data: any) => {
    try {
      const handlers = this.handlerMap.get(message);
      handlers &&
        handlers.forEach((handler) => {
          handler(data);
        });
    } catch (err) {
      console.log('dispatchMessage err', err);
      captureException(err);
    }
  };

  sendEvent = (name: string, ...rest: any[]) => {
    try {
      if (rest.length === 0) {
        this.connection?.invoke(name);
      } else if (rest.length === 1) {
        this.connection?.invoke(name, rest[0]);
      } else if (rest.length === 2) {
        this.connection?.invoke(name, rest[0], rest[1]);
      } else if (rest.length === 3) {
        this.connection?.invoke(name, rest[0], rest[1], rest[2]);
      } else {
        console.log('too much params');
      }
    } catch (err) {
      console.log('subscribeEvent err', err);
      captureException(err);
    }
  };
}
