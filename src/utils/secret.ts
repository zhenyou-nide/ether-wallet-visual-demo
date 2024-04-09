import CryptoJS from 'crypto-js'; //引用AES源码js

const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412'); //十六位十六进制数作为密钥偏移量

function formatKey(key: any) {
  if (key.length === 0) return '';
  if (key.length > 32) return key.slice(0, 32);

  while (key.length < 32) {
    key.push(0x0);
  }
  return key;
}

function stringToBytes(str: any) {
  let ch;
  let st;
  let result: any[] = [];
  for (let i = 0; i < str.length; i += 1) {
    ch = str.charCodeAt(i);
    st = [];
    do {
      st.push(ch & 0xff);
      ch >>= 8;
    } while (ch);
    result = result.concat(st.reverse());
  }
  return result;
}

function bytesToString(array: any[]) {
  let result = '';
  for (let i = 0; i < array.length; i += 1) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

//解密方法
function Decrypt(word: string, pass: string) {
  const key = bytesToString(formatKey(stringToBytes(pass)));
  //十六位十六进制数作为密钥

  let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

//加密方法
function Encrypt(word: string) {
  const key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF'); //十六位十六进制数作为密钥

  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString().toUpperCase();
}

export { Decrypt, Encrypt };
