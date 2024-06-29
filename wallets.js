import axios from "axios";
import dotenv from 'dotenv';
dotenv.config()

const { API_BASE_URL, CYPHER_TOKEN } = process.env;

console.log(API_BASE_URL, CYPHER_TOKEN, 'asda')

export const receivingWallet = {
  address: "mqhsrHYC9AAaJtG3Wqcwt8dog2Wqqiqrve",
  privateKey: "cRBg8PPzUy93w8uwXUxYSCRSF6PoNWfBdengZP7UJFJCDLuSZrc5",
};

export const sendingWallet = {
  address: "mfZreXLT4ApxeYoWPNKVxyYZ82SZ5ZmR1L",
  privateKey: "cPCVCEaPbbohPmSrywWvqrEoG5mLgCo88FJ94j5Ekkkhgkga1pNw",
};

export const checkBalance = async (address) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/addrs/${address}/balance?token=${CYPHER_TOKEN}`
    );
    console.log("BALANCE:", response.data);
  } catch (err) {
    console.log(err);
  }
};

checkBalance(sendingWallet.address);
