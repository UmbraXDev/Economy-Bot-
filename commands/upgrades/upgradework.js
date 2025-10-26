const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upgradework')
    .setDescription('Upgrade your work earnings'),
  
  async execute(interaction, user) {
    const cost = config.economy.workUpgradeCost * user.upgrades.workLevel;
    
    if (user.wallet < cost) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You need ${formatMoney(cost)}!`)],
        ephemeral: true 
      });
    }
    
    user.wallet -= cost;
    user.upgrades.workLevel++;
    await user.save();
    
    const multiplier = (user.upgrades.workLevel * config.economy.workUpgradeMultiplier).toFixed(1);
    
    const embed = successEmbed(
      '💼 Work Upgraded!',
      `Your work earnings have been upgraded!\n\n` +
      `**Level:** ${user.upgrades.workLevel}\n` +
      `**Multiplier:** x${multiplier}\n` +
      `**Cost:** ${formatMoney(cost)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};