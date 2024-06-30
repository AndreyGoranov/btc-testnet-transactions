import axios from "axios";
import dotenv from 'dotenv';
dotenv.config()

const { BLOCKSTREAM_API_BASE } = process.env;

export const receivingWallet = {
  address: "mqhsrHYC9AAaJtG3Wqcwt8dog2Wqqiqrve",
  privateKey: "cRBg8PPzUy93w8uwXUxYSCRSF6PoNWfBdengZP7UJFJCDLuSZrc5",
};

export const sendingWallet = {
  address: "mfZreXLT4ApxeYoWPNKVxyYZ82SZ5ZmR1L",
  privateKey: "cPCVCEaPbbohPmSrywWvqrEoG5mLgCo88FJ94j5Ekkkhgkga1pNw",
};

// Moving to https://github.com/Blockstream/esplora/blob/master/API.md

export const checkBalance = async (address) => {
  try {
    const url = `${BLOCKSTREAM_API_BASE}/address/${address}/utxo`;
    console.log(`Fetching balance for address: ${address}`);
    console.log(`Using URL: ${url}`);

    // Fetch UTXOs for the address
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('UTXOs fetched:', response.data);

    // Calculate the total balance by summing the value of all UTXOs
    const balance = response.data.reduce((sum, utxo) => sum + utxo.value, 0);

    console.log("BALANCE:", balance);
  } catch (err) {
    console.error('Error fetching balance:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
      console.error('Response headers:', err.response.headers);
    }
  }
};
