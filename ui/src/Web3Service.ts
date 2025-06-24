 import Web3 from 'web3';

 import axios from 'axios';

 const API_URL = `${import.meta.env.VITE_API_URL}`;

 export async function mint() {
    if(!window.ethereum)
        throw new Error('Nenhuma Metamask encontrada!');

    const nextMint = localStorage.getItem("nextMint");
    if(nextMint && parseInt(nextMint) > Date.now())
        throw new Error('Voce nao pode realizar o mint 2x em um dia.');

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();

    if(!accounts || !accounts.length) throw new Error('Nenhuma conta autorizada!');

    localStorage.setItem("wallet", accounts[0]);
    localStorage.setItem("nextMint",`${Date.now() + (24 * 60 * 60 * 1000)}`);

    const response = await axios.post(`${API_URL}/mint/${accounts[0]}`);

    return response.data;

 }