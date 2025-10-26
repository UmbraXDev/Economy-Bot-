const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll dice and bet on the outcome')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to bet')
        .setRequired(true)
        .setMinValue(10))
    .addIntegerOption(option =>
      option.setName('guess')
        .setDescription('Guess the number (1-6)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(6)),
  
  async execute(interaction, user) {
    const amount = interaction.options.getInteger('amount');
    const guess = interaction.options.getInteger('guess');
    
    if (amount > user.wallet) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You only have ${formatMoney(user.wallet)}!`)],
        ephemeral: true 
      });
    }
    
    const roll = random(1, 6);
    const won = roll === guess;
    
    if (won) {
      const winnings = amount * config.economy.diceMultiplier;
      user.wallet += winnings;
      user.stats.gamblingWins++;
      await user.save();
      
      const embed = successEmbed(
        '🎲 Dice - Jackpot!',
        `You rolled a **${roll}** and guessed **${guess}**!\n\n` +
        `You won ${formatMoney(winnings)}!\n\n` +
        `**New Balance:** ${formatMoney(user.wallet)}`
      );
      
      await interaction.reply({ embeds: [embed] });
    } else {
      user.wallet -= amount;
      user.stats.gamblingLosses++;
      await user.save();
      
      const embed = errorEmbed(
        '🎲 Dice - Wrong Guess',
        `You rolled a **${roll}** but guessed **${guess}**!\n\n` +
        `You lost ${formatMoney(amount)}!\n\n` +
        `**New Balance:** ${formatMoney(user.wallet)}`
      );
      
      await interaction.reply({ embeds: [embed] });
    }
  },
};