const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your profile')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check profile')
        .setRequired(false)),
  
  async execute(interaction, user) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const { getUser } = require('../../utils/database');
    const userData = await getUser(targetUser.id, interaction.guildId);
    
    const total = userData.wallet + userData.bank;
    
    const embed = infoEmbed(
      `👤 ${targetUser.username}'s Profile`,
      `**Balance:**\n` +
      `Wallet: ${formatMoney(userData.wallet)}\n` +
      `Bank: ${formatMoney(userData.bank)}\n` +
      `Total: ${formatMoney(total)}\n\n` +
      `**Items:** ${userData.inventory.length}\n` +
      `**Achievements:** ${userData.achievements.length}\n` +
      `**Bank Level:** ${userData.bankUpgradeLevel}\n\n` +
      `**Member Since:** ${userData.createdAt.toLocaleDateString()}`
    );
    
    embed.setThumbnail(targetUser.displayAvatarURL());
    
    await interaction.reply({ embeds: [embed] });
  },
};