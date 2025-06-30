import { Abi, Address, createPublicClient, http } from 'viem';
import { avalanche } from 'viem/chains';
import * as dotenv from 'dotenv';

dotenv.config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
if (!ALCHEMY_API_KEY) throw new Error('ALCHEMY_API_KEY is not set in .env');

const client = createPublicClient({
  chain: avalanche,
  transport: http(`https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
});

const fullAbi = [{
  inputs: [{ name: 'owner', type: 'address' }],
  name: 'balanceOf',
  outputs: [{ type: 'uint256' }],
  stateMutability: 'view',
  type: 'function',
}] as const;

const contractAddress: Address = '0x50B4a66bF4D41e6252540eA7427D7A933Bc3c088';
const functionName = 'balanceOf';
// Реальный адрес с балансом в Avalanche
const args: [Address] = ['0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'];

async function getRawResult(
  address: Address,
  fullAbi: Abi,
  functionName: string,
  args: unknown[] = []
) {
  const abi = fullAbi.filter(item => item.type === 'function' && item.name === functionName);
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

getRawResult(contractAddress, fullAbi, functionName, args).catch(console.error);
