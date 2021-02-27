pragma solidity >=0.4.25 <0.7.0;

contract HTLC {
	struct transaction {
		uint transactionId;
		uint amountFunded;
		uint amountExpected;
		address payable owner;
		address payable recipient;
		address payable expectedAddress;
		uint startTime;
		uint lockTime;
		string secret; 
		bytes32 secretHash;
		bool completed;
		bool refunded;
	}
	
	uint currentTransactionId = 0;
	mapping(uint => transaction) public transactions;
	event fundReceived(uint _currentTransactionId);
	event transactionCompleted(bool _completed);
	event transactionRefunded(bool _refunded);

	function sendFunds(address payable _recipient, bytes32 _secretHash, address payable _expectedAddress, uint _lockTime, uint _amountExpected) public payable {
		require(msg.value>0,"No money Sent");
        transactions[currentTransactionId] = transaction(currentTransactionId, msg.value, _amountExpected, msg.sender, _recipient, _expectedAddress, block.timestamp, _lockTime , "" , _secretHash, false, false);
        emit fundReceived(currentTransactionId);
        currentTransactionId++;
	}

	function getAmountDetails(uint _transactionId) public view returns (uint amountFunded, uint amountExpected) {
		require(transactions[_transactionId].owner == msg.sender || transactions[_transactionId].recipient == msg.sender || transactions[_transactionId].expectedAddress == msg.sender,"You are not Authorized to get the Details !" );
		return(transactions[_transactionId].amountFunded, transactions[_transactionId].amountExpected );
	}
	
	function getTimeLockDetails(uint _transactionId) public view returns (uint startTime, uint lockTime) {
		require(transactions[_transactionId].owner == msg.sender || transactions[_transactionId].recipient == msg.sender || transactions[_transactionId].expectedAddress == msg.sender,"You are not Authorized to get the Details !" );
		return(transactions[_transactionId].startTime, transactions[_transactionId].lockTime);
	}
	
	function getAddressDetails(uint _transactionId) public view returns (address payable owner, address payable recipient, address payable expectedAddress) {
		require(transactions[_transactionId].owner == msg.sender || transactions[_transactionId].recipient == msg.sender || transactions[_transactionId].expectedAddress == msg.sender,"You are not Authorized to get the Details !" );
		return(transactions[_transactionId].owner, transactions[_transactionId].recipient, transactions[_transactionId].expectedAddress);
	}
	
	function getSecretDetails(uint _transactionId) public view returns (string memory secret, bytes32 secretHash) {
		require(transactions[_transactionId].owner == msg.sender || transactions[_transactionId].recipient == msg.sender || transactions[_transactionId].expectedAddress == msg.sender,"You are not Authorized to get the Details !" );
		return(transactions[_transactionId].secret, transactions[_transactionId].secretHash);
	}
	
	function getStatusDetails(uint _transactionId) public view returns (bool completed, bool refunded) {
		require(transactions[_transactionId].owner == msg.sender || transactions[_transactionId].recipient == msg.sender || transactions[_transactionId].expectedAddress == msg.sender,"You are not Authorized to get the Details !" );
		return(transactions[_transactionId].completed, transactions[_transactionId].refunded);
	}
	
	function withdraw(uint _transactionId, string memory _secret) public {
		require(_transactionId < currentTransactionId, "Invalid Transaction Id");
		require(msg.sender == transactions[_transactionId].recipient || msg.sender == transactions[_transactionId].expectedAddress, "You are not Authorised");
        require(transactions[_transactionId].completed==false,"Transaction already completed successfully !");
        require(transactions[_transactionId].startTime + transactions[_transactionId].lockTime >= now ,"Now you can only ask for Refunds.");
		require(keccak256(abi.encodePacked(_secret)) == transactions[_transactionId].secretHash, 'Wrong Secret Key');
		
		transactions[_transactionId].secret = _secret;
        transactions[_transactionId].recipient.transfer(transactions[_transactionId].amountFunded);
        transactions[_transactionId].completed = true;
        transactions[_transactionId].amountFunded = 0;

		emit transactionCompleted(true);
	} 

	function refund(uint _transactionId) public { 
		require(transactions[_transactionId].owner==msg.sender, "You are not Authorised");
        require(transactions[_transactionId].completed==false,"Transaction already completed successfully !");
        require(transactions[_transactionId].refunded==false,"Transaction already refunded");
        require(transactions[_transactionId].amountFunded > 0,"Not enough funds");
        require(transactions[_transactionId].startTime + transactions[_transactionId].lockTime < now ,"Too Early for initiating Refunds");
        
		transactions[_transactionId].owner.transfer(transactions[_transactionId].amountFunded);
        transactions[_transactionId].amountFunded = 0;
        transactions[_transactionId].refunded = true;
		
		emit transactionRefunded(true);
	}
}
