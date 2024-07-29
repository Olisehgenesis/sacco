

# Circular Savings DApp

## Overview

The Circular Savings DApp is a decentralized application built on the Celo blockchain that allows users to participate in circular savings groups. In these groups, participants contribute a fixed amount of cUSD (Celo Dollar) per turn, and the collected funds are distributed to participants in a round-robin manner. Once all participants have received their turn, the group closes.

## Features

- **User Registration**: Users can register with their name, email, and phone number.
- **Saving Groups**: Users can create and join saving groups with specific details including amount per turn, turn duration, maximum participants, and start date.
- **Contribution**: Participants contribute to the group each turn.
- **Distribution**: Funds are distributed to participants based on their turn.
- **Group Management**: The contract automatically closes the group once all turns are completed.

## Smart Contract

The smart contract is written in Solidity and includes the following components:

1. **User Struct**: Stores user information.
2. **SavingGroup Struct**: Stores details of the saving group including amount, turn duration, maximum participants, and participants.
3. **Functions**:
    - `registerUser`: Allows users to register.
    - `createSavingGroup`: Lets users create a new saving group.
    - `joinSavingGroup`: Allows users to join a saving group before it starts.
    - `contributeToGroup`: Enables users to contribute their share to the group.
    - `distributeFunds`: Distributes collected funds to the participant based on their turn.
    - `closeGroup`: Closes the group once all turns are completed.
    - `viewGroupDetails`: Provides details of a specific saving group.

## How to Run

### 1. Deploy the Smart Contract

Deploy the Solidity smart contract to the Celo blockchain using tools like Remix or Truffle. Update the `CircularSavingsAddress` constant in `main.js` with the deployed contract address.

### 2. Setup the Frontend

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**
   Ensure you have the necessary libraries included in `index.html`:
    - Bootstrap for styling
    - Web3.js and @celo/contractkit for interacting with the blockchain

3. **Update Configuration**
    - Replace `YOUR_CONTRACT_ADDRESS_HERE` with your actual deployed contract address in `main.js`.
    - Ensure that the ABI of the smart contract is included in the `circularSavingsAbi` variable.

### 3. Run the Application

Open `index.html` in a web browser. Ensure that you have the Celo Extension Wallet installed and connected. The application should automatically detect the wallet and allow you to interact with the DApp.

## Interaction

1. **Register**: Register with your details to start using the DApp.
2. **Create a Saving Group**: Use the "Create Saving Group" button to create a new saving group with your desired parameters.
3. **Join a Saving Group**: Join an existing saving group before it starts.
4. **Contribute**: Contribute your share each turn when the group is active.
5. **View Details**: View the details of any saving group to monitor progress and participation.

## Notes

- **cUSD Token**: The contract relies on the cUSD token for transactions. Ensure that you have sufficient cUSD in your wallet and that the contract has been approved to spend your cUSD.
- **Error Handling**: Error messages will be displayed in the notification area if any issues arise during interactions.
- **Security**: Make sure to review the smart contract for security and gas efficiency before deploying it to a production environment.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
customize this README further based on any additional features or specific instructions related to your project.