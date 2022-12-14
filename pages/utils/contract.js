import Contract from "web3-eth-contract";
import erc721json from "../utils/erc721addr.json";

const contractAddress = "0xf3A0Eb18D7beE438AB58e2b0a48aeF27D0b3C355";

export async function makeNFT(address) {
  try {
    var contract = new Contract(erc721json, contractAddress);
    contract.methods.safeMint(address).send({ from: address });
    return true;
  } catch (e) {
    return e;
  }
}
