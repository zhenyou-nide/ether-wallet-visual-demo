/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly URL_RPC: string;
  // 更多环境变量...
}

interface AbiItem {
  anonymous?: boolean;
  constant?: boolean;
  inputs?: AbiInput[];
  name?: string;
  outputs?: AbiOutput[];
  payable?: boolean;
  stateMutability?: StateMutabilityType;
  type: AbiType;
  gas?: number;
}
