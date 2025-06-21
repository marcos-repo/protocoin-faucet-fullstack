
import { ethers } from "hardhat";

    async function main() {
        const protocoin = await ethers.deployContract("ProtoCoin");

        await protocoin.waitForDeployment();

        console.log(`Contract deployed at ${protocoin.target}`);
    }

    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });