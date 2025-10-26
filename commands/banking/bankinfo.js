const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bankinfo')
    .setDescription('View your bank information'),
  
  async execute(interaction, user) {
    const upgradeCost = config.economy.bankUpgradeCost * user.bankUpgradeLevel;
    const interestEarned = Math.floor(user.bank * config.economy.interestRate);
    
    const embed = infoEmbed(
      '🏦 Bank Information',
      `**Current Balance:** ${formatMoney(user.bank)}\n` +
      `**Bank Capacity:** ${formatMoney(user.maxBank)}\n` +
      `**Upgrade Level:** ${user.bankUpgradeLevel}\n` +
      `**Next Upgrade Cost:** ${formatMoney(upgradeCost)}\n\n` +
      `**Interest Rate:** ${(config.economy.interestRate * 100).toFixed(1)}% daily\n` +
      `**Next Interest:** ${formatMoney(interestEarned)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};