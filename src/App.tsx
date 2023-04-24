import { useState } from 'react';
import './App.css';
import {
  createAccount,
  importAccountByMnemonic,
  importAccountByPrivateKey,
} from './utils';

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
  return (
    <div style={{ width: '500px' }}>
      <div
        style={{ ...WRAPPER_STYLE, backgroundColor: !!obj ? 'gray' : 'white' }}
      >
        <h3>create account</h3>
        <input
          value={password}
          disabled={!!obj}
          onChange={(e) => setPassword(e.target.value)}
          style={INPUT_STYLE}
          placeholder='please input password'
        />
        <button
          style={{ ...BUTTON_STYLE, marginLeft: 10 }}
          disabled={!!obj}
          onClick={async () => {
            if (obj || !password) return;
            const { address, privateKey, mnemonic } = await createAccount(
              password
            );
            setObj({ address, privateKey, mnemonic });
            console.log(
              '🚀 ~ file: App.tsx:57 ~ onClick={ ~ { address, privateKey, mnemonic }:',
              address,
              privateKey,
              mnemonic
            );
            // const res = importAccountByMnemonic(mnemonic)?.address;
            // console.log(res?.toLowerCase() === address.toLowerCase());
          }}
        >
          create
        </button>
        {!!obj && <p>created address is: {obj.address}</p>}
      </div>

      <div style={WRAPPER_STYLE} hidden={!obj}>
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
