const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin and bet on the outcome')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to bet')
        .setRequired(true)
        .setMinValue(10))
    .addStringOption(option =>
      option.setName('choice')
        .setDescription('Heads or Tails')
        .setRequired(true)
        .addChoices(
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' }
        )),
  
  async execute(interaction, user) {
    const amount = interaction.options.getInteger('amount');
    const choice = interaction.options.getString('choice');
    
    if (amount > user.wallet) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You only have ${formatMoney(user.wallet)}!`)],
        ephemeral: true 
      });
    }
    
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = result === choice;
    
    if (won) {
      const winnings = Math.floor(amount * config.economy.coinflipMultiplier);
      user.wallet += winnings;
      user.stats.gamblingWins++;
      await user.save();
      
      const embed = successEmbed(
        '🪙 Coinflip - You Won!',
        `The coin landed on **${result}**!\n` +
        `You won ${formatMoney(winnings)}!\n\n` +
        `**New Balance:** ${formatMoney(user.wallet)}`
      );
      
      await interaction.reply({ embeds: [embed] });
    } else {
      user.wallet -= amount;
      user.stats.gamblingLosses++;
      await user.save();
      
      const embed = errorEmbed(
        '🪙 Coinflip - You Lost',
        `The coin landed on **${result}**!\n` +
        `You lost ${formatMoney(amount)}!\n\n` +
        `**New Balance:** ${formatMoney(user.wallet)}`
      );
      
      await interaction.reply({ embeds: [embed] });
    }
  },
};