let web3;
let contract;
let accounts;

const abi = [
    {
        "inputs": [],
        "name": "confirmDelivery",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "refundBuyer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_buyer",
                "type": "address"
            },
            {
                "internalType": "address payable",
                "name": "_seller",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_escrowAgent",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "amount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "buyer",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "currentState",
        "outputs": [
            {
                "internalType": "enum Escrow.State",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "escrowAgent",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "seller",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
let contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            accounts = await web3.eth.getAccounts();
            console.log("Connected account:", accounts[0]);
            document.getElementById("connectedAddress").textContent = `Connected account: ${accounts[0]}`;
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
        }
    } else {
        alert("MetaMask is not installed. Please install it to use this app.");
    }
}

async function disconnectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            web3 = null;
            contract = null;
            accounts = null;
            console.log("Wallet disconnected");
            document.getElementById("connectedAddress").textContent = "";
        } catch (error) {
            console.error("Error disconnecting from MetaMask:", error);
        }
    } else {
        alert("MetaMask is not installed. Please install it to use this app.");
    }
}

async function createContract() {
    if (!web3 || !accounts) {
        alert("Please connect to MetaMask first.");
        return;
    }

    const buyer = document.getElementById('buyer').value;
    const seller = document.getElementById('seller').value;
    const escrowAgent = document.getElementById('escrowAgent').value;

    contract = new web3.eth.Contract(abi, contractAddress);
    await contract.methods.constructor(buyer, seller, escrowAgent).send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '30000000000'
    });

    console.log("Contract deployed at:", contractAddress);
}

async function deposit() {
    if (!web3 || !contract || !accounts) {
        alert("Please connect to MetaMask and create the contract first.");
        return;
    }

    await contract.methods.deposit().send({
        from: accounts[0],
        value: web3.utils.toWei("1", "ether")
    });
}

async function confirmDelivery() {
    if (!web3 || !contract || !accounts) {
        alert("Please connect to MetaMask and create the contract first.");
        return;
    }

    await contract.methods.confirmDelivery().send({
        from: accounts[0]
    });
}

async function refundBuyer() {
    if (!web3 || !contract || !accounts) {
        alert("Please connect to MetaMask and create the contract first.");
        return;
    }

    await contract.methods.refundBuyer().send({
        from: accounts[0]
    });
}
