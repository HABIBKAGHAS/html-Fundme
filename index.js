import { ethers } from "./ethers-5.6.esm.min.js";

import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const FundBtn = document.getElementById("FundBtn");
const balanceBtn = document.getElementById("balanceBtn");
const WithdrawBtn = document.getElementById("WithdrawBtn");
connectBtn.onclick = connect;
FundBtn.onclick = fund;
balanceBtn.onclick = getBalance;
WithdrawBtn.onclick = withdraw;
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("connectBtn").innerHTML = "Connected";
    console.log("Connected to Metamask");
  } else {
    alert("Please install MetaMask");
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function fund() {
  if (typeof window.ethereum !== "undefined") {
    const ethAmount = document.getElementById("ethAmount").value;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("done");
    } catch (error) {
      console.log(error);
    }
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
      console.log("done!");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionRespone, provider) {
  console.log(`Mining ${transactionRespone.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionRespone.hash, (transactionReciept) => {
      console.log(
        `completed with ${transactionReciept.confirmations} confirmations`
      );
      resolve();
    });
  });
}
