/**
 * Database Utilities
 * Created by: Umbra X Development
 * Support: https://discord.gg/Whq4T2vYPP
 */

const User = require('../models/User');
const Guild = require('../models/Guild');

async function getUser(userId, guildId) {
  let user = await User.findOne({ userId, guildId });
  if (!user) {
    user = new User({ userId, guildId });
    await user.save();
  }
  return user;
}

async function getGuild(guildId, guildName = '') {
  let guild = await Guild.findOne({ guildId });
  if (!guild) {
    guild = new Guild({ guildId, guildName });
    await guild.save();
  }
  return guild;
}

async function updateUser(userId, guildId, data) {
  return await User.findOneAndUpdate(
    { userId, guildId },
    { $set: data },
    { new: true, upsert: true }
  );
}

async function getLeaderboard(guildId, type = 'total', limit = 10) {
  let sortField;
  switch(type) {
    case 'wallet': sortField = { wallet: -1 }; break;
    case 'bank': sortField = { bank: -1 }; break;
    default: sortField = { wallet: -1, bank: -1 };
  }
  
  const users = await User.find({ guildId }).sort(sortField).limit(limit);
  return users;
}

module.exports = {
  getUser,
  getGuild,
  updateUser,
  getLeaderboard,
};