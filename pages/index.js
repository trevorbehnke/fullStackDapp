import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "../src/artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "../src/artifacts/contracts/Token.sol/TrevToken.json";
// import Container from "../components/greeter/greeter";

// Update with the contract address logged out to the CLI when it was deployed
// Local
// const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// Ropsten
// Deployed w/ 0x3DC091C82df597939CF115D1334E7a2885F50Ab8
const greeterAddress = "0x1a4f776d70D734a70cdcedd3C23479C9435Cf83E";
const tokenAddress = "0x387Aef27fc3D8617a7DB2C777525Ebf59EFD9628";

function App() {
  const [greeting, setGreetingValue] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  return (
    <div className=" bg-blue-200 ">
      <header className=" flex flex-col min-h-screen items-center justify-center ">
        <button className="btn" onClick={fetchGreeting}>
          Fetch Greeting
        </button>
        <button className="btn" onClick={setGreeting}>
          Set Greeting
        </button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
        />

        <br />
        <button className="btn" onClick={getBalance}>
          Get Balance
        </button>
        <button className="btn" onClick={sendCoins}>
          Send Coins
        </button>
        <input
          onChange={(e) => setUserAccount(e.target.value)}
          placeholder="Account ID"
        />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </header>
    </div>
  );
}

export default App;
