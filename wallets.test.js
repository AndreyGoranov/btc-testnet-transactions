import axios from "axios";
import { checkBalance } from "./wallets.js";

jest.mock("axios");

describe("checkBalance", () => {
  it("should return the correct balance", async () => {
    const address = "mqhsrHYC9AAaJtG3Wqcwt8dog2Wqqiqrve";
    const mockResponse = {
      data: [
        { txid: "txid1", vout: 0, value: 5000 },
        { txid: "txid2", vout: 1, value: 7000 },
      ],
    };

    axios.get.mockResolvedValue(mockResponse);

    console.log = jest.fn(); // Mock console.log to suppress logs during tests

    await checkBalance(address);

    // Check if the correct logs were produced
    expect(console.log).toHaveBeenCalledWith(
      `Fetching balance for address: ${address}`
    );
    expect(console.log).toHaveBeenCalledWith(
      `Using URL: https://blockstream.info/testnet/api/address/${address}/utxo`
    );
    expect(console.log).toHaveBeenCalledWith(
      "UTXOs fetched:",
      mockResponse.data
    );
    expect(console.log).toHaveBeenCalledWith("BALANCE:", 12000);
  });

  it("should handle errors correctly", async () => {
    const address = "mqhsrHYC9AAaJtG3Wqcwt8dog2Wqqiqrve";
    const errorMessage = "Network Error";

    axios.get.mockRejectedValue(new Error(errorMessage));

    console.error = jest.fn(); // Mock console.error to suppress logs during tests

    await checkBalance(address);

    // Check if the correct error logs were produced
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching balance:",
      errorMessage
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });
});
