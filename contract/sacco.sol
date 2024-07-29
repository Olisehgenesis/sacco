// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CircularSavings {
    IERC20 public cUSDToken;

    struct SavingGroup {
        uint256 amount;
        uint256 turnDuration;
        uint256 maxParticipants;
        uint256 startDate;
        address[] participants;
        bool isActive;
        uint256 currentTurn;
        uint256 totalContributed;
    }

    SavingGroup[] public savingGroups;

    event GroupCreated(uint256 groupId, address creator);
    event UserJoinedGroup(uint256 groupId, address user);
    event ContributionMade(uint256 groupId, address contributor, uint256 amount);
    event FundsDistributed(uint256 groupId, address recipient, uint256 amount);
    event GroupClosed(uint256 groupId);

    constructor(address _cUSDTokenAddress) {
        cUSDToken = IERC20(_cUSDTokenAddress);
    }

    function createSavingGroup(uint256 _amount, uint256 _turnDuration, uint256 _maxParticipants, uint256 _startDate) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(_turnDuration > 0, "Turn duration must be greater than 0");
        require(_maxParticipants > 1, "Max participants must be greater than 1");
        require(_startDate > block.timestamp, "Start date must be in the future");

        SavingGroup memory newGroup = SavingGroup({
            amount: _amount,
            turnDuration: _turnDuration,
            maxParticipants: _maxParticipants,
            startDate: _startDate,
            participants: new address[](0),
            isActive: true,
            currentTurn: 0,
            totalContributed: 0
        });

        savingGroups.push(newGroup);
        emit GroupCreated(savingGroups.length - 1, msg.sender);
    }

    function joinSavingGroup(uint256 _groupId) public {
        require(_groupId < savingGroups.length, "Group does not exist");
        SavingGroup storage group = savingGroups[_groupId];
        require(group.isActive, "Group is not active");
        require(group.participants.length < group.maxParticipants, "Group is full");
        require(block.timestamp < group.startDate, "Group has already started");

        group.participants.push(msg.sender);
        emit UserJoinedGroup(_groupId, msg.sender);
    }

    function contributeToGroup(uint256 _groupId) public {
        require(_groupId < savingGroups.length, "Group does not exist");
        SavingGroup storage group = savingGroups[_groupId];
        require(group.isActive, "Group is not active");
        require(block.timestamp >= group.startDate, "Group has not started yet");
        require(group.currentTurn < group.participants.length, "All turns completed");

        uint256 contributionAmount = group.amount;
        require(cUSDToken.transferFrom(msg.sender, address(this), contributionAmount), "Transfer failed");

        group.totalContributed += contributionAmount;
        emit ContributionMade(_groupId, msg.sender, contributionAmount);

        if (group.totalContributed == group.amount * group.participants.length) {
            distributeFunds(_groupId);
        }
    }

    function distributeFunds(uint256 _groupId) internal {
        SavingGroup storage group = savingGroups[_groupId];
        require(group.isActive, "Group is not active");
        require(group.currentTurn < group.participants.length, "All turns completed");

        address recipient = group.participants[group.currentTurn];
        uint256 distributionAmount = group.amount * group.participants.length;

        require(cUSDToken.transfer(recipient, distributionAmount), "Transfer failed");
        emit FundsDistributed(_groupId, recipient, distributionAmount);

        group.currentTurn++;
        group.totalContributed = 0;

        if (group.currentTurn == group.participants.length) {
            closeGroup(_groupId);
        }
    }

    function closeGroup(uint256 _groupId) internal {
        SavingGroup storage group = savingGroups[_groupId];
        require(group.isActive, "Group is not active");
        require(group.currentTurn == group.participants.length, "Not all turns completed");

        group.isActive = false;
        emit GroupClosed(_groupId);
    }

    function getGroupCount() public view returns (uint256) {
        return savingGroups.length;
    }

    function getGroupDetails(uint256 _groupId) public view returns (
        uint256 amount,
        uint256 turnDuration,
        uint256 maxParticipants,
        uint256 startDate,
        uint256 participantCount,
        bool isActive,
        uint256 currentTurn,
        uint256 totalContributed
    ) {
        require(_groupId < savingGroups.length, "Group does not exist");
        SavingGroup storage group = savingGroups[_groupId];
        return (
            group.amount,
            group.turnDuration,
            group.maxParticipants,
            group.startDate,
            group.participants.length,
            group.isActive,
            group.currentTurn,
            group.totalContributed
        );
    }
}