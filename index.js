// Imports
const fs = require('fs')
const ethers = require('ethers')
const { abi } = require('./abi')
var _ = require('lodash')
const { chunk } = require('lodash')
// Setup contract
const lootAddress = '0x8bf2f876e2dcd2cae9c3d272f325776c82da366d'
const rpc = new ethers.providers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/48f923de0c1845c9ab6e78c77ce5f132'
  // {
  //   //etherscan: 'N9FSBTYKFCWYGJVAHADM4HNXHNYDKX6GGU'
  //   // infura: {
  //   //   projectId: '1971ca31434444698172d1ef943bef37',
  //   //   projectSecret: 'ca2575964abf43daba7efe437dbe709e'
  //   // }
  // }
)
const loot = new ethers.Contract(lootAddress, abi, rpc)
let failed = []
const get = async i => {
  console.log('Collecting: ', i)
  try {
    // Collect parts
    const [chest, foot, hand, head, neck, ring, waist, weapon] =
      await Promise.all([
        loot.getChest(i),
        loot.getFoot(i),
        loot.getHand(i),
        loot.getHead(i),
        loot.getNeck(i),
        loot.getRing(i),
        loot.getWaist(i),
        loot.getWeapon(i)
      ])

    // Push parts to array
    return {
      chest,
      foot,
      hand,
      head,
      neck,
      ring,
      waist,
      weapon,
      tokenId: i
    }
  } catch (e) {
    failed.push(i)
    console.log('Something went wrong with', i, e)
  }

  //console.log(retrievedLoot[i - 8001][i])
}

;(async () => {
  // In-mem retrieval
  let retrievedLoot = []
  // let got = await get(15777)
  // return console.log(got)

  let chunked = _.chunk(_.range(7777), '50')
  for (let i = 0; i < chunked.length; i++) {
    await new Promise(r => setTimeout(r, 1000))
    const loots = await Promise.all(chunked[i].map(x => get(8001 + x)))
    retrievedLoot.push(...loots)
  }

  fs.writeFileSync('./output/xloot2.json', JSON.stringify(retrievedLoot))
  fs.writeFileSync('./output/xloot2.failed.json', JSON.stringify(failed))
})()
