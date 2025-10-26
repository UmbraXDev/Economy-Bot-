const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance or another user\'s balance')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('User to check balance')
        .setRequired(false)),
  
  async execute(interaction, user) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const { getUser } = require('../../utils/database');
    const userData = await getUser(targetUser.id, interaction.guildId);
    
    const total = userData.wallet + userData.bank;
    
    const embed = infoEmbed(
      `💰 ${targetUser.username}'s Balance`,
      `**Wallet:** ${formatMoney(userData.wallet)} / ${formatMoney(userData.maxWallet)}\n` +
      `**Bank:** ${formatMoney(userData.bank)} / ${formatMoney(userData.maxBank)}\n` +
      `**Total:** ${formatMoney(total)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};