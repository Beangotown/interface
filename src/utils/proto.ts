export class Proto {
  private proto: any = null;
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

  setProto(proto: any) {
    this.proto = proto;
  }

  getProto() {
    return this.proto;
  }
}
