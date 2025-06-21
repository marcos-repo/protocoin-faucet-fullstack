// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProtoCoin is ERC20 {

    address private _owner;
    uint private _mintAmount = 0;
    uint64 private _mintDelay = 60 * 60 * 24;
    
    mapping(address => uint256) private _nextMint;

    constructor() ERC20("ProtoCoin","PTC") {
        _owner = msg.sender;
        _mint(msg.sender, 1_000_000 * 10 ** 18);
    }

    function mint() public {
        require(_mintAmount > 0, "Minting nao habilitado.");
        require(block.timestamp > _nextMint[msg.sender], "Voce nao pode realizar o mint 2x em um dia.");

        _mint(msg.sender, _mintAmount);

        _nextMint[msg.sender] = block.timestamp + _mintDelay;
    }

    function setMintAmount(uint mintAmount) public onlyOwner{
        _mintAmount = mintAmount;
    }

    function setMintDelay(uint64 delayInSecs) public onlyOwner{
        _mintDelay = delayInSecs;
    }

    modifier onlyOwner () {
        require(msg.sender == _owner, "Esta carteira nao tem permissao para executar esta chamada.");
        _;
    }

}
