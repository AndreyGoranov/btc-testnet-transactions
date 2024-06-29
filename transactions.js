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
