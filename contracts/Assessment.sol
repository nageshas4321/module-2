// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function checkCredit(uint256 creditScore) public pure returns (uint256 loanAmount) {
        if (creditScore >= 500 && creditScore < 600) {
            loanAmount = 5000;
        } else if (creditScore >= 600 && creditScore < 700) {
            loanAmount = 6000;
        } else if (creditScore >= 700 && creditScore < 800) {
            loanAmount = 7000;
        } else if (creditScore >= 800 && creditScore < 900) {
            loanAmount = 8000;
        } else if (creditScore >= 900) {
            loanAmount = 9000;
        } else {
            loanAmount = 0;
        }
    }

    function checkCardDigits(string memory cardDigits) public pure returns (bool) {
        return (keccak256(abi.encodePacked(cardDigits)) == keccak256(abi.encodePacked("6837")));
    }
}
