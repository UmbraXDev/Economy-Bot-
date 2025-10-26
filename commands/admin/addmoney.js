const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const { getUser } = require('../../utils/database');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addmoney')
    .setDescription('Add money to a user (Admin only)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to add money to')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to add')
        .setRequired(true)
        .setMinValue(1))
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Add to wallet or bank')
        .setRequired(false)
        .addChoices(
          { name: 'Wallet', value: 'wallet' },
          { name: 'Bank', value: 'bank' }
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction, user) {
    if (!config.adminIds.includes(interaction.user.id)) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Permission Denied', 'Only bot admins can use this!')],
        ephemeral: true 
      });
    }
    
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const type = interaction.options.getString('type') || 'wallet';
    
    const targetUser = await getUser(target.id, interaction.guildId);
    
    if (type === 'wallet') {
      targetUser.wallet = Math.max(0, targetUser.wallet + amount);
    } else {
      targetUser.bank = Math.max(0, targetUser.bank + amount);
    }
    
    await targetUser.save();
    
    const embed = successEmbed(
      '💸 Money Added',
      `Added ${formatMoney(amount)} from ${target.username}'s ${type}!\n\n` +
      `**New ${type === 'wallet' ? 'Wallet' : 'Bank'} Balance:** ${formatMoney(type === 'wallet' ? targetUser.wallet : targetUser.bank)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};