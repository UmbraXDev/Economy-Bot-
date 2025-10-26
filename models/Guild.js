/**
 * Guild Model
 * Created by: Umbra X Development
 * Support: https://discord.gg/Whq4T2vYPP
 */

const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  guildName: String,
  
  settings: {
    prefix: { type: String, default: '!' },
    economyEnabled: { type: Boolean, default: true },
    taxRate: { type: Number, default: 0.02 },
  },
  
  shop: [{
    itemId: String,
    itemName: String,
    description: String,
    price: Number,
    emoji: String,
    role: String,
    stock: Number,
    category: String,
  }],
  
  lottery: {
    jackpot: { type: Number, default: 0 },
    tickets: [{
      userId: String,
      ticketNumber: Number,
      purchaseDate: Date,
    }],
    lastDraw: { type: Date, default: null },
  },
  
  activeGiveaways: [{
    messageId: String,
    channelId: String,
    prize: String,
    endTime: Date,
    hostId: String,
    entries: [String],
  }],
  
  stats: {
    totalTransactions: { type: Number, default: 0 },
    totalCoinsCirculating: { type: Number, default: 0 },
    totalTaxCollected: { type: Number, default: 0 },
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

guildSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Guild', guildSchema);