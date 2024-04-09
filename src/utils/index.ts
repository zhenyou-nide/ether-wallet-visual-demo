/**
 * # Demo
 * 以下需要在 demo 中体现：
 *
 * ## 私钥、公钥
 * - binary 形式
 * - hex 形式
 * - 助记词形式
 *
 * ## 地址
 * - base58 形式
 * - hex 形式
 *
 * ## 构造交易
 * - 普通转账
 * - 调用合约
 *
 * ## 交易序列化
 * - tx hash/tx id
 *
 * ## 交易签名、消息签名
 *
 * ## 广播交易
 */
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { hdkey } from 'ethereumjs-wallet';
import Web3 from 'web3';
import WETH_ABI from '../constants/weth.json';

const {
  PASSWORD,
  FROM_ADDRESS,
  TO_ADDRESS,
  URL_RPC,
  SPENDER_ADDRESS,
  WETH_ADDRESS,
} = import.meta.env;

const web3 = new Web3(URL_RPC);
const createAccount = async (password: string) => {
  // 1. generate mnemonic
  const mnemonic = generateMnemonic();

  // 2. mnemonic to seed
  const seed = mnemonicToSeedSync(mnemonic);

  // 3. seed to HD Wallet
  const hdWallet = hdkey.fromMasterSeed(seed);

  // 4. m/44'/60'/0'/0/0 keypair ???
  const key = hdWallet.derivePath("m/44'/60'/0'/0/0");

  // 5. keypair to private key
  const privateKey = key.getWallet().getPrivateKeyString();

  // 6. keypair to public key
  const publicKey = key.getWallet().getPublicKeyString();

  // 7. generate address
  const address = key.getWallet().getAddressString();

  // !!!8. private key & user's password to keystore
  // const keystore = web3.eth.accounts.encrypt(privateKey, PASSWORD);

  return {
    address,
    privateKey,
    publicKey,
    mnemonic,
    // keystore,
  };
};

const importAccountByPrivateKey = (privatekey: string) => {
  const account = web3.eth.accounts.privateKeyToAccount(privatekey);
  return account;
};

const importAccountByKeystoreAndPassword = (
  keystoreData: string,
  password: string
) => {
  const account = web3.eth.accounts.decrypt(JSON.parse(keystoreData), password);
  return account;
};

const importAccountByMnemonic = (mnemonic: string, password: string) => {
  /**
   * use m/44'/60'/0'/0/0
   * forEach ["m/44'/60'/0'/0/0", "m/44'/60'/0'/0/1","m/44'/60'/0'/0/2",...] actually
   */
  // 1. mnemonic to seed
  const seed = mnemonicToSeedSync(mnemonic, password);
  // 2. seed to HDWallet
  const hdWallet = hdkey.fromMasterSeed(seed);
  // for (let i = 0; i < 100; i++) {
  // 3. get the first account's keypair
  const key = hdWallet.derivePath("m/44'/60'/0'/0/0");

  // 4. get private key
  const privatekey = key.getWallet().getPrivateKeyString();

  // 5. private key to address
  const account = web3.eth.accounts.privateKeyToAccount(privatekey);

  return account;
  // }
};

const sendTransaction = async (
  from: string,
  to: string,
  number?: string,
  privateKey?: string
) => {
  if (!number) return;
  const nonce = await web3.eth.getTransactionCount(from);
  const gasPrice = await web3.eth.getGasPrice();
  const balance = await web3.utils.toWei(number, 'ether');

  const rawTx: { [x: string]: any } = {
    nonce: nonce,
    gasPrice: gasPrice,
    to,
    value: balance,
    data: '0x00', // Token
  };
  // estimate Gas
  const gas = await web3.eth.estimateGas(rawTx);
  rawTx.gas = gas;

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      ...rawTx,
    },
    '0x' + privateKey
  );

  const serializedTx = signedTx.rawTransaction;
  console.log('🚀 ~ file: index.js:132 ~ serializedTx:', serializedTx);
  if (!serializedTx) {
    console.error('transaction error');
    return;
  }
  await web3.eth
    .sendSignedTransaction(serializedTx, (err, data) => {
      if (err) {
        console.log('🚀 ~ file: index.js:129 ~ sendTransaction ~ err:', err);
      }
    })
    .then((data) => {
      if (data) {
        console.log('🚀 ~ file: index.js:145 ~ .then ~ data:', data);
      } else {
        console.log('transaction failed');
      }
    });
};

const getContractInstance = (abi: AbiItem[], address: string) => {
  return new web3.eth.Contract(abi, address);
};

export {
  createAccount,
  importAccountByKeystoreAndPassword,
  importAccountByMnemonic,
  importAccountByPrivateKey,
  sendTransaction,
  getContractInstance,
  web3,
};
const main = async () => {
  const contractInstance = getContractInstance(WETH_ABI, WETH_ADDRESS);
  const account = web3.eth.accounts.wallet.add('privateKeyString');
  const INITIAL_WEI = '1000000000000000';

  // write contract
  await contractInstance.methods
    .approve(FROM_ADDRESS, INITIAL_WEI)
    .send({
      from: account.address,
      gas: '1000000',
      // other transaction's params
    })
    .then(console.log);

  // read contract
  contractInstance.methods
    .allowance(account.address, SPENDER_ADDRESS)
    .call()
    .then(console.log);

  return;
  sendTransaction(FROM_ADDRESS, TO_ADDRESS);
};
