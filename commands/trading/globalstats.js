const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('globalstats')
    .setDescription('View global economy statistics'),
  
  async execute(interaction, user) {
    const allUsers = await User.find({ guildId: interaction.guildId });
    
    let totalWallet = 0;
    let totalBank = 0;
    let totalEarned = 0;
    let totalSpent = 0;
    let totalCommands = 0;
    
    allUsers.forEach(u => {
      totalWallet += u.wallet;
      totalBank += u.bank;
      totalEarned += u.stats.totalEarned;
      totalSpent += u.stats.totalSpent;
      totalCommands += u.stats.commandsUsed;
    });
    
    const totalMoney = totalWallet + totalBank;
    
    const embed = infoEmbed(
      '🌍 Global Economy Stats',
      `**Total Users:** ${allUsers.length}\n` +
      `**Total Money in Circulation:** ${formatMoney(totalMoney)}\n` +
      `**Total in Wallets:** ${formatMoney(totalWallet)}\n` +
      `**Total in Banks:** ${formatMoney(totalBank)}\n\n` +
      `**Total Earned:** ${formatMoney(totalEarned)}\n` +
      `**Total Spent:** ${formatMoney(totalSpent)}\n` +
      `**Total Commands Used:** ${totalCommands.toLocaleString()}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};