// walletService.js

/**
 * Connects to the selected wallet.
 * @param {string} selectedWallet - The name of the wallet to connect.
 * @returns {Promise<Object>} - The wallet API object.
 */
export const connectWallet = async (selectedWallet) => {
    if (!selectedWallet) {
      throw new Error('No wallet selected');
    }
  
    try {
      const api = await window.midnight[selectedWallet].enable();
      return api;
    } catch (error) {
      throw new Error('Authorization error: ' + error.message);
    }
  };
  
  /**
   * Checks if the DApp is authorized.
   * @param {string} selectedWallet - The name of the connected wallet.
   * @returns {Promise<boolean>} - Authorization status.
   */
  export const checkAuthorization = async (selectedWallet) => {
    if (!selectedWallet) {
      throw new Error('No wallet selected');
    }
  
    try {
      const enabled = await window.midnight[selectedWallet].isEnabled();
      return enabled;
    } catch (error) {
      throw new Error('Error checking authorization status: ' + error.message);
    }
  };
  
  /**
   * Retrieves the wallet state.
   * @param {Object} walletApi - The wallet API object.
   * @returns {Promise<Object>} - The wallet state.
   */
  export const getWalletState = async (walletApi) => {
    if (!walletApi) return null;
    try {
      const state = await walletApi.state();
      return state;
    } catch (error) {
      throw new Error('Error retrieving wallet state: ' + error.message);
    }
  };
  
  /**
   * Sends a transaction using transferTransaction method.
   * @param {Object} walletApi - The wallet API object.
   * @param {string} recipientAddress - The recipient's address.
   * @param {number} amount - The amount to send.
   * @param {string} tokenType - The type of token.
   * @returns {Promise<Object>} - The submitted transaction object.
   */
  export const sendTransaction = async (walletApi, recipientAddress, amount, tokenType = 'dust') => {
    if (!walletApi || !recipientAddress) {
      throw new Error('Wallet is not connected or recipient address is empty');
    }
  
    try {
      // Construct the transfer transaction
      console.log(walletApi);
      const transactionToSubmit = await walletApi.balanceAndProveTransaction([
        {
          // eslint-disable-next-line no-undef
          amount: BigInt(amount),
          tokenType: 'dust',
          receiverAddress: recipientAddress,
        },
      ]);
  
      // Submit the transaction
      const submittedTx = await walletApi.submitTransaction(transactionToSubmit);
      return submittedTx;
    } catch (error) {
      throw new Error('Transaction error: ' + error.message);
    }
  };
  