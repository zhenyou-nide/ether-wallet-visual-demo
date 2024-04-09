import { useEffect, useState } from 'react';
import './App.css';
import {
  createAccount,
  importAccountByMnemonic,
  importAccountByPrivateKey,
  web3,
} from './utils';
import { Decrypt, Encrypt } from './utils/secret';

/**
 * 0xbd7c3591019c395933beb93bff93d2e2f4e1e2d6
 * 0x9884bae838f4763775d56907b64d8ea93c013a1bb43e1fb847026b4db3d0a438
 * grunt fly moral charge soup car remember merit calm ostrich vague system
 */
// "couch jar exit deputy snack state humble car amazing over diesel federal"

const BUTTON_STYLE = {
  backgroundColor: 'rgba(0,0,0,0.8)',
  color: 'white',
  marginLeft: 10,
};
const WRAPPER_STYLE = {
  borderColor: 'gray',
  borderWidth: 1,
  borderStyle: 'solid',
  padding: 20,
  borderRadius: 20,
  marginBottom: 20,
};

const INPUT_STYLE = {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 10,
  paddingLeft: 10,
  marginBottom: 10,
};
const App = () => {
  const [password, setPassword] = useState<string>();
  const [obj, setObj] = useState<{ [x: string]: string }>();
  const [mnemonic, setMnemonic] = useState<string>();
  const [privateKey, setPrivateKey] = useState<string>();
  const [mnemonicAddress, setMnemonicAddress] = useState<string>();
  const [privateKeyAddress, setPrivateKeyAddress] = useState<string>();
  const [mnemonicPass, setMnemonicPass] = useState<string>();

  useEffect(() => {
    const mn = localStorage.getItem('mn');
    const pk = localStorage.getItem('pk');
    if (mn && pk && password) {
      setObj({
        privateKey: Decrypt(pk, password),
        mnemonic: Decrypt(mn, password),
        address: web3.eth.accounts.privateKeyToAccount(Decrypt(pk, password))
          .address,
      });
    }
  }, [password]);
  console.log(obj);
  return (
    <div style={{ width: '500px' }}>
      <div
      // style={{ ...WRAPPER_STYLE, backgroundColor: !!obj ? 'gray' : 'white' }}
      >
        <h3>create account</h3>
        <input
          value={password}
          // disabled={!!obj}
          onChange={(e) => setPassword(e.target.value)}
          style={INPUT_STYLE}
          placeholder='please input password'
        />
        <button
          style={{ ...BUTTON_STYLE, marginLeft: 10 }}
          // disabled={!!obj}
          onClick={async () => {
            if (!password) return;
            const { address, privateKey, mnemonic } = await createAccount(
              password
            );
            console.log(
              '🚀 ~ file: App.tsx:76 ~ onClick={ ~ mnemonic:',
              address,
              mnemonic
            );

            localStorage.setItem('mn', Encrypt(mnemonic));
            localStorage.setItem('pk', Encrypt(privateKey));
          }}
        >
          create
        </button>
        {<p>created address is: {obj?.address}</p>}
      </div>

      {/* 查看助记词 */}
      {/* 导出私钥 */}

      <div style={WRAPPER_STYLE}>
        <h3>import account by mnemonic</h3>
        <div>
          <input
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            style={INPUT_STYLE}
            placeholder='please input Mnemonic'
          />
        </div>
        <div>
          <input
            value={mnemonicPass}
            onChange={(e) => setMnemonicPass(e.target.value)}
            style={INPUT_STYLE}
            placeholder='please input password'
          />
        </div>

        <button
          style={BUTTON_STYLE}
          onClick={async () => {
            if (!obj || !mnemonic || !mnemonicPass) return;
            const res = importAccountByMnemonic(
              mnemonic,
              mnemonicPass
            )?.address;
            setMnemonicAddress(res);
          }}
        >
          import
        </button>
        {!!mnemonicAddress && <p>imported address is: {mnemonicAddress}</p>}
      </div>

      <div style={WRAPPER_STYLE} hidden={!obj}>
        <h3>import account by privateKey</h3>
        <input
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          style={INPUT_STYLE}
          placeholder='please input privateKey'
        />

        <button
          style={BUTTON_STYLE}
          onClick={async () => {
            if (!obj || !privateKey) return;
            const res = importAccountByPrivateKey(privateKey)?.address;
            setPrivateKeyAddress(res);
          }}
        >
          import
        </button>
        {!!privateKeyAddress && <p>imported address is: {privateKeyAddress}</p>}
      </div>
    </div>
  );
};

export default App;
