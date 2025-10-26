const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const { getLeaderboard } = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the server leaderboard')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Leaderboard type')
        .setRequired(false)
        .addChoices(
          { name: 'Wallet', value: 'wallet' },
          { name: 'Bank', value: 'bank' },
          { name: 'Total', value: 'total' }
        )),
  
  async execute(interaction, user) {
    const type = interaction.options.getString('type') || 'total';
    const users = await getLeaderboard(interaction.guildId, type, 10);
    
    if (users.length === 0) {
      const embed = infoEmbed('📊 Leaderboard', 'No users found!');
      return interaction.reply({ embeds: [embed] });
    }
    
    let description = '';
    
    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      const member = await interaction.guild.members.fetch(u.userId).catch(() => null);
      const username = member ? member.user.username : 'Unknown User';
      
      let amount;
      if (type === 'wallet') amount = u.wallet;
      else if (type === 'bank') amount = u.bank;
      else amount = u.wallet + u.bank;
      
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      description += `${medal} **${username}** - ${formatMoney(amount)}\n`;
    }
    
    const typeNames = { wallet: 'Wallet', bank: 'Bank', total: 'Total Balance' };
    const embed = infoEmbed(
      `🏆 ${typeNames[type]} Leaderboard`,
      description
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};