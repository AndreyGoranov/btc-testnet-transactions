import bitcore from 'bitcore-lib';
import axios from 'axios';

const { PrivateKey, Networks, Transaction } = bitcore;

// Replace with your actual private key in WIF format
const privateKeyWIF = 'cPCVCEaPbbohPmSrywWvqrEoG5mLgCo88FJ94j5Ekkkhgkga1pNw';
// Create a private key object from the WIF
const privateKey = PrivateKey.fromWIF(privateKeyWIF);

// Derive the source address from the private key
const sourceAddress = privateKey.toAddress(Networks.testnet).toString();
console.log('Source Address:', sourceAddress);

// Replace with the actual destination address
const destinationAddress = 'mqhsrHYC9AAaJtG3Wqcwt8dog2Wqqiqrve';
// Amount to send in satoshis (1 BTC = 100,000,000 satoshis)
const satoshisToSend = 10000;

// Base URL for Blockstream's testnet API
const BLOCKSTREAM_API_BASE = 'https://blockstream.info/testnet/api';

// Function to fetch UTXOs for a given address
async function getUTXOs(address) {
  console.log('Fetching UTXOs for address:', address);
  const response = await axios.get(`${BLOCKSTREAM_API_BASE}/address/${address}/utxo`);
  console.log('UTXOs fetched:', response.data);
  return response.data.map(utxo => ({
    txId: utxo.txid,
    outputIndex: utxo.vout,
    address: sourceAddress,
    script: bitcore.Script.buildPublicKeyHashOut(sourceAddress).toString(),
    satoshis: utxo.value
  }));
}

// Function to broadcast a transaction to the network
async function broadcastTransaction(txHex) {
  console.log('Broadcasting transaction hex:', txHex);
  const response = await axios.post(`${BLOCKSTREAM_API_BASE}/tx`, txHex, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
  console.log('Transaction broadcast response:', response.data);
  return response.data;
}

// Main function to create and send a transaction
async function createAndSendTransaction() {
  try {
    // Step 1: Fetch unspent outputs (UTXOs) for the source address
    const utxos = await getUTXOs(sourceAddress);

    // Step 2: Create the transaction
    console.log('Creating transaction...');
    const transaction = new Transaction()
      .from(utxos) // Specify the UTXOs as inputs
      .to(destinationAddress, satoshisToSend) // Specify the recipient and amount
      .change(sourceAddress) // Specify the change address
      .sign(privateKey); // Sign the transaction with the private key

    console.log('Transaction created and signed:', transaction.toString());

    // Step 3: Serialize the transaction to hex format
    const txHex = transaction.serialize();
    console.log('Serialized transaction hex:', txHex);

    // Step 4: Broadcast the transaction to the network
    const txId = await broadcastTransaction(txHex);

    console.log('Transaction broadcasted successfully:', txId);
  } catch (error) {
    console.error('Error creating and sending transaction:', error);
  }
}

createAndSendTransaction();
