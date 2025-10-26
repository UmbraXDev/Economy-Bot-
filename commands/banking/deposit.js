const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit coins into your bank')
    .addStringOption(option =>
      option.setName('amount')
        .setDescription('Amount to deposit (or "all"/"max")')
        .setRequired(true)),
  
  async execute(interaction, user) {
    const input = interaction.options.getString('amount').toLowerCase();
    let amount;
    
    if (input === 'all' || input === 'max') {
      amount = Math.min(user.wallet, user.maxBank - user.bank);
    } else {
      amount = parseInt(input);
      if (isNaN(amount) || amount <= 0) {
        return interaction.reply({ 
          embeds: [errorEmbed('❌ Invalid Amount', 'Please enter a valid number!')],
          ephemeral: true 
        });
      }
    }
    
    if (amount > user.wallet) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You only have ${formatMoney(user.wallet)} in your wallet!`)],
        ephemeral: true 
      });
    }
    
    if (user.bank + amount > user.maxBank) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Bank Full', `Your bank can only hold ${formatMoney(user.maxBank)}!`)],
        ephemeral: true 
      });
    }
    
    user.wallet -= amount;
    user.bank += amount;
    await user.save();
    
    const embed = successEmbed(
      '🏦 Deposit Successful',
      `You deposited ${formatMoney(amount)} into your bank!\n\n` +
      `**New Balance:**\n` +
      `Wallet: ${formatMoney(user.wallet)}\n` +
      `Bank: ${formatMoney(user.bank)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};