
const {deployProxy , upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const {
    BN,
    constants,
    expectEvent,
    expectRevert,
    time,
} = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const TokenUp = artifacts.require("TokenUp");
const Token2 = artifacts.require("Token2");


// Truffle in questo modo distribuisce i contratti sulla blockchain
// di ganache utilizzando gli account generati da lei stessa (in questo caso il deployer sarà l'account 0)
module.exports = async(deployer, network, accounts) => {
    deployer = accounts[0];

    const tokenName = "Token Upgradeable"
    const tokenSymbol = "TU"
    const totSupply = 1000000;

    if (network == 'development') {
        let IS_UPGRADE = false;

        // Se ho già deployato il toke una volta devo usare questo indirizzo nel quale è stato deployato la prima volta
        let TOKEN_ADDRESS = "" //todo;

        if (IS_UPGRADE) {
            console.log('Token is being upgraded...');
            // Qua gli do in pasto il contratto nuovo che dovrà sostituire l'altro
            const tokenInstance = await upgradeProxy(TOKEN_ADDRESS, Token2, { from: deployer});
            console.log(`New Token deployed @: ${tokenInstance.address}`);
            console.log('Token owner: ', await tokenInstance.owner());
        } else {
            console.log("Token is being deployed...");
            let tokenInstance = await deployProxy(TokenUp, [tokenName, tokenSymbol, totSupply], {from: deployer});
            console.log("Token deployed @: ", tokenInstance.address);
            console.log('Token owner: ', await tokenInstance.owner());
        }

    } else if (network == "dashboard"){
        // setto a true per richiamare l'altra parte del codice
        let IS_UPGRADE = false;
        
        // indirizzo prima del proxy iniziale e poi del token address
        let TOKEN_ADDRESS = "0x415dEAEA9cfd3ad1F9EB35503585210Cf329E053"

        if(IS_UPGRADE){
            console.log('Token is being upgraded...');
            const tokenInstance = await upgradeProxy(TOKEN_ADDRESS, Token2, { from: deployer });
            console.log(`New Token deployed @: ${tokenInstance.address}`)
        }
        else{
            console.log('Token is being deployed...');
            const tokenInstance = await deployProxy(TokenUp, [tokenName, tokenSymbol, totSupply], { from: deployer });
            console.log("Token deployed @: ", tokenInstance.address);
            console.log('Token owner: ', await tokenInstance.owner());
        }

    }
    
}