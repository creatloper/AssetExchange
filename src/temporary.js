import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import HTLC from "./abis/HTLC.json"
import 'bootstrap/dist/css/bootstrap.css';
import Identicon from 'react-identicons';
// import Send from "./Send"
// import Check from "./Check"
import  Home from"./Home"
import credentials from "./credentials.json";
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
// import  Refund from "./Refund"


function myFunctionKeyShow(){

  var x = document.getElementById("privateKey");
    if (x.type === "password"){
      x.type = "text";
    } else{
      x.type = "password";
    }
}


class Verify extends Component {

  renderHome(){
    ReactDOM.render(<Home />, document.getElementById('root'));
  }

  renderSend(){
    // ReactDOM.render(<Send />, document.getElementById('root'));
  }
  renderCheck(){
    // ReactDOM.render(<Check />, document.getElementById('root'));
  }

  renderVerify(){
    ReactDOM.render(<Verify />, document.getElementById('root'));
  }
  renderRefund(){
    // ReactDOM.render(<Refund />, document.getElementById('root'));
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
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

  async loadBlockchainData() {
    var web3 = window.web3
    var accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    var networkId = await web3.eth.net.getId()
    this.setState({networkId})
    var networkData = HTLC.networks[networkId]
    if(networkData) {
      var swapcontract = new web3.eth.Contract(HTLC.abi, networkData.address)
      this.setState({ swapcontract })
      this.setState({ loading: false})
    } else {
      window.alert('SwapContract not deployed to detected network.')
    }
  }
  
  sendEmail=(mail, secretKey) => {
    const body = "The secret key of the transaction is ( is "+secretKey+"."
    window.Email.send({
    Host: credentials.Host,
    Username: credentials.Username,
    Password: credentials.Password,
    To: mail,
    From: credentials.From,
    Subject: credentials.Subject,
    Body: body
    })
    .then(function (message) {
    console.log(message)
    });
      }

  constructor(props) {
    super(props)
    this.state = {
      account:'',
      loading:true,
    }
    this.verifyFunds = this.verifyFunds.bind(this)
  }

  

  getNetworkName(){
    if(this.state.networkId === 3){
      return "Ropsten"
    }if(this.state.networkId === 42){
      return "Kovan"
    }if(this.state.networkId === 4){
      return "Rinkeby"
    }if(this.state.networkId === 5){
      return "Goerli"
    }if(this.state.networkId === 5777){
      return "Ganache"
    }
  }

  render() {
    console.log(this.state.account);
    console.log(this.state.networkId);
    console.log(this.state.swapcontract);
    console.log(this.state.loading);
    return (
      <div>
        <nav style={{backgroundColor:"#263238"}}className="navbar navbar-expand-lg ">
          <a className="navbar-brand" href="http://localhost:3000/">
            <img src="a.gif" width="60" height="50" alt="HTLC" style={{borderRadius:"50%"}}/>
          </a>
          <button style={{fontSize:"30px",color:"white"}}  className="btn btn-link" onClick={this.renderHome}>HTLC</button>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav mr-auto">
                  <button className="btn btn-secondary  mx-2" onClick={this.renderSend}>Initiate Transaction</button>
                  <button className="btn btn-secondary  mx-2" onClick={this.renderSend}>Respond to Transaction</button>
                  <button className="btn btn-secondary  mx-2" onClick={this.renderHome}>Details of Transaction</button>
                <button className="btn btn-secondary  mx-2" onClick={this.renderVerify}>Withdraw Funds</button>
                  <button className="btn btn-secondary  mx-2" onClick={this.renderRefund}>Refund</button>
              </div>
            </div>    
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <span className='text-white' id="account">{this.state.account}</span>
              </li>
            </ul>
            { 
              this.state.account ? <Identicon string= {this.state.account} size='35' bg='white'/> : <span></span>
            }
        </nav>
        <footer className="page-footer font-small blue">
          <div className="footer-copyright text-center py-3 ">
            <p>© 2020 Copyright: Developed Through Trust</p>
          </div>  
        </footer> 
      </div>
      </div>
    );
  }
}

export default Verify;