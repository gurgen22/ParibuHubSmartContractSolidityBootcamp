import { HardhatUserConfig } from "hardhat/config";
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

// const INFURA_API_KEY = process.env.INFURA_API_KEY;
// const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const INFURA_API_KEY = "c833d3517aa34e74a43f6ecf3a81bfc5";
const SEPOLIA_PRIVATE_KEY = "f5189ffa577185f387a3116dcfcb4a09665e75c9bf89e6542bd5b5280bcc7b45";//"47fbc1d1a5274ac2838fae2eea303ca1";
if (!INFURA_API_KEY || !SEPOLIA_PRIVATE_KEY) {
  console.error("INFURA_API_KEY or SEPOLIA_PRIVATE_KEY is missing in the .env file.");
  process.exit(1);
}
const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks:  {
    georli: {
      url: "https://goerli.infura.io/v3/eb0043c9ffa14dd4adcb8948340720e1",

    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};

export default config;
