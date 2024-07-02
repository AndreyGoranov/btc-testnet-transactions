import axios from "axios";
import bitcore from "bitcore-lib";
import {
  getUTXOs,
  broadcastTransaction,
  createAndSendTransaction,
} from "./btcTransactions.js";

jest.mock("axios");

describe("Bitcoin Transaction Functions", () => {
  const mockAddress = "mfZreXLT4ApxeYoWPNKVxyYZ82SZ5ZmR1L";

  describe("getUTXOs", () => {
    it("should fetch and return UTXOs", async () => {
      const mockResponse = {
        data: [
          { txid: "txid1", vout: 0, value: 5000 },
          { txid: "txid2", vout: 1, value: 7000 },
        ],
      };

      axios.get.mockResolvedValue(mockResponse);

      const utxos = await getUTXOs(mockAddress);

      expect(axios.get).toHaveBeenCalledWith(
        `https://blockstream.info/testnet/api/address/${mockAddress}/utxo`
      );
      expect(utxos).toEqual([
        {
          txId: "txid1",
          outputIndex: 0,
          address: mockAddress,
          script: bitcore.Script.buildPublicKeyHashOut(mockAddress).toString(),
          satoshis: 5000,
        },
        {
          txId: "txid2",
          outputIndex: 1,
          address: mockAddress,
          script: bitcore.Script.buildPublicKeyHashOut(mockAddress).toString(),
          satoshis: 7000,
        },
      ]);
    });
  });

  describe("broadcastTransaction", () => {
    it("should broadcast the transaction and return the response", async () => {
      const mockTxHex = "mockTxHex";
      const mockResponse = { data: "mockTxId" };

      axios.post.mockResolvedValue(mockResponse);

      const txId = await broadcastTransaction(mockTxHex);

      expect(axios.post).toHaveBeenCalledWith(
        "https://blockstream.info/testnet/api/tx",
        mockTxHex,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      expect(txId).toBe("mockTxId");
    });
  });

  // describe("createAndSendTransaction", () => {
  //   it("should create, sign, and broadcast a transaction", async () => {
  //     const mockUTXOs = [
  //       {
  //         txid: "txid1",
  //         vout: 0,
  //         value: 15000,
  //       },
  //     ];

  //     const mockTxId = "mockTxId";

  //     axios.get.mockResolvedValueOnce({ data: mockUTXOs });
  //     axios.post.mockResolvedValueOnce({ data: mockTxId });

  //     await createAndSendTransaction();

  //     expect(console.log).toHaveBeenCalledWith(
  //       "Transaction created and signed:",
  //       expect.any(String)
  //     );

  //     // Check logs
  //     expect(console.log).toHaveBeenCalledWith(
  //       "Fetching UTXOs for address:",
  //       mockAddress
  //     );
  //     expect(console.log).toHaveBeenCalledWith("UTXOs fetched:", mockUTXOs);
  //     expect(console.log).toHaveBeenCalledWith("Creating transaction...");
  //     expect(console.log).toHaveBeenCalledWith(
  //       "Serialized transaction hex:",
  //       expect.any(String)
  //     );
  //     expect(console.log).toHaveBeenCalledWith(
  //       "Transaction broadcasted successfully:",
  //       mockTxId
  //     );
  //   });
  // })x

  afterEach(() => {
    jest.clearAllMocks();
  });
});
