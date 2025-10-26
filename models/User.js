/**
 * User Model
 * Created by: Umbra X Development
 * Support: https://discord.gg/Whq4T2vYPP
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  guildId: { type: String, required: true },
  wallet: { type: Number, default: 1000 },
  bank: { type: Number, default: 0 },
  maxWallet: { type: Number, default: 10000 },
  maxBank: { type: Number, default: 50000 },
  
  inventory: [{
    itemId: String,
    itemName: String,
    quantity: Number,
    purchaseDate: { type: Date, default: Date.now }
  }],
  
  stats: {
    totalEarned: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    commandsUsed: { type: Number, default: 0 },
    gamblingWins: { type: Number, default: 0 },
    gamblingLosses: { type: Number, default: 0 },
  },
  
  upgrades: {
    walletLevel: { type: Number, default: 1 },
    workLevel: { type: Number, default: 1 },
    luckLevel: { type: Number, default: 1 },
  },
  
  cooldowns: {
    daily: { type: Date, default: null },
    weekly: { type: Date, default: null },
    monthly: { type: Date, default: null },
    work: { type: Date, default: null },
    beg: { type: Date, default: null },
    search: { type: Date, default: null },
    crime: { type: Date, default: null },
    mine: { type: Date, default: null },
    fish: { type: Date, default: null },
    hunt: { type: Date, default: null },
    loot: { type: Date, default: null },
    quest: { type: Date, default: null },
    rob: { type: Date, default: null },
    interest: { type: Date, default: null },
  },
  
  achievements: [String],
  
  bankUpgradeLevel: { type: Number, default: 1 },
  lastInterest: { type: Date, default: Date.now },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
