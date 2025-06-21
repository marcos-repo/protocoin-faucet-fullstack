import {
  loadFixture,
  time
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ProtoCoin Tests", function () {

  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const ProtoCoin = await hre.ethers.getContractFactory("ProtoCoin");
    const protocoin = await ProtoCoin.deploy();

    return { protocoin, owner, otherAccount };
  }

  it("Should have correct name", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const name = await protocoin.name();
      expect(name).eq("ProtoCoin");
    });

  it("Should have correct symbol", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const symbol = await protocoin.symbol();
      expect(symbol).eq("PTC");
    });

  it("Should have correct decimals", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const decimals = await protocoin.decimals();
      expect(decimals).eq(18);
    });

  it("Should have total supply", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const totalSupply = await protocoin.totalSupply();
      const decimals = await protocoin.decimals();
      expect(totalSupply).eq(1_000_000n * 10n ** decimals);
    });

  it("Should get balance", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const balanceOf = await protocoin.balanceOf(owner);
      const decimals = await protocoin.decimals();
      expect(balanceOf).eq(1_000_000n * 10n ** decimals);
    });

  it("Should transfer", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;

      const totalSupply = await protocoin.totalSupply();
      await protocoin.transfer(otherAccount.address, value);

      const balanceOfOwner = await protocoin.balanceOf(owner.address);
      const balanceOfotherAccount = await protocoin.balanceOf(otherAccount.address);
      
      expect(balanceOfOwner).eq(totalSupply - value);
      expect(balanceOfotherAccount).eq(value);
    });
  
  it("Should NOT transfer", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const instance = protocoin.connect(otherAccount);

      await expect(instance.transfer(owner.address, 1n))
            .to
            .be
            .revertedWithCustomError(protocoin, "ERC20InsufficientBalance")
    });


    it("Should approve", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      await protocoin.approve(otherAccount.address, 1n);

      const value = await protocoin.allowance(owner.address, otherAccount.address);
      expect(value).eq(1n);
    });

    it("Should transfer from", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;

      await protocoin.approve(otherAccount.address, 1_000_000);

      const instance = protocoin.connect(otherAccount);
      await instance.transferFrom(owner.address, otherAccount.address, value);

      const allowance = await protocoin.allowance(owner, otherAccount.address);
      expect(allowance).eq(0);

      const balanceOtherAccount = await protocoin.balanceOf(otherAccount.address);
      expect(balanceOtherAccount).eq(value);
    });

    it("Should NOT transfer from", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;
      
      const instance = protocoin.connect(otherAccount);

      await expect(instance.transferFrom(owner.address, otherAccount.address, value))
            .to
            .be
            .revertedWithCustomError(protocoin, "ERC20InsufficientAllowance");
    });

    it("Should NOT transfer - from balance", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;
      
      const instance = protocoin.connect(otherAccount);

      await expect(instance.transferFrom(otherAccount.address, otherAccount.address, value))
            .to
            .be
            .revertedWithCustomError(protocoin, "ERC20InsufficientAllowance");
    });

    it("Should NOT transfer from", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;
      
      const instance = protocoin.connect(otherAccount);

      await expect(instance.transferFrom(owner.address, otherAccount.address, value))
            .to
            .be
            .revertedWithCustomError(protocoin, "ERC20InsufficientAllowance");
    });

    it("Should NOT transfer from - no allowance limit", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;

      await protocoin.approve(otherAccount.address, 1_000_000);
      const instance = protocoin.connect(otherAccount);

      await expect(instance.transferFrom(owner.address, otherAccount.address, value + 10n))
            .to
            .be
            .revertedWithCustomError(protocoin, "ERC20InsufficientAllowance");
    });

    it("Should mint once", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const mintAmount = 1000n;
      await protocoin.setMintAmount(mintAmount);

      const balanceBefore = await protocoin.balanceOf(otherAccount.address);
      const instance = protocoin.connect(otherAccount);
      await instance.mint();
      const balanceAfter = await protocoin.balanceOf(otherAccount.address);

      expect(balanceAfter).eq(balanceBefore + mintAmount);
    });

    it("Should mint twice (different account)", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const mintAmount = 1000n;
      await protocoin.setMintAmount(mintAmount);

      
      const balanceOwnerBefore = await protocoin.balanceOf(owner.address);
      await protocoin.mint();
      const balanceOwnerAfter = await protocoin.balanceOf(owner.address);

      const balanceOtherAccountBefore = await protocoin.balanceOf(otherAccount.address);
      const instance = protocoin.connect(otherAccount);
      await instance.mint();
      const balanceOtherAccountAfter = await protocoin.balanceOf(otherAccount.address);

      expect(balanceOwnerAfter).eq(balanceOwnerBefore + mintAmount);
      expect(balanceOtherAccountAfter).eq(balanceOtherAccountBefore + mintAmount);
    });

    it("Should mint twice (different moment)", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const mintDelay = 60 * 60 * 24;
      const mintAmount = 1000n;
      await protocoin.setMintAmount(mintAmount);

      const balanceOtherAccountBefore = await protocoin.balanceOf(otherAccount.address);
      const instance = protocoin.connect(otherAccount);
      await instance.mint();

      await time.increase(mintDelay * 2);

      await instance.mint();
      const balanceOtherAccountAfter = await protocoin.balanceOf(otherAccount.address);

      expect(balanceOtherAccountAfter).eq(balanceOtherAccountBefore + (mintAmount * 2n));
    });

    it("Should NOT mint", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const instance = protocoin.connect(otherAccount);      

      await expect(instance.mint())
            .to
            .be
            .revertedWith("Minting nao habilitado.");
    });

    it("Should NOT set mint amount", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const mintAmount = 1000n;
      const instance = protocoin.connect(otherAccount);      

      await expect(instance.setMintAmount(mintAmount))
            .to
            .be
            .revertedWith("Esta carteira nao tem permissao para executar esta chamada.");
    });

    it("Should NOT set mint delay", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const mintDelay = 1000n;
      const instance = protocoin.connect(otherAccount);      

      await expect(instance.setMintDelay(mintDelay))
            .to
            .be
            .revertedWith("Esta carteira nao tem permissao para executar esta chamada.");
    });

    it("Should NOT mint twice", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const mintDelay = 60 * 60 * 24;
      const mintAmount = 1000n;
      await protocoin.setMintAmount(mintAmount);

      const balanceOtherAccountBefore = await protocoin.balanceOf(otherAccount.address);
      const instance = protocoin.connect(otherAccount);
      await instance.mint();
      await expect(instance.mint())
            .to
            .be
            .revertedWith("Voce nao pode realizar o mint 2x em um dia.");
    });
});

//FAZER O DEPLOY ANTES DO COMMIT