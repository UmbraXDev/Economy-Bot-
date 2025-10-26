const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getGuild } = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveawayend')
    .setDescription('End a giveaway early')
    .addStringOption(option =>
      option.setName('messageid')
        .setDescription('Giveaway message ID')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  
  async execute(interaction, user) {
    const messageId = interaction.options.getString('messageid');
    const guild = await getGuild(interaction.guildId, interaction.guild.name);
    
    const giveaway = guild.activeGiveaways.find(g => g.messageId === messageId);
    
    if (!giveaway) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Not Found', 'That giveaway does not exist!')],
        ephemeral: true 
      });
    }
    
    const message = await interaction.channel.messages.fetch(messageId).catch(() => null);
    if (!message) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Message Not Found', 'Could not find that message!')],
        ephemeral: true 
      });
    }
    
    const reaction = message.reactions.cache.get('🎉');
    if (!reaction) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ No Entries', 'No one entered the giveaway!')],
        ephemeral: true 
      });
    }
    
    const users = await reaction.users.fetch();
    const entries = users.filter(u => !u.bot).map(u => u.id);
    
    if (entries.length === 0) {
      const noWinnerEmbed = successEmbed(
        '🎉 Giveaway Ended',
        `**Prize:** ${giveaway.prize}\n\nNo valid entries!`
      );
      await interaction.reply({ embeds: [noWinnerEmbed] });
    } else {
      const winner = entries[Math.floor(Math.random() * entries.length)];
      const winnerEmbed = successEmbed(
        '🎉 Giveaway Winner! 🎉',
        `**Prize:** ${giveaway.prize}\n` +
        `**Winner:** <@${winner}>\n\n` +
        `Congratulations! 🎊`
      );
      await interaction.reply({ embeds: [winnerEmbed] });
    }
    
    guild.activeGiveaways = guild.activeGiveaways.filter(g => g.messageId !== messageId);
    await guild.save();
  },
};