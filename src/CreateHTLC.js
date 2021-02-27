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
import logo from './res/logo.jpg'
import bg from './res/back.jpg'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import credentials from "./Credentials.json";
var price = require('crypto-price');
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

class CreateHTLC extends Component {


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
	let aScript = document.createElement('script');
	aScript.type = 'text/javascript';
	aScript.src = "https://smtpjs.com/v3/smtp.js";
	document.head.appendChild(aScript);
	
	this.styleComponent()
	await this.loadWeb3()
    await this.loadBlockchainData()
  }
  
  styleComponent() {
	document.body.style.backgroundImage = `url(${bg})`;
	document.body.style.backgroundRepeat = "no-repeat";
	document.body.style.backgroundAttachment = "fixed";
	document.body.style.backgroundSize = "cover";	
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
    const web3 = window.web3	
	
	const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    this.setState({networkId})
	
    const networkData = HTLC.networks[networkId]
    if(networkData) {
      const htlc = new web3.eth.Contract(HTLC.abi, networkData.address)
      this.setState({ htlc })
      this.setState({ loading: false})
    } else {
      window.alert('SwapContract not deployed to detected network.')
    }

  }

  getConversionRate=async() => {
	this.setState({ loading: true})
	if(this.senderCrypto === undefined || this.receiverCrypto === undefined) {
		window.alert('Please enter valid Blockchain Networks')
	}
	let obj1 = await price.getCryptoPrice('USD', this.senderCrypto);
	let obj2 = await price.getCryptoPrice('USD', this.receiverCrypto);
	const temp = (obj1.price/obj2.price);
	this.conversionRate = temp;
	document.getElementById("crypto1rate").value = 1;
	document.getElementById("crypto1rate").readOnly = true;
	document.getElementById("crypto2rate").value = temp;
	document.getElementById("crypto2rate").readOnly = true;
	this.setState({ loading: false})
  }
  
  getKeccakHash=(secret) => {
	const keccak256 = require('keccak256');	
	const secretHash = "0x" + keccak256(secret).toString('hex');
	return(secretHash);
  }
  
  sendEmail=(mail, txId) => {
	const body = "The transaction Id of the transaction involving your wallet address on ethereum blockchain (" + this.getNetworkName() +" Network) is "+txId+"."
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
  }
  
  sendFunds=(amountFunded, receiverAddress, expectedAddress, secretHash, amountExpected, receiverEmailId)=>{
    this.setState({ loading: true })
    var pointCount=0;
    for(var i=0;i< amountFunded.length; i++) {
      if(!((amountFunded[i]>='0' && amountFunded[i]<='9')||amountFunded[i]==='.')){
        window.alert("Invalid Amount Entered")
        this.setState({loading:false})
        return;
      }
      if(amountFunded[i]==='.'){
        pointCount++;
        if(pointCount>1){
          window.alert("Invalid Amount Entered")
          this.setState({loading:false})
          return;
        }
      }
    }
    if(receiverAddress.length===42 && receiverAddress[0]==='0' && receiverAddress[1]==='x'){
      for(i=2;i<42;i++){
        if(!((receiverAddress[i]>='0'&&receiverAddress[i]<='9') || (receiverAddress[i]>='a' && receiverAddress[i]<='f') || (receiverAddress[i]>='A' && receiverAddress[i]<='F'))){
          window.alert("Invalid Address Entered")
          this.setState({loading:false})
          return;
        }
      }
    }else{
      window.alert("Invalid Address Entered")
      this.setState({loading:false})
      return;
    }

    if(expectedAddress.length===42 && expectedAddress[0]==='0' && expectedAddress[1]==='x'){
      for(i=2;i<42;i++){
        if(!((expectedAddress[i]>='0'&&expectedAddress[i]<='9') || (expectedAddress[i]>='a' && expectedAddress[i]<='f') || (expectedAddress[i]>='A' && expectedAddress[i]<='F'))){
          window.alert("Invalid Expected Address Entered")
          this.setState({loading:false})
          return;
        }
      }
    }else{
      window.alert("Invalid Expected Address Entered")
      this.setState({loading:false})
      return;
    }

    if(secretHash.length===66 && secretHash[0]==='0' && secretHash[1]==='x'){
      for(i=2;i<64;i++){
        if(!((secretHash[i]>='0'&&secretHash[i]<='9') || (secretHash[i]>='a' && secretHash[i]<='f') || (secretHash[i]>='A' && secretHash[i]<='F'))){
          window.alert("Invalid Secret Hash Entered")
          this.setState({loading:false})
          return;
        }
      }
    }else{
      window.alert("Invalid Secret Hash Entered")
      this.setState({loading:false})
      return;
    }
	
	if(emailRegex.test(receiverEmailId) === false) {
	  window.alert("Invalid Receiver Email Id Entered")
      this.setState({loading:false})
      return;
	}
	
    amountFunded = window.web3.utils.toWei(amountFunded.toString(),'Ether')
	amountExpected = window.web3.utils.toWei(amountExpected.toString(),'Ether')
	const lockTime = 900;
    this.state.htlc.methods.sendFunds(receiverAddress, secretHash, expectedAddress, lockTime, amountExpected).send({ from: this.state.account , value:amountFunded}).then(result => 
    {
	  const txId = result.events.fundReceived.returnValues._currentTransactionId
      window.alert("Your Unique Transaction Id is : "+ txId)
      this.sendEmail(receiverEmailId, txId)
      this.setState({loading:false})
    },e=>{
      window.alert("Transaction Failed")
      this.setState({loading:false})
    })
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

    return (
      <div>
	  
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<a className="navbar-brand">
				<img src={logo} onClick={this.renderHome} width="60" height="50" alt="ETHEREUM EXCHANGE"/>
			</a>
				<h2 class='text-white text-center' align='center'>HTLC</h2>
				<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
				<div className="navbar-nav mr-auto">
					<button className="btn btn-secondary btn-lg mx-3" onClick={this.renderCreateHTLC}>Create</button>
				    <button className="btn btn-secondary btn-lg mx-3" onClick={this.renderRespondHTLC}>Respond</button>
				    <button className="btn btn-secondary btn-lg mx-3" onClick={this.renderDetailsHTLC}>Details</button>
				    <button className="btn btn-secondary btn-lg mx-3" onClick={this.renderWithdrawHTLC}>Withdraw</button>
				    <button className="btn btn-secondary btn-lg mx-3" onClick={this.renderRefundHTLC}>Refund</button>
				</div>
				</div>  
          	<ul className="navbar-nav px-3">
            	<li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              	<span className='text-white' id="account">{this.state.account}</span>
            	</li>
          	</ul>
          	{ 
          		this.state.account ?  <Identicon string={this.state.account} size='30'/> : <span></span>
            }
        </nav>
		
		
		
		<div style={{paddingTop : "2%",paddingBottom : "2%"}}>
			<div class="card bg-light" style={{ width: '40%', marginLeft: '58%'}}>
				<div class="card-body">
					<div className="container">
						<div className="row">
							<main role="main" className="col-lg-12 text-center">
								<div className="content mr-auto ml-auto colour-red">
									<h5 className="mt-2 text-danger" align="center" ><strong>You Are Transferring On {this.getNetworkName()} Network</strong></h5> 
									{   
										this.state.loading ? <div id="loader" style={{zIndex: '1'}} className="spinner-border text-primary text-center"></div> : null
									}  
					<div style={{display: 'flex', flexDirection: 'column', filter: this.state.loading?'blur(1px)':''}}>
                    <form onSubmit={(event) => {
                      event.preventDefault()
					  const receiverEmailId = this.receiverEmailId.value
					  const secretHash = this.secretHash.value
					  const amountFunded = this.fundAmount.value
					  const amountExpected = this.conversionRate * amountFunded
                      const receiverAddress = this.addressOfReceiver.value
                      const expectedAddress = this.expectedAddress.value
                      this.sendFunds(amountFunded, receiverAddress, expectedAddress, secretHash, amountExpected, receiverEmailId)
                    }}>
					<div className="form-group my-4">
                        <div className="float-left">Sender Blockchain</div>
							<select class="form-control" id="senderChain" onChange={(e) => {this.senderCrypto = e.target.value; document.getElementById('crypto1').innerHTML = e.target.value; if(this.receiverCrypto!== undefined){this.getConversionRate();}}} >
								<option selected disabled>Select Network...</option>
								<option value='ETH'>Ethereum</option>
								<option value='TRX'>Tron</option>
							</select>
							<small className="form-text text-muted">Blockchain Network on which you want to send Funds</small>
						</div>
					
					<div className="form-group my-4">
                        <div className="float-left">Receiver Blockchain</div>
							<select class="form-control" id="receiverChain" onChange={(e) => {this.receiverCrypto = e.target.value; document.getElementById('crypto2').innerHTML = e.target.value;if(this.senderCrypto!== undefined){this.getConversionRate();}}} >
								<option selected disabled>Select Network...</option>
								<option value='ETH'>Ethereum</option>
								<option value='TRX'>Tron</option>
							</select>
							<small className="form-text text-muted">Blockchain Network on which you want to receive Funds</small>
					</div>
					
					<div className="input-group"> 
						<input id='crypto1rate' type="text" className="form-control" />
						<span id='crypto1' className="input-group-text"></span>
						<span className="input-group-text">=</span>
						<input id='crypto2rate' type="text" className="form-control" readonly />
						<span id='crypto2' className="input-group-text" style={{borderLeft: "0", borderRight: "0"}}></span> 			
					</div> 
					
                    <div className="form-group my-4">
						<div className="float-left">Amount</div>
						<input id="fundAmount" className="form-control" type="text" placeholder="Amount Of Funds You Want To Send" ref={(input) => { this.fundAmount = input }} required />
                    </div>
					  
					<div className="form-group my-4">
                        <div className="float-left">Secret Hash</div>
							<div className="float-right">
								<Popup trigger={<button id='popupBtn' class="btn btn-sm"><i class="fa fa-fw fa-question-circle"></i></button>} position="bottom right">
								<div >
									<input type='text' placeholder='Enter your secret key' onChange={(e) => {document.getElementById('keccakHash').textContent = this.getKeccakHash(e.target.value)}}></input>
									<p style={{overflow: 'hidden', whiteSpace: 'nowrap', width: '100%',textOverflow: 'ellipsis'}} id='keccakHash'></p>
									<p>  Click<button  class="btn btn-sm" onClick={() => {document.getElementById('secretHash').value = document.getElementById('keccakHash').textContent;document.getElementById('popupBtn').click()}}><i class="fa fa-fw fa-copy"></i></button>to copy hash</p>
								</div>
								</Popup>
							</div>
							<input id="secretHash" className="form-control" type="text" placeholder="Hash Value of the Secret key using Keccak256 function" ref={(input) => { this.secretHash = input }} required />
                    </div>
			
					<div className="form-group my-4">
						<div className="float-left">Receiver Address</div>
							<input id="addressOfReceiver" className="form-control" type="text" placeholder="Address Of Receiver Wallet (On The Same Network)" ref={(input) => { this.addressOfReceiver = input }} required />
                        <small className="form-text text-muted">Receiver Address On Same Network That They Asked You To Send Funds On</small>
                    </div>
  
                    <div className="form-group my-4">
						<div className="float-left">Expected Address</div>
                        <input id="expectedAddress" className="form-control" type="text" placeholder="Address Of Your Wallet (On The Other Network)" ref={(input) => { this.expectedAddress = input }} required />
							<small className="form-text text-muted">The Other Person Is Expected To Send The Funds On This Address On Other Network</small>
                    </div>
                    
					<div className="form-group my-4">
						<div className="float-left">Email Id of Receiver</div>
                        <input id="email" className="form-control" type="email" placeholder="Enter Receiver's Email Id " ref={(input) => { this.receiverEmailId = input }} required />
                    </div>
					
					<button style = {{fontSize:20}} className = "btn btn-primary btn-sm my-4">Send Funds</button>
                    </form>
                    </div>
					</div>
					</main>
				</div>
			</div>
		</div>
	</div>
	</div> 
</div>
    );
  }
}

export default CreateHTLC;
