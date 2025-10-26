const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upgradewallet')
    .setDescription('Upgrade your wallet capacity'),
  
  async execute(interaction, user) {
    const cost = config.economy.walletUpgradeCost * user.upgrades.walletLevel;
    
    if (user.wallet < cost) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You need ${formatMoney(cost)}!`)],
        ephemeral: true 
      });
    }
    
    user.wallet -= cost;
    user.upgrades.walletLevel++;
    user.maxWallet += config.economy.walletUpgradeIncrease;
    await user.save();
    
    const embed = successEmbed(
      '👛 Wallet Upgraded!',
      `Your wallet capacity has been upgraded!\n\n` +
      `**Level:** ${user.upgrades.walletLevel}\n` +
      `**New Capacity:** ${formatMoney(user.maxWallet)}\n` +
      `**Cost:** ${formatMoney(cost)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};