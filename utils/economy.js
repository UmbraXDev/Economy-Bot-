/**
 * Economy Utilities
 * Created by: Umbra X Development
 * Support: https://discord.gg/Whq4T2vYPP
 */

function formatMoney(amount) {
  return `🪙 ${amount.toLocaleString()}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function percentage(chance) {
  return Math.random() < chance;
}

async function addMoney(user, amount, type = 'wallet') {
  if (type === 'wallet') {
    user.wallet += amount;
    if (user.wallet > user.maxWallet) user.wallet = user.maxWallet;
  } else {
    user.bank += amount;
    if (user.bank > user.maxBank) user.bank = user.maxBank;
  }
  user.stats.totalEarned += amount;
  await user.save();
  return user;
}

async function removeMoney(user, amount, type = 'wallet') {
  if (type === 'wallet') {
    user.wallet -= amount;
    if (user.wallet < 0) user.wallet = 0;
  } else {
    user.bank -= amount;
    if (user.bank < 0) user.bank = 0;
  }
  user.stats.totalSpent += amount;
  await user.save();
  return user;
}

function calculateInterest(bank, rate) {
  return Math.floor(bank * rate);
}

module.exports = {
  formatMoney,
  random,
  percentage,
  addMoney,
  removeMoney,
  calculateInterest,
};