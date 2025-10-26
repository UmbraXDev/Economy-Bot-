const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getGuild } = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeitem')
    .setDescription('Remove an item from the shop (Admin only)')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Item name or ID')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction, user) {
    const guild = await getGuild(interaction.guildId, interaction.guild.name);
    const itemName = interaction.options.getString('item').toLowerCase();
    
    const itemIndex = guild.shop.findIndex(i => 
      i.itemName.toLowerCase() === itemName || 
      i.itemId.toLowerCase() === itemName
    );
    
    if (itemIndex === -1) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Item Not Found', 'That item does not exist!')],
        ephemeral: true 
      });
    }
    
    const removedItem = guild.shop[itemIndex];
    guild.shop.splice(itemIndex, 1);
    await guild.save();
    
    const embed = successEmbed(
      '✅ Item Removed',
      `**${removedItem.emoji} ${removedItem.itemName}** has been removed from the shop!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};