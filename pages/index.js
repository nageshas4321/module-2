import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [cardDigits, setCardDigits] = useState("");
  const [creditScore, setCreditScore] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;
  const correctDigits = "6837"; // Correct last four digits of the card

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm && cardDigits === correctDigits) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    } else {
      alert("Incorrect card digits. Transaction aborted.");
    }
  };

  const withdraw = async () => {
    if (atm && cardDigits === correctDigits) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    } else {
      alert("Incorrect card digits. Transaction aborted.");
    }
  };

  const handleInputChange = (event) => {
    setCardDigits(event.target.value);
  };

  const checkCredit = () => {
    if (creditScore >= 500 && creditScore < 600) {
      setLoanAmount(5000);
    } else if (creditScore >= 600 && creditScore < 700) {
      setLoanAmount(6000);
    } else if (creditScore >= 700 && creditScore < 800) {
      setLoanAmount(7000);
    } else if (creditScore >= 800 && creditScore < 900) {
      setLoanAmount(8000);
    } else if (creditScore >= 900) {
      setLoanAmount(9000);
    } else {
      setLoanAmount(0);
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="content">
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <input
          type="text"
          value={cardDigits}
          onChange={handleInputChange}
          placeholder="Enter last four digits of your card"
        />
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <br />
        <input
          type="number"
          value={creditScore}
          onChange={(e) => setCreditScore(parseInt(e.target.value))}
          placeholder="Enter your credit score"
        />
        <button onClick={checkCredit}>Check Credit</button>
        {loanAmount > 0 && <p>Eligible Loan Amount: ${loanAmount}</p>}
        {loanAmount === 0 && <p>No loan available with the provided credit score.</p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: green;
          font-family: 'Arial', sans-serif;
          font-size: 18px;
          color: white;
        }

        .content {
          padding: 20px;
        }

        input[type="text"],
        input[type="number"] {
          margin: 5px;
          padding: 5px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        button {
          margin: 5px;
          padding: 8px 20px;
          border: none;
          border-radius: 5px;
          background-color: #4CAF50;
          color: white;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </main>
  );
}
