const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('View your inventory')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check inventory')
        .setRequired(false)),
  
  async execute(interaction, user) {
    const targetUser = interaction.options.getUser('user');
    let userData = user;
    
    if (targetUser) {
      const { getUser } = require('../../utils/database');
      userData = await getUser(targetUser.id, interaction.guildId);
    }
    
    if (!userData.inventory || userData.inventory.length === 0) {
      const embed = infoEmbed(
        '🎒 Inventory',
        'Inventory is empty!'
      );
      return interaction.reply({ embeds: [embed] });
    }
    
    let description = '';
    userData.inventory.forEach((item, index) => {
      description += `**${index + 1}.** ${item.itemName} x${item.quantity}\n`;
    });
    
    const username = targetUser ? targetUser.username : interaction.user.username;
    const embed = infoEmbed(`🎒 ${username}'s Inventory`, description);
    
    await interaction.reply({ embeds: [embed] });
  },
};