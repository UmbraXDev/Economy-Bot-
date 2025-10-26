/**
 * Bot Configuration
 * Created by: Umbra X Development
 * Support: https://discord.gg/Whq4T2vYPP
 */

module.exports = {
  botName: 'Economy Bot',
  botVersion: '1.0.0',
  developer: 'Umbra X Development',
  supportServer: 'https://discord.gg/Whq4T2vYPP',
  
  colors: {
    success: 0x00ff00,
    error: 0xff0000,
    info: 0x0099ff,
    warning: 0xffff00,
    primary: 0x7289da,
    gold: 0xffd700,
  },
  
  emojis: {
    coin: '🪙',
    bank: '🏦',
    wallet: '👛',
    arrow_up: '📈',
    arrow_down: '📉',
    trophy: '🏆',
    gift: '🎁',
    dice: '🎲',
    slot: '🎰',
    cards: '🃏',
  },
  
  economy: {
    startingBalance: 1000,
    maxWalletDefault: 10000,
    maxBankDefault: 50000,
    
    dailyReward: { min: 500, max: 1000 },
    weeklyReward: { min: 5000, max: 10000 },
    monthlyReward: { min: 50000, max: 100000 },
    
    beg: { min: 10, max: 100, cooldown: 30000 },
    work: { min: 200, max: 500, cooldown: 3600000 },
    search: { min: 100, max: 300, cooldown: 60000 },
    crime: { min: 300, max: 1000, cooldown: 120000, failChance: 0.4, fine: 500 },
    mine: { min: 150, max: 400, cooldown: 90000 },
    fish: { min: 100, max: 350, cooldown: 75000 },
    hunt: { min: 200, max: 600, cooldown: 120000 },
    loot: { min: 250, max: 750, cooldown: 180000 },
    quest: { min: 500, max: 1500, cooldown: 300000 },
    
    interestRate: 0.05,
    bankUpgradeCost: 50000,
    bankUpgradeMultiplier: 2,
    
    robSuccessChance: 0.3,
    robMinimum: 1000,
    robCooldown: 300000,
    taxRate: 0.02,
    
    coinflipMultiplier: 1.9,
    slotsMultipliers: { jackpot: 10, triple: 5, double: 2 },
    blackjackMultiplier: 2,
    diceMultiplier: 6,
    lotteryTicketPrice: 1000,
    
    walletUpgradeCost: 10000,
    walletUpgradeIncrease: 5000,
    workUpgradeCost: 15000,
    workUpgradeMultiplier: 1.5,
    luckUpgradeCost: 20000,
    luckUpgradeBonus: 0.1,
  },
  
  cooldowns: {
    daily: 86400000,
    weekly: 604800000,
    monthly: 2592000000,
  },
  
  adminIds: process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',') : [],
  
  workJobs: [
    'Developer', 'Teacher', 'Doctor', 'Chef', 'Artist', 
    'Musician', 'Writer', 'Engineer', 'Designer', 'Streamer'
  ],
  
  searchLocations: [
    'Couch', 'Car', 'Trash Can', 'Backyard', 'Attic', 
    'Basement', 'Park', 'Beach', 'Mall', 'Library'
  ],
  
  crimes: [
    'Robbing a bank', 'Stealing a car', 'Pickpocketing', 
    'Breaking into a house', 'Hacking', 'Smuggling'
  ],
};
