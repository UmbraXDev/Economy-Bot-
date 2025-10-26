const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');
const { getGuild } = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveawaystart')
    .setDescription('Start a giveaway')
    .addStringOption(option =>
      option.setName('prize')
        .setDescription('Giveaway prize')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in minutes')
        .setRequired(true)
        .setMinValue(1))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  
  async execute(interaction, user) {
    const prize = interaction.options.getString('prize');
    const duration = interaction.options.getInteger('duration');
    
    const endTime = new Date(Date.now() + duration * 60000);
    
    const embed = successEmbed(
      '🎉 GIVEAWAY! 🎉',
      `**Prize:** ${prize}\n` +
      `**Hosted by:** ${interaction.user.username}\n` +
      `**Ends:** <t:${Math.floor(endTime.getTime() / 1000)}:R>\n\n` +
      `React with 🎉 to enter!`
    );
    
    const message = await interaction.reply({ embeds: [embed], fetchReply: true });
    await message.react('🎉');
    
    const guild = await getGuild(interaction.guildId, interaction.guild.name);
    guild.activeGiveaways.push({
      messageId: message.id,
      channelId: interaction.channelId,
      prize,
      endTime,
      hostId: interaction.user.id,
      entries: [],
    });
    await guild.save();
    
    setTimeout(async () => {
      const updatedGuild = await getGuild(interaction.guildId, interaction.guild.name);
      const giveaway = updatedGuild.activeGiveaways.find(g => g.messageId === message.id);
      
      if (!giveaway) return;
      
      const fetchedMessage = await interaction.channel.messages.fetch(message.id).catch(() => null);
      if (!fetchedMessage) return;
      
      const reaction = fetchedMessage.reactions.cache.get('🎉');
      if (!reaction) return;
      
      const users = await reaction.users.fetch();
      const entries = users.filter(u => !u.bot).map(u => u.id);
      
      if (entries.length === 0) {
        const noWinnerEmbed = successEmbed(
          '🎉 Giveaway Ended',
          `**Prize:** ${prize}\n\nNo valid entries!`
        );
        await interaction.followUp({ embeds: [noWinnerEmbed] });
      } else {
        const winner = entries[Math.floor(Math.random() * entries.length)];
        const winnerEmbed = successEmbed(
          '🎉 Giveaway Winner! 🎉',
          `**Prize:** ${prize}\n` +
          `**Winner:** <@${winner}>\n\n` +
          `Congratulations! 🎊`
        );
        await interaction.followUp({ embeds: [winnerEmbed] });
      }
      
      updatedGuild.activeGiveaways = updatedGuild.activeGiveaways.filter(g => g.messageId !== message.id);
      await updatedGuild.save();
    }, duration * 60000);
  },
};