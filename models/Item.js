/**
 * Item Model
 * Created by: Umbra X Development
 * Support: https://discord.gg/Whq4T2vYPP
 */

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  itemName: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  sellPrice: Number,
  emoji: { type: String, default: '📦' },
  category: { type: String, default: 'misc' },
  usable: { type: Boolean, default: false },
  effect: String,
  rarity: { type: String, default: 'common' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', itemSchema);