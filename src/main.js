// Import necessary libraries
const Web3 = require('web3');
const ContractKit = require('@celo/contractkit');
const BigNumber = require('bignumber.js');

// Set up constants
const ERC20_DECIMALS = 18;
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
const CircularSavingsAddress = "0xD1A62274DeA4d8bBE623baf783f6d2aC6d615F92";

let kit;
let contract;
let savingGroups = [];

// Connect to Celo wallet
const connectCeloWallet = async function () {
    if (window.celo) {
        try {
            notification("⚠️ Please approve this DApp to use it.");
            await window.celo.enable();
            notificationOff();

            const web3 = new Web3(window.celo);
            kit = ContractKit.newKitFromWeb3(web3);

            const accounts = await kit.web3.eth.getAccounts();
            kit.defaultAccount = accounts[0];

            contract = new kit.web3.eth.Contract(circularSavingsAbi, CircularSavingsAddress);
        } catch (error) {
            notification(`⚠️ ${error}.`);
        }
    } else {
        notification("⚠️ Please install the CeloExtensionWallet.");
    }
};

// Get user balance
const getBalance = async function () {
    const totalBalance = await kit.getTotalBalance(kit.defaultAccount);
    const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
    document.querySelector("#balance").textContent = cUSDBalance;
};

// Get all saving groups
const getSavingGroups = async function() {
    const _groupsLength = await contract.methods.getGroupCount().call();
    const _groups = [];

    for (let i = 0; i < _groupsLength; i++) {
        let _group = new Promise(async (resolve, reject) => {
            let g = await contract.methods.savingGroups(i).call();
            resolve({
                index: i,
                amount: new BigNumber(g.amount),
                turnDuration: g.turnDuration,
                maxParticipants: g.maxParticipants,
                startDate: new Date(g.startDate * 1000),
                participants: g.participants,
                isActive: g.isActive
            });
        });
        _groups.push(_group);
    }
    savingGroups = await Promise.all(_groups);
    renderGroups();
};

// Render saving groups
function renderGroups() {
    document.getElementById("savingGroupsList").innerHTML = "";
    savingGroups.forEach((_group) => {
        const newDiv = document.createElement("div");
        newDiv.className = "col-md-4";
        newDiv.innerHTML = groupTemplate(_group);
        document.getElementById("savingGroupsList").appendChild(newDiv);
    });
}

// Group template
function groupTemplate(_group) {
    return `
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">Saving Group #${_group.index}</h5>
                <p class="card-text">Amount per turn: ${_group.amount.shiftedBy(-ERC20_DECIMALS).toFixed(2)} cUSD</p>
                <p class="card-text">Turn duration: ${_group.turnDuration} days</p>
                <p class="card-text">Participants: ${_group.participants.length}/${_group.maxParticipants}</p>
                <p class="card-text">Start date: ${_group.startDate.toLocaleDateString()}</p>
                <button class="btn btn-primary joinBtn" id="${_group.index}" ${Date.now() > _group.startDate.getTime() || _group.participants.length >= _group.maxParticipants ? 'disabled' : ''}>
                    Join Group
                </button>
            </div>
        </div>
    `;
}

// Notification functions
function notification(_text) {
    document.querySelector(".alert").style.display = "block";
    document.querySelector("#notification").textContent = _text;
}

function notificationOff() {
    document.querySelector(".alert").style.display = "none";
}

// Create new saving group
document.querySelector("#newGroupBtn").addEventListener("click", async (e) => {
    const params = [
        new BigNumber(document.getElementById("newGroupAmount").value)
            .shiftedBy(ERC20_DECIMALS)
            .toString(),
        document.getElementById("newGroupTurnDuration").value,
        document.getElementById("newGroupMaxParticipants").value,
        Math.floor(new Date(document.getElementById("newGroupStartDate").value).getTime() / 1000)
    ];

    notification(`⌛ Creating new saving group...`);
    try {
        const result = await contract.methods
            .createSavingGroup(...params)
            .send({ from: kit.defaultAccount });
        notification(`🎉 You successfully created a new saving group.`);
        getSavingGroups();
    } catch (error) {
        notification(`⚠️ ${error}.`);
    }
});

// Join saving group
document.querySelector("#savingGroupsList").addEventListener("click", async (e) => {
    if (e.target.className.includes("joinBtn")) {
        const index = e.target.id;
        notification(`⌛ Joining saving group...`);
        try {
            await contract.methods
                .joinSavingGroup(index)
                .send({ from: kit.defaultAccount });
            notification(`🎉 You successfully joined the saving group.`);
            getSavingGroups();
        } catch (error) {
            notification(`⚠️ ${error}.`);
        }
    }
});

// Load the DApp
window.addEventListener('load', async () => {
    notification("⌛ Loading...");
    await connectCeloWallet();
    await getBalance();
    await getSavingGroups();
    notificationOff();
});