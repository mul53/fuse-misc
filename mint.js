const Web3 = require('web3')
const fs = require('fs')

const web3 = new Web3('https://rpc.fuse.io')

const ABI = [
  {
    type: 'event',
    name: 'Mint',
    inputs: [
      {
        type: 'address',
        name: 'minter',
        internalType: 'address',
        indexed: true,
      },
      { type: 'address', name: 'to', internalType: 'address', indexed: true },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
]

const TOKEN_ADDRESS = '0x249be57637d8b013ad64785404b24aebae9b098b'

async function main() {
  const token = new web3.eth.Contract(ABI, TOKEN_ADDRESS)

  const rawEvents = await token.getPastEvents('Mint', {
    fromBlock: 0,
    toBlock: 'latest',
  })

  const formattedEvents = rawEvents.map((event) => ({
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      minter: event.returnValues.minter,
      to: event.returnValues.to,
      amount: event.returnValues.amount
  }))

  const data = {
    rawEvents,
    formattedEvents
  }

  fs.writeFileSync('./mint.json', JSON.stringify(data))
}

main()
