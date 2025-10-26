const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getGuild } = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('additem')
    .setDescription('Add an item to the shop (Admin only)')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Item name')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('price')
        .setDescription('Item price')
        .setRequired(true)
        .setMinValue(1))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Item description')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('emoji')
        .setDescription('Item emoji')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('stock')
        .setDescription('Item stock')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction, user) {
    const guild = await getGuild(interaction.guildId, interaction.guild.name);
    
    const name = interaction.options.getString('name');
    const price = interaction.options.getInteger('price');
    const description = interaction.options.getString('description');
    const emoji = interaction.options.getString('emoji') || '📦';
    const stock = interaction.options.getInteger('stock');
    
    const itemId = name.toLowerCase().replace(/\s+/g, '-');
    
    if (guild.shop.find(i => i.itemId === itemId)) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Item Exists', 'An item with this name already exists!')],
        ephemeral: true 
      });
    }
    
    guild.shop.push({
      itemId,
      itemName: name,
      description,
      price,
      emoji,
      stock: stock || undefined,
      category: 'misc',
    });
    
    await guild.save();
    
    const embed = successEmbed(
      '✅ Item Added',
      `**${emoji} ${name}** has been added to the shop!\n\n` +
      `**Price:** 🪙 ${price.toLocaleString()}\n` +
      `**Description:** ${description}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};