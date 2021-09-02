// Imports
const fs = require('fs')

;(async () => {
  // Load loot data
  const data = await fs.readFileSync('./output/xloot.json')
  const loot = JSON.parse(data)
  let rarity = {}
  loot.forEach((item, i) => {
    if (!item) return
    Object.keys(item).forEach(prop => {
      if (!item[prop]) return
      rarity[item[prop]] = rarity[item[prop]] ? rarity[item[prop]] + 1 : 1
    })
  })

  await fs.writeFileSync('./output/xoccurences.json', JSON.stringify(rarity))

  let scores = []
  loot.forEach((item, i) => {
    if (!item) return
    let score = 0
    Object.keys(item).forEach(prop => {
      if (!item[prop]) return
      score += rarity[item[prop]]
    })
    scores.push({ lootId: item.tokenId, score })
  })

  // Sort by score
  scores = scores.sort((a, b) => a.score - b.score)
  // Sort by index of score
  scores = scores.map((loot, i) => ({
    ...loot,
    rarest: i + 1
  }))

  //console.log(scores.sort((a, b) => (a.score > b.score ? 1 : -1)).reverse())
  await fs.writeFileSync('./output/xrare.json', JSON.stringify(scores))
})()
