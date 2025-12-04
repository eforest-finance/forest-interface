export class Proto {
  private proto: Record<string, any> = {};
  private static instance: Proto;

  private constructor() {
    // constructor is private
  }

  static getInstance(): Proto {
    if (!Proto.instance) {
      Proto.instance = new Proto();
    }
    return Proto.instance;
  }

  setProto(contractAddress: string, proto: any) {
    this.proto[contractAddress] = proto;
  }

  getProto(contractAddress?: string) {
    if (contractAddress) {
      return this.proto[contractAddress];
    }
    return this.proto;
  }
}
