const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('richest')
    .setDescription('View the richest user in the server'),
  
  async execute(interaction, user) {
    const users = await User.find({ guildId: interaction.guildId })
      .sort({ wallet: -1, bank: -1 })
      .limit(1);
    
    if (users.length === 0) {
      const embed = infoEmbed('💰 Richest User', 'No users found!');
      return interaction.reply({ embeds: [embed] });
    }
    
    const richest = users[0];
    const member = await interaction.guild.members.fetch(richest.userId).catch(() => null);
    const username = member ? member.user.username : 'Unknown User';
    const total = richest.wallet + richest.bank;
    
    const embed = infoEmbed(
      '💰 Richest User',
      `**${username}** is the richest user!\n\n` +
      `**Wallet:** ${formatMoney(richest.wallet)}\n` +
      `**Bank:** ${formatMoney(richest.bank)}\n` +
      `**Total:** ${formatMoney(total)}`
    );
    
    if (member) {
      embed.setThumbnail(member.user.displayAvatarURL());
    }
    
    await interaction.reply({ embeds: [embed] });
  },
};
