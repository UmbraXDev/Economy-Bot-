const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const User = require('../../models/User');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reseteconomy')
    .setDescription('Reset the entire economy (DANGER!)')
    .addStringOption(option =>
      option.setName('confirm')
        .setDescription('Type "CONFIRM" to reset')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction, user) {
    const confirm = interaction.options.getString('confirm');
    
    if (!config.adminIds.includes(interaction.user.id)) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Permission Denied', 'Only bot admins can use this!')],
        ephemeral: true 
      });
    }
    
    if (confirm !== 'CONFIRM') {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Not Confirmed', 'Type "CONFIRM" to reset the economy!')],
        ephemeral: true 
      });
    }
    
    await User.deleteMany({ guildId: interaction.guildId });
    
    const embed = successEmbed(
      '⚠️ Economy Reset',
      'The entire server economy has been reset!\nAll user data has been deleted.'
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};
