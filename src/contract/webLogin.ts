import { SupportedELFChainId } from 'constants/chain';

import { ICallContractParams } from '@aelf-web-login/wallet-adapter-base';

export interface IWebLoginArgs {
  address: string;
  chainId: string;
}

// type MethodType = <T, R>(params: CallContractParams<T>) => Promise<R>;
export type MethodType = <T, R>(params: ICallContractParams<T>) => Promise<R>;

export default class WebLoginInstance {
  public contract: any;
  public address: string | undefined;
  public chainId: string | undefined;

  private static instance: WebLoginInstance | null = null;

  private sendMethod?: MethodType = undefined;
  private viewMethod?: MethodType = undefined;

  constructor(options?: IWebLoginArgs) {
    this.address = options?.address;
    this.chainId = options?.chainId;
  }
  static get() {
    if (!WebLoginInstance.instance) {
      WebLoginInstance.instance = new WebLoginInstance();
    }
    return WebLoginInstance.instance;
  }

  setMethod({ chain, sendMethod, viewMethod }: { chain: Chain; sendMethod: MethodType; viewMethod: MethodType }) {
    this.sendMethod = sendMethod;
    this.viewMethod = viewMethod;
  }

  setContractMethod(
    contractMethod: {
      chain: Chain;
      sendMethod: MethodType;
      viewMethod: MethodType;
    }[],
  ) {
    contractMethod.forEach((item) => {
      this.setMethod(item);
    });
  }

  // getWebLoginContext() {
  //   return this.context; // wallet, login, loginState
  // }

  callSendMethod<T, R>(params: ICallContractParams<T>): Promise<R> {
    const contractMethod = this.sendMethod;

    if (!contractMethod) {
      throw new Error('Error: Invalid chain ID');
    }
    return contractMethod(params);
  }

  callViewMethod<T, R>(params: ICallContractParams<T>): Promise<R> {
    const contractMethod = this.viewMethod;

    if (!contractMethod) {
      throw new Error('Error: Invalid chain ID');
    }
    return contractMethod(params);
  }
}

export const webLoginInstance = WebLoginInstance.get();
