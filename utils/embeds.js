/**
 * Embed Utilities
 * Created by: Umbra X Development
 * Support: https://discord.gg/Whq4T2vYPP
 */

const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

function createEmbed(type, title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(config.colors[type] || config.colors.primary)
    .setFooter({ text: `${config.developer} | ${config.supportServer}` })
    .setTimestamp();
}

function successEmbed(title, description) {
  return createEmbed('success', title, description);
}

function errorEmbed(title, description) {
  return createEmbed('error', title, description);
}

function infoEmbed(title, description) {
  return createEmbed('info', title, description);
}

function warningEmbed(title, description) {
  return createEmbed('warning', title, description);
}

module.exports = {
  createEmbed,
  successEmbed,
  errorEmbed,
  infoEmbed,
  warningEmbed,
};
