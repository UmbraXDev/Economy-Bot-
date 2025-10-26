const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw coins from your bank')
    .addStringOption(option =>
      option.setName('amount')
        .setDescription('Amount to withdraw (or "all"/"max")')
        .setRequired(true)),
  
  async execute(interaction, user) {
    const input = interaction.options.getString('amount').toLowerCase();
    let amount;
    
    if (input === 'all' || input === 'max') {
      amount = Math.min(user.bank, user.maxWallet - user.wallet);
    } else {
      amount = parseInt(input);
      if (isNaN(amount) || amount <= 0) {
        return interaction.reply({ 
          embeds: [errorEmbed('❌ Invalid Amount', 'Please enter a valid number!')],
          ephemeral: true 
        });
      }
    }
    
    if (amount > user.bank) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You only have ${formatMoney(user.bank)} in your bank!`)],
        ephemeral: true 
      });
    }
    
    if (user.wallet + amount > user.maxWallet) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Wallet Full', `Your wallet can only hold ${formatMoney(user.maxWallet)}!`)],
        ephemeral: true 
      });
    }
    
    user.bank -= amount;
    user.wallet += amount;
    await user.save();
    
    const embed = successEmbed(
      '💰 Withdrawal Successful',
      `You withdrew ${formatMoney(amount)} from your bank!\n\n` +
      `**New Balance:**\n` +
      `Wallet: ${formatMoney(user.wallet)}\n` +
      `Bank: ${formatMoney(user.bank)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};
