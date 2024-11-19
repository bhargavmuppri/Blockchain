import React, { useState } from 'react';
import Web3 from 'web3';
import './App.css';

const productAuthABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "_serialNumber", "type": "string" }
        ],
        "name": "authenticateProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_serialNumber", "type": "string" }
        ],
        "name": "getCurrentOwner",
        "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_serialNumber", "type": "string" }
        ],
        "name": "registerProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_serialNumber", "type": "string" },
            { "internalType": "address", "name": "_newOwner", "type": "address" }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
];

const productAuthAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
    const [serialNumber, setSerialNumber] = useState("");
    const [productName, setProductName] = useState("");
    const [newOwner, setNewOwner] = useState("");
    const [web3, setWeb3] = useState(null);
    const [productAuthContract, setProductAuthContract] = useState(null);
    const [productList, setProductList] = useState([]);

    // Function to connect to MetaMask and set up contract instance
    const connectMetaMask = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                const contract = new web3Instance.eth.Contract(productAuthABI, productAuthAddress);
                setProductAuthContract(contract);

                alert("Connected to MetaMask!");
            } catch (error) {
                console.error("User denied account access", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this app.");
        }
    };

    // Function to register a product on the blockchain and add to local list
    const registerProduct = async () => {
        if (!productAuthContract) {
            alert("Contract not initialized. Please connect to MetaMask first.");
            return;
        }

        const accounts = await web3.eth.getAccounts();
        try {
            await productAuthContract.methods.registerProduct(productName, serialNumber).send({ from: accounts[0] });
            alert("Product registered successfully!");

            // Add the product to the local list for display
            setProductList((prevList) => [
                ...prevList,
                { name: productName, serialNumber: serialNumber, owner: accounts[0] }
            ]);
            setProductName("");
            setSerialNumber("");
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Check console for details.");
        }
    };

    // Function to transfer product ownership on the blockchain and remove it from local list
    const transferOwnership = async () => {
        if (!productAuthContract) {
            alert("Contract not initialized. Please connect to MetaMask first.");
            return;
        }

        const accounts = await web3.eth.getAccounts();
        try {
            await productAuthContract.methods.transferOwnership(serialNumber, newOwner).send({ from: accounts[0] });
            alert("Ownership transferred successfully!");

            // Remove the transferred product from the local product list
            setProductList((prevList) =>
                prevList.filter((product) => product.serialNumber !== serialNumber)
            );
            setNewOwner("");
            setSerialNumber("");
        } catch (error) {
            console.error("Transfer failed:", error);
            alert("Transfer failed. Check console for details.");
        }
    };

    return (
        <div className="App">
            <h1>Product Authentication</h1>
            <button onClick={connectMetaMask}>Connect MetaMask</button>

            <input
                type="text"
                placeholder="Enter Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter Serial Number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
            />
            <button onClick={registerProduct}>Register Product</button>

            <input
                type="text"
                placeholder="New Owner Address"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
            />
            <button onClick={transferOwnership}>Transfer Ownership</button>

            {/* Display Registered Products */}
            <h2>Registered Products</h2>
            {productList.length > 0 ? (
                <ul>
                    {productList.map((product, index) => (
                        <li key={index}>
                            <p>Name: {product.name}</p>
                            <p>Serial Number: {product.serialNumber}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products registered yet.</p>
            )}
        </div>
    );
}

export default App;
