import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import HTLC from "./res/HTLC.json"
import 'bootstrap/dist/css/bootstrap.css';
import Identicon from 'react-identicons'
import  Home from "./Home"
import  RefundHTLC from "./RefundHTLC.js"
import CreateHTLC from './CreateHTLC.js';
import RespondHTLC from './RespondHTLC.js';
import WithdrawHTLC from './WithdrawHTLC.js';
import logo from './res/logo.jpg'
import bg from './res/back.jpg'
import 'reactjs-popup/dist/index.css';

class DetailsHTLC extends Component {


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
  
  constructor(props) {
    super(props)
    this.state = {
      account:'',
      loading:true,
	  detailsFetched: false
    }
  }
  
  getDetails=async(blockchain, network, txId) => {
    var swapcontract2;
    var account2
	this.setState({loading: true});
    var web3;
    if(network==="Ropsten"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/5e1a5f57f69140109fed2374eddfdaba"));
      swapcontract2 = new web3.eth.Contract(HTLC.abi,HTLC.networks[3].address);
      account2 = HTLC.networks[3].address;
    }
    else if(network==="Rinkeby"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/5e1a5f57f69140109fed2374eddfdaba"));
      swapcontract2 = new web3.eth.Contract(HTLC.abi,HTLC.networks[4].address);
      account2 = HTLC.networks[4].address;
    }
    else if(network === "Kovan"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/5e1a5f57f69140109fed2374eddfdaba"));
      swapcontract2 = new web3.eth.Contract(HTLC.abi,HTLC.networks[42].address);
      account2 = HTLC.networks[42].address;
    }
    else if(network === "Goerli"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/5e1a5f57f69140109fed2374eddfdaba"));
      swapcontract2 = new web3.eth.Contract(HTLC.abi,HTLC.networks[5].address);
      account2 = HTLC.networks[5].address;
    }
    
    var account1 = this.state.account;
    swapcontract2.methods.getAmountDetails(txId).call({from: this.state.account}).then(res1 => {
		swapcontract2.methods.getAddressDetails(txId).call({from: this.state.account}).then(res2 => {
			swapcontract2.methods.getSecretDetails(txId).call({from: this.state.account}).then(res3 => {
				swapcontract2.methods.getStatusDetails(txId).call({from: this.state.account}).then(res4 => {
					this.details = {
					...res1,
					...res2,
					...res3,
					...res4
					};
					this.details['amountExpected'] = window.web3.utils.fromWei(this.details['amountExpected'],'ether');
					this.details['amountFunded'] = window.web3.utils.fromWei(this.details['amountFunded'],'ether');
					this.setState({loading:false})
					this.setState({detailsFetched: true});
				},e=>{
					window.alert("Unable to Fetch Details, Please Try again!")
					this.setState({loading:false})
				});
			},e=>{
				window.alert("Unable to Fetch Details, Please Try again!")
				this.setState({loading:false})
			});
		},e=>{
			window.alert("Unable to Fetch Details, Please Try again!")
			this.setState({loading:false})
		});
	},e=>{
      window.alert("Unable to Fetch Details, Please Try again!")
      this.setState({loading:false})
    });
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

generateAutoFilledForm() {
	return(
		<form onSubmit={(event) => {
                      event.preventDefault()
					  const receiverEmailId = this.receiverEmailId.value
                      this.sendFunds(this.details['amountExpected'],this.details['expectedAddress'], this.details['recipient'], this.details['secretHash'], this.details['amountFunded'], receiverEmailId)
                    }}>
					
                    <div className="form-group my-4">
						<div className="float-left">Amount Funded</div>
						<input className="form-control" type="text" value={this.details['amountFunded']} readOnly />
                    </div>
					
					<div className="form-group my-4">
						<div className="float-left">Amount Expected</div>
						<input className="form-control" type="text" value={this.details['amountExpected']} readOnly />
                    </div>
					  
					<div className="form-group my-4">
                        <div className="float-left">Secret Hash</div>
						<input className="form-control" type="text" value={this.details['secretHash']} readOnly/>
                    </div>
					
					<div className="form-group my-4">
                        <div className="float-left">Secret</div>
						<input className="form-control" type="text" value={this.details['secret']} readOnly/>
                    </div>
			
					<div className="form-group my-4">
						<div className="float-left">Owner Address</div>
                        <input className="form-control" type="text" value={this.details['owner']} readOnly/>
                    </div>
					
					<div className="form-group my-4">
						<div className="float-left">Receiver Address</div>
							<input className="form-control" type="text" value={this.details['recipient']} readOnly/>
                    </div>
  
                    <div className="form-group my-4">
						<div className="float-left">Expected Address</div>
                        <input className="form-control" type="text" value={this.details['expectedAddress']} readOnly/>
                    </div>
                    
					<div className="form-group my-4">
						<div className="float-left">Transaction Completed</div>
                        <input className="form-control" type="text" value={this.details['completed']} readOnly/>
                    </div>
                    
					
					<div className="form-group my-4">
						<div className="float-left">Transaction Refunded</div>
                        <input className="form-control" type="text" value={this.details['refunded']} readOnly/>
                    </div>
                    
					
        </form>
					
	);
}

getNetworkOptions() {
	if(this.senderChain === "Ethereum") {
		return(
			["Select Network...",
			"Ropsten",
			"Rinkeby",
			"Goerli",
			"Kovan"]
		);
	}
	else if(this.senderChain === "Tron"){
		return (
			["Select Network...",
			"Shasta"]
		);
	}
	else {
		return([]);
	}
}

generateGetDetailsForm() {
	return(
		<form onSubmit={(event) => {
                      event.preventDefault()
					  this.getDetails(this.senderChain,this.senderNetwork,this.transactionId.value);
                    }}>
					<div className="form-group my-4" >
                        <div className="float-left">Blockchain Name</div>
							<select class="form-control" id="senderChain" onChange={(e) => {this.senderChain = e.target.options[e.target.options.selectedIndex].innerHTML;this.setState({loading: false})}} >
								<option selected disabled>Select Network...</option>
								<option value='ETH'>Ethereum</option>
								<option value='TRX'>Tron</option>
							</select>
							<small className="form-text text-muted">Blockchain Name from which you want to fetch details</small>
						</div>
					
					<div className="form-group my-4" >
                        <div className="float-left">Blockchain Network</div>
							<select class="form-control" id="senderNetwork" onChange={(e) => {this.senderNetwork = e.target.options[e.target.options.selectedIndex].innerHTML}} >
		
							{this.getNetworkOptions().map((item) =>{
								if(item === "Select Network...") {
									return(
										<option selected disabled>{item}</option>
									);
								}
								else{
									return(
										<option>{item}</option>
									);
								}
							} )}
							</select>
							<small className="form-text text-muted">Blockchain Network from which you want to fetch details</small>
					</div> 
					
                    <div className="form-group my-4" >
						<div className="float-left">Transaction Id</div>
						<input className="form-control" type="text" placeholder="Transaction Id" ref={(input) => { this.transactionId = input }} required />
                    </div>
					  
					<button style = {{fontSize:20}} className = "btn btn-primary btn-sm my-4">Submit</button>
        </form>
	);
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
					<div style={{filter: this.state.loading?'blur(1px)':''}}>
						{
							this.state.detailsFetched?this.generateAutoFilledForm():this.generateGetDetailsForm()
                    	}
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

export default DetailsHTLC;
