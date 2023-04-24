# My Ether Wallet

## 🎓 Feature

- [x] create account
- [x] import account by Mnemonic/private key/keystore & password
- [ ] send transaction
- [ ] token transaction
- [ ] read & write contract

## 🚀 Quick start

1.  **install dependencies**

    ```shell
    npm install
    ```

2.  **initial env variable**

    ```shell
    cd ether-wallet-visual-demo/
    cp .env.example .env
    ```

3.  **Start developing.**

    start it up.

    ```shell
    npm run dev
    ```

## different config from [ether-wallet-demo](https://github.com/xbank-xiexueni/ether-wallet-demo)

1. install packages browserify

   ```shell
   npm install stream-browserify events process buffer assert
   ```

2. add script to `index.html`

   ```
       <!-- global is undefined  -->
       <script>
         var global = window;
       </script>
       <script type="module">
         import process from 'process';
         import { Buffer } from 'buffer';

         window.Buffer = Buffer;
         window.process = process;
       </script>
   ```

3. add alias to pack config file: `vite.config.ts`

   ```js
   resolve: {
      alias: {
          process: 'process/browser',
          stream: 'stream-browserify',
      },
   }
   ```
