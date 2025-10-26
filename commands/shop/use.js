const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('use')
    .setDescription('Use an item from your inventory')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Item name to use')
        .setRequired(true)),
  
  async execute(interaction, user) {
    const itemName = interaction.options.getString('item').toLowerCase();
    
    const item = user.inventory.find(i => i.itemName.toLowerCase() === itemName);
    
    if (!item) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Item Not Found', 'You don\'t have that item!')],
        ephemeral: true 
      });
    }
    
    item.quantity -= 1;
    if (item.quantity <= 0) {
      user.inventory = user.inventory.filter(i => i.itemId !== item.itemId);
    }
    
    await user.save();
    
    const embed = successEmbed(
      '✅ Item Used',
      `You used **${item.itemName}**!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};
