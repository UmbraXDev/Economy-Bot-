const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View your statistics')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check stats')
        .setRequired(false)),
  
  async execute(interaction, user) {
    const targetUser = interaction.options.getUser('user');
    let userData = user;
    
    if (targetUser) {
      const { getUser } = require('../../utils/database');
      userData = await getUser(targetUser.id, interaction.guildId);
    }
    
    const winRate = userData.stats.gamblingWins + userData.stats.gamblingLosses > 0
      ? ((userData.stats.gamblingWins / (userData.stats.gamblingWins + userData.stats.gamblingLosses)) * 100).toFixed(1)
      : 0;
    
    const username = targetUser ? targetUser.username : interaction.user.username;
    
    const embed = infoEmbed(
      `📊 ${username}'s Statistics`,
      `**Total Earned:** ${formatMoney(userData.stats.totalEarned)}\n` +
      `**Total Spent:** ${formatMoney(userData.stats.totalSpent)}\n` +
      `**Commands Used:** ${userData.stats.commandsUsed.toLocaleString()}\n\n` +
      `**Gambling Stats:**\n` +
      `Wins: ${userData.stats.gamblingWins}\n` +
      `Losses: ${userData.stats.gamblingLosses}\n` +
      `Win Rate: ${winRate}%\n\n` +
      `**Upgrades:**\n` +
      `Wallet Level: ${userData.upgrades.walletLevel}\n` +
      `Work Level: ${userData.upgrades.workLevel}\n` +
      `Luck Level: ${userData.upgrades.luckLevel}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};
