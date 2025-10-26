const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sell')
    .setDescription('Sell an item from your inventory')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Item name to sell')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('quantity')
        .setDescription('Quantity to sell')
        .setMinValue(1)
        .setRequired(false)),
  
  async execute(interaction, user) {
    const itemName = interaction.options.getString('item').toLowerCase();
    const quantity = interaction.options.getInteger('quantity') || 1;
    
    const item = user.inventory.find(i => i.itemName.toLowerCase() === itemName);
    
    if (!item) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Item Not Found', 'You don\'t have that item!')],
        ephemeral: true 
      });
    }
    
    if (item.quantity < quantity) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Not Enough', `You only have ${item.quantity} of this item!`)],
        ephemeral: true 
      });
    }
    
    const sellPrice = Math.floor(350 * quantity);
    
    user.wallet += sellPrice;
    item.quantity -= quantity;
    
    if (item.quantity <= 0) {
      user.inventory = user.inventory.filter(i => i.itemId !== item.itemId);
    }
    
    await user.save();
    
    const embed = successEmbed(
      '💰 Item Sold',
      `You sold **${quantity}x ${item.itemName}** for ${formatMoney(sellPrice)}!\n\n` +
      `**New Balance:** ${formatMoney(user.wallet)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};