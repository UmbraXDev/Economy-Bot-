/**
 * Cooldown Management
 * Created by: Umbra X Development
 * Support: https://discord.gg/Whq4T2vYPP
 */

const ms = require('ms');

function setCooldown(user, command, duration) {
  if (!user.cooldowns) user.cooldowns = {};
  user.cooldowns[command] = new Date(Date.now() + duration);
}

function getCooldown(user, command) {
  if (!user.cooldowns || !user.cooldowns[command]) return null;
  
  const cooldownEnd = new Date(user.cooldowns[command]);
  const now = new Date();
  
  if (now >= cooldownEnd) return null;
  
  return cooldownEnd - now;
}

function formatCooldown(milliseconds) {
  return ms(milliseconds, { long: true });
}

module.exports = {
  setCooldown,
  getCooldown,
  formatCooldown,
};