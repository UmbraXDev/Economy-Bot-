const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const { getGuild } = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buy an item from the shop')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Item name or ID')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('quantity')
        .setDescription('Quantity to buy')
        .setMinValue(1)
        .setRequired(false)),
  
  async execute(interaction, user) {
    const guild = await getGuild(interaction.guildId, interaction.guild.name);
    const itemName = interaction.options.getString('item').toLowerCase();
    const quantity = interaction.options.getInteger('quantity') || 1;
    
    const item = guild.shop.find(i => 
      i.itemName.toLowerCase() === itemName || 
      i.itemId.toLowerCase() === itemName
    );
    
    if (!item) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Item Not Found', 'That item does not exist in the shop!')],
        ephemeral: true 
      });
    }
    
    const totalCost = item.price * quantity;
    
    if (user.wallet < totalCost) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You need ${formatMoney(totalCost)} to buy this!`)],
        ephemeral: true 
      });
    }
    
    if (item.stock !== undefined && item.stock < quantity) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Out of Stock', `Only ${item.stock} left in stock!`)],
        ephemeral: true 
      });
    }
    
    user.wallet -= totalCost;
    
    const existingItem = user.inventory.find(i => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.inventory.push({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: quantity,
      });
    }
    
    if (item.stock !== undefined) {
      item.stock -= quantity;
    }
    
    await user.save();
    await guild.save();
    
    const embed = successEmbed(
      '✅ Purchase Successful',
      `You bought **${quantity}x ${item.emoji} ${item.itemName}** for ${formatMoney(totalCost)}!\n\n` +
      `**New Balance:** ${formatMoney(user.wallet)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};