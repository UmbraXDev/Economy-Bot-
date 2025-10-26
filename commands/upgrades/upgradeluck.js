const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upgradeluck')
    .setDescription('Upgrade your luck for better rewards'),
  
  async execute(interaction, user) {
    const cost = config.economy.luckUpgradeCost * user.upgrades.luckLevel;
    
    if (user.wallet < cost) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You need ${formatMoney(cost)}!`)],
        ephemeral: true 
      });
    }
    
    user.wallet -= cost;
    user.upgrades.luckLevel++;
    await user.save();
    
    const bonus = (user.upgrades.luckLevel * config.economy.luckUpgradeBonus * 100).toFixed(0);
    
    const embed = successEmbed(
      '🍀 Luck Upgraded!',
      `Your luck has been upgraded!\n\n` +
      `**Level:** ${user.upgrades.luckLevel}\n` +
      `**Bonus:** +${bonus}% better rewards\n` +
      `**Cost:** ${formatMoney(cost)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};
