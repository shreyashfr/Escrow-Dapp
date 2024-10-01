// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    address public buyer;
    address payable public seller;
    address public escrowAgent;
    uint public amount;

    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE, REFUNDED }
    State public currentState;

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this method");
        _;
    }

    modifier onlyEscrowAgent() {
        require(msg.sender == escrowAgent, "Only escrow agent can call this method");
        _;
    }

    constructor(address _buyer, address payable _seller, address _escrowAgent) {
        buyer = _buyer;
        seller = _seller;
        escrowAgent = _escrowAgent;
        currentState = State.AWAITING_PAYMENT;
    }

    function deposit() external payable onlyBuyer {
        require(currentState == State.AWAITING_PAYMENT, "Already paid");
        require(msg.value > 0, "Deposit must be greater than 0");
        amount = msg.value;
        currentState = State.AWAITING_DELIVERY;
    }

    function confirmDelivery() external onlyBuyer {
        require(currentState == State.AWAITING_DELIVERY, "Cannot confirm delivery");
        seller.transfer(amount);
        currentState = State.COMPLETE;
    }

    function refundBuyer() external onlyEscrowAgent {
        require(currentState == State.AWAITING_DELIVERY, "Cannot refund at this stage");
        payable(buyer).transfer(amount);
        currentState = State.REFUNDED;
    }
}
