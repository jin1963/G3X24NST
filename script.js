const contractAddress = "0x18d9d27fbf87306aefe2a4a9c1d9e62ccb3635f0";
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";

let web3;
let account;
let stakingContract;
let tokenContract;

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        stakingContract = new web3.eth.Contract(stakingABI, contractAddress);
        tokenContract = new web3.eth.Contract([
            { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
        ], tokenAddress);
        document.getElementById("walletAddress").innerText = "Wallet: " + account;
    } else {
        alert("Please install MetaMask to use this dApp!");
    }
});

document.getElementById("connectWallet").onclick = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById("walletAddress").innerText = "Wallet: " + account;
};

// Approve
document.getElementById("approveBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    const weiAmount = web3.utils.toWei(amount, "ether");
    await tokenContract.methods.approve(contractAddress, weiAmount).send({ from: account });
    document.getElementById("status").innerText = "Approved " + amount + " G3X";
};

// Stake
document.getElementById("stakeBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    const duration = document.getElementById("stakeDuration").value;
    const weiAmount = web3.utils.toWei(amount, "ether");
    await stakingContract.methods.stake(weiAmount, duration).send({ from: account });
    document.getElementById("status").innerText = "Staked " + amount + " G3X";
};

// Claim
document.getElementById("claimBtn").onclick = async () => {
    const index = document.getElementById("claimIndex").value;
    await stakingContract.methods.claim(index).send({ from: account });
    document.getElementById("status").innerText = "Claimed Reward at Index: " + index;
};

// Unstake
document.getElementById("unstakeBtn").onclick = async () => {
    const index = document.getElementById("unstakeIndex").value;
    await stakingContract.methods.unstake(index).send({ from: account });
    document.getElementById("status").innerText = "Unstaked at Index: " + index;
};
