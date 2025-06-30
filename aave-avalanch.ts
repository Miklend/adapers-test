import { Abi, Address, createPublicClient, http } from 'viem';
import { avalanche } from 'viem/chains';


const ALCHEMY_API_KEY = '';

const client = createPublicClient({
  chain: avalanche,
  transport: http(`https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`), 
});

const fullAbi = [{
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
}] as const;

const address: Address = '0x50B4a66bF4D41e6252540eA7427D7A933Bc3c088';
const functionName = 'balanceOf';
const args : [Address] = ['0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'];

async function getRawResult(
    address: Address, 
    fullAbi: Abi, 
    functionName: string, 
    args: unknown[] = []
) {
  const abi = fullAbi.filter(item => 
    item.type === 'function' && 
    item.name === functionName
  );
  if (abi.length === 0) throw new Error(`Method ${functionName} not found in ABI`);

  const result = await client.readContract({
    address,
    abi,
    functionName,
    args,
  });
  console.log('Result:', result);
  return result;
}

getRawResult(address, fullAbi, functionName, args).catch(console.error);
