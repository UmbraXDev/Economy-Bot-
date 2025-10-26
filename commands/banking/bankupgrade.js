const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bankupgrade')
    .setDescription('Upgrade your bank capacity'),
  
  async execute(interaction, user) {
    const cost = config.economy.bankUpgradeCost * user.bankUpgradeLevel;
    
    if (user.wallet < cost) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You need ${formatMoney(cost)} to upgrade your bank!`)],
        ephemeral: true 
      });
    }
    
    user.wallet -= cost;
    user.bankUpgradeLevel++;
    user.maxBank = Math.floor(user.maxBank * config.economy.bankUpgradeMultiplier);
    await user.save();
    
    const embed = successEmbed(
      '🏦 Bank Upgraded!',
      `Your bank capacity has been upgraded!\n\n` +
      `**Level:** ${user.bankUpgradeLevel}\n` +
      `**New Capacity:** ${formatMoney(user.maxBank)}\n` +
      `**Cost:** ${formatMoney(cost)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};