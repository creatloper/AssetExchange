import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import HTLC from "./res/HTLC.json"
import 'bootstrap/dist/css/bootstrap.css';
import Identicon from 'react-identicons'
import  Home from "./Home"
import  RefundHTLC from "./RefundHTLC.js"
import RespondHTLC from './RespondHTLC.js';
import DetailsHTLC from './DetailsHTLC.js';
import WithdrawHTLC from './WithdrawHTLC.js';
import CreateHTLC from './CreateHTLC.js';
import logo from './res/logo.jpg'
import bg from './res/back.jpg'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import credentials from "./Credentials.json";
import XLSX from "xlsx";
var price = require('crypto-price');
var Personal = require('web3-eth-personal');
var wb = XLSX.utils.book_new();
var st = []
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

class GenerateData extends Component {


  renderHome(){
    ReactDOM.render(<Home />, document.getElementById('root'));
  }

  renderCreateHTLC(){
    ReactDOM.render(<CreateHTLC />, document.getElementById('root'));
  }
 
  renderRespondHTLC(){
ReactDOM.render(<RespondHTLC />, document.getElementById('root'));
  }

  renderDetailsHTLC(){
ReactDOM.render(<DetailsHTLC />, document.getElementById('root'));
  }
 
  renderWithdrawHTLC() {
ReactDOM.render(<WithdrawHTLC />, document.getElementById('root'));
  }
   
  renderRefundHTLC(){
    ReactDOM.render(<RefundHTLC />, document.getElementById('root'));
  }

  async componentWillMount() {
await this.loadWeb3("Ethereum")
    await this.loadBlockchainData("Ethereum")
  }
 
  async loadWeb3(network) {
 if(network === 'Ethereum') {
if (window.ethereum) {
window.web3 = new Web3(window.ethereum)
await window.ethereum.enable()
}
else if (window.web3) {
window.web3 = new Web3(window.web3.currentProvider)
}
else {
window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
}
 }
 else if(network === 'Tron') {
console.log("Tron");
 }
  }

  async loadBlockchainData(network) {
 if(network === 'Ethereum') {
const web3 = window.web3
const accounts = await web3.eth.getAccounts()
this.setState({ account: accounts[0] })
const networkId = await web3.eth.net.getId()
this.setState({networkId})

const networkData = HTLC.networks[networkId]
if(networkData) {
const htlc = new web3.eth.Contract(HTLC.abi, networkData.address)
this.setState({ htlc })
} else {
window.alert('SwapContract not deployed to detected network.')
}

 }
 else if(network=== 'Tron') {
 console.log('Tron')
this.setState({ account: 'abc' })
this.setState({networkId : 2})
this.setState({loading: false})
 }
  }
 
  constructor(props) {
    super(props)
    this.state = {
      account:'',
      loading:true,
    }
  }
 
 
  sendFunds=()=>{
let amountFunded = 1;
amountFunded = window.web3.utils.toWei(amountFunded.toString(),'Ether')
const lockTime = 86400;
this.state.htlc.methods.sendFunds("0xB90222ebE2DaD8A4A10AD269750b48DD5256A27C", "0xfd69353b27210d2567bc0ade61674bbc3fc01a558a61c2a0cb2b13d96f9387cd", "0xBEe680b90AE6590be4FB5575869Cab7B814052F9", lockTime, 1).send({ from: this.state.account , value:1})
.on('transactionHash', function(hash){
console.log(hash)
})
.then(result =>
{
const txId = result.events.fundReceived.returnValues._currentTransactionId

window.alert("Your Unique Transaction Id is : "+ txId)

},e=>{
window.alert("Transaction Failed")
})
  }


  render() {

    return(
        <button onClick={this.sendFunds}>send</button>
    );
  }
}

export default GenerateData;
