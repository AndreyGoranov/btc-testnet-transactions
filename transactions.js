import axios from "axios";
import { sendingWallet, receivingWallet } from "./wallets";
const { API_BASE_URL, CYPHER_TOKEN } = process.env;

const VALUE_IN_SATOSHIS = 1000; // Value in satoshis

const newtx = {
  inputs: [{ addresses: [sendingWallet] }],
  outputs: [{ addresses: [receivingWallet], value: VALUE_IN_SATOSHIS }]
};

async function createTransaction() {
  try {
    const response = await axios.post(`${API_BASE_URL}/txs/new?token=${CYPHER_TOKEN}`, newtx);
    console.log('Unsigned TX:', response.data);
  } catch (error) {
    console.error('Error creating transaction:', error);
  }
}

createTransaction();

const axios = require('axios');
const bitcore = require('bitcore-lib');

const API_BASE_URL = 'https://api.blockcypher.com/v1/btc/test3';
const FROM_ADDRESS = 'YOUR_FROM_TESTNET_ADDRESS_HERE';
const TO_ADDRESS = 'YOUR_TO_TESTNET_ADDRESS_HERE';
const PRIVATE_KEY_WIF = 'YOUR_PRIVATE_KEY_WIF_HERE'; // Wallet Import Format of your private key
const API_KEY = 'YOUR_API_KEY_HERE';
const VALUE_IN_SATOSHIS = 10000; // Value in satoshis

const newtx = {
  inputs: [{ addresses: [FROM_ADDRESS] }],
  outputs: [{ addresses: [TO_ADDRESS], value: VALUE_IN_SATOSHIS }]
};

async function createAndSignTransaction() {
  try {
    // Step 1: Create the transaction skeleton
    const response = await axios.post(`${API_BASE_URL}/txs/new?token=${API_KEY}`, newtx);
    const txSkeleton = response.data;
    console.log('Unsigned TX:', txSkeleton);

    // Step 2: Sign the transaction using bitcore-lib
    const privateKey = bitcore.PrivateKey.fromWIF(PRIVATE_KEY_WIF);
    const transaction = new bitcore.Transaction();

    // Add inputs to the transaction
    txSkeleton.tx.inputs.forEach((input, index) => {
      transaction.from({
        txId: input.prev_hash,
        outputIndex: input.output_index,
        script: bitcore.Script(input.script),
        satoshis: input.output_value
      });
    });

    // Add the output to the transaction
    transaction.to(TO_ADDRESS, VALUE_IN_SATOSHIS);

    // Sign the transaction
    transaction.sign(privateKey);

    // Convert the signed transaction to the required format
    txSkeleton.signatures = txSkeleton.tosign.map((tosign, index) => {
      const signature = bitcore.crypto.ECDSA.sign(Buffer.from(tosign, 'hex'), privateKey);
      return signature.toString('hex');
    });

    // Step 3: Send the signed transaction
    const sendResponse = await axios.post(`${API_BASE_URL}/txs/send?token=${API_KEY}`, txSkeleton);
    console.log('Send TX:', sendResponse.data);
  } catch (error) {
    console.error('Error creating or sending transaction:', error);
  }
}

createAndSignTransaction();

