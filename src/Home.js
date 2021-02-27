import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './res/logo.jpg';
import CreateHTLC from './CreateHTLC.js';
import RespondHTLC from './RespondHTLC.js';
import DetailsHTLC from './DetailsHTLC.js';
import WithdrawHTLC from './WithdrawHTLC.js';
import RefundHTLC from './RefundHTLC.js';

class Home extends Component{

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

	render(){
		return(
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
				</nav>
				<div className="jumbotron" >
				  <h1 className="display-4"><strong>ASSET EXCHANGE STOP</strong>	</h1>
				  <p className="blockquote">This is a one stop solution for Ethereum Blockchain Interoperability</p>
				  <hr className="my-4"/>
				  <h4>The Future of Cross Chain Coin Swaps</h4>
				   <a className="btn btn-primary btn-lg" href="https://cointelegraph.com/explained/blockchain-interoperability-explained" rel="noopener noreferrer" role="button" target="_blank">Learn more</a>
				</div>
				<h5 align="center">DEVELOPERS:</h5>
				<div className="container" align="center">
					<span className="mx-5 py-5"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BALJEET SINGH&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</strong></span>
					<span className="mx-5 py-5"><strong>&nbsp;&nbsp;ARNAV JAIN</strong></span>
				</div>
				<footer className="page-footer font-small blue">
					<div className="footer-copyright text-center py-3">
						<p>© 2020 Copyright: Developed Through Trust</p>
					</div>	
				</footer>
			</div>
		);
	}
}
export default Home;