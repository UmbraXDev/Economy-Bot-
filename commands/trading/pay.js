const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const { getUser } = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Pay someone from your wallet')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to pay')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to pay')
        .setRequired(true)
        .setMinValue(1)),
  
  async execute(interaction, user) {
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    
    if (target.id === interaction.user.id) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Invalid Target', 'You cannot pay yourself!')],
        ephemeral: true 
      });
    }
    
    if (target.bot) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Invalid Target', 'You cannot pay bots!')],
        ephemeral: true 
      });
    }
    
    if (amount > user.wallet) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You only have ${formatMoney(user.wallet)}!`)],
        ephemeral: true 
      });
    }
    
    const targetUser = await getUser(target.id, interaction.guildId);
    
    user.wallet -= amount;
    targetUser.wallet += amount;
    if (targetUser.wallet > targetUser.maxWallet) targetUser.wallet = targetUser.maxWallet;
    
    await user.save();
    await targetUser.save();
    
    const embed = successEmbed(
      '💸 Payment Sent',
      `You paid ${formatMoney(amount)} to ${target.username}!\n\n` +
      `**Your New Balance:** ${formatMoney(user.wallet)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};