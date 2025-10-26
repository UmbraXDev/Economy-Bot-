const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poorest')
    .setDescription('View the poorest user in the server'),
  
  async execute(interaction, user) {
    const users = await User.find({ guildId: interaction.guildId })
      .sort({ wallet: 1, bank: 1 })
      .limit(1);
    
    if (users.length === 0) {
      const embed = infoEmbed('📉 Poorest User', 'No users found!');
      return interaction.reply({ embeds: [embed] });
    }
    
    const poorest = users[0];
    const member = await interaction.guild.members.fetch(poorest.userId).catch(() => null);
    const username = member ? member.user.username : 'Unknown User';
    const total = poorest.wallet + poorest.bank;
    
    const embed = infoEmbed(
      '📉 Poorest User',
      `**${username}** needs some help!\n\n` +
      `**Wallet:** ${formatMoney(poorest.wallet)}\n` +
      `**Bank:** ${formatMoney(poorest.bank)}\n` +
      `**Total:** ${formatMoney(total)}`
    );
    
    if (member) {
      embed.setThumbnail(member.user.displayAvatarURL());
    }
    
    await interaction.reply({ embeds: [embed] });
  },
};