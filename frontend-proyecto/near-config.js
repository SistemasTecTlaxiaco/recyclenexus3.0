// near-config.js
import { connect, keyStores, WalletConnection, Contract } from 'near-api-js';

const nearConfig = {
  networkId: "testnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
  contractName: "luz01.testnet" // Reemplaza con tu nombre de contrato
};

async function initContract() {
  console.log('Iniciando conexión con NEAR...');
  const near = await connect(nearConfig);
  const walletConnection = new WalletConnection(near);

  if (!walletConnection.isSignedIn()) {
    console.log('Solicitando inicio de sesión...');
    walletConnection.requestSignIn(nearConfig.contractName);
  }

  const accountId = walletConnection.getAccountId();
  const contract = new Contract(walletConnection.account(), nearConfig.contractName, {
    changeMethods: ['registerUser', 'addMessage', 'uploadEvidence'],
    viewMethods: ['getMessages', 'totalMessages', 'getUserTokens'],
    sender: accountId
  });

  console.log('Conexión con NEAR establecida.');
  return { walletConnection, contract };
}

export { initContract };
