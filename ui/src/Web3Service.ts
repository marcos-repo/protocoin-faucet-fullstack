 import Web3 from 'web3';
 import ProtoCoinABI from './contracts/abi/protocoin-abi.json';

const VITE_PROTOCOIN_ADDRESS = `${import.meta.env.VITE_PROTOCOIN_ADDRESS}`;

 export async function mint() {
    if(!window.ethereum)
        throw new Error('Nenhuma Metamask encontrada!');

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();

    if(!accounts || !accounts.length) throw new Error('Nenhuma conta autorizada!');

    const contract = new web3.eth.Contract(
                        ProtoCoinABI, 
                        VITE_PROTOCOIN_ADDRESS, 
                        {from: accounts[0]}
                    );

    const tx = await contract.methods.mint().send();

    console.log(tx.transactionHash);

    return tx.transactionHash;
 }