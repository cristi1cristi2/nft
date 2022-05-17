import web3 from './web3';
import EduChain from '../abis/EduChain.json';

export const getContract = async  () => {

const id =  await web3.eth.net.getId();
const networkData = EduChain.networks[id]; 
const address = networkData.address;
const abi = EduChain.abi;
const c = new web3.eth.Contract(abi, address)
return c;
}

export const getCurrAccount = async () => {

const accounts = await web3.eth.getAccounts();
return accounts[0];
}