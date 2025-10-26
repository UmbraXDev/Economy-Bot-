const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const { getGuild } = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View the shop items'),
  
  async execute(interaction, user) {
    const guild = await getGuild(interaction.guildId, interaction.guild.name);
    
    if (!guild.shop || guild.shop.length === 0) {
      const embed = infoEmbed(
        '🏪 Shop',
        'The shop is empty! Admins can add items with `/additem`'
      );
      return interaction.reply({ embeds: [embed] });
    }
    
    let description = '';
    guild.shop.forEach((item, index) => {
      description += `**${index + 1}. ${item.emoji} ${item.itemName}**\n`;
      description += `${item.description}\n`;
      description += `Price: ${formatMoney(item.price)}`;
      if (item.stock !== undefined) description += ` | Stock: ${item.stock}`;
      description += `\n\n`;
    });
    
    const embed = infoEmbed('🏪 Shop', description);
    
    await interaction.reply({ embeds: [embed] });
  },
};