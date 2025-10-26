const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getUser } = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gift')
    .setDescription('Gift an item to another user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to gift')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Item name to gift')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('quantity')
        .setDescription('Quantity to gift')
        .setMinValue(1)
        .setRequired(false)),
  
  async execute(interaction, user) {
    const target = interaction.options.getUser('user');
    const itemName = interaction.options.getString('item').toLowerCase();
    const quantity = interaction.options.getInteger('quantity') || 1;
    
    if (target.id === interaction.user.id) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Invalid Target', 'You cannot gift yourself!')],
        ephemeral: true 
      });
    }
    
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
    
    const targetUser = await getUser(target.id, interaction.guildId);
    
    item.quantity -= quantity;
    if (item.quantity <= 0) {
      user.inventory = user.inventory.filter(i => i.itemId !== item.itemId);
    }
    
    const targetItem = targetUser.inventory.find(i => i.itemId === item.itemId);
    if (targetItem) {
      targetItem.quantity += quantity;
    } else {
      targetUser.inventory.push({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: quantity,
      });
    }
    
    await user.save();
    await targetUser.save();
    
    const embed = successEmbed(
      '🎁 Gift Sent',
      `You gifted **${quantity}x ${item.itemName}** to ${target.username}!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};