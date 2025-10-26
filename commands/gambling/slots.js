const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Play the slot machine')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to bet')
        .setRequired(true)
        .setMinValue(10)),
  
  async execute(interaction, user) {
    const amount = interaction.options.getInteger('amount');
    
    if (amount > user.wallet) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You only have ${formatMoney(user.wallet)}!`)],
        ephemeral: true 
      });
    }
    
    const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
    
    let multiplier = 0;
    
    if (slot1 === slot2 && slot2 === slot3) {
      multiplier = config.economy.slotsMultipliers.jackpot;
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      multiplier = config.economy.slotsMultipliers.double;
    }
    
    if (multiplier > 0) {
      const winnings = amount * multiplier;
      user.wallet += winnings;
      user.stats.gamblingWins++;
      await user.save();
      
      const embed = successEmbed(
        '🎰 Slots - You Won!',
        `${slot1} | ${slot2} | ${slot3}\n\n` +
        `Multiplier: **x${multiplier}**\n` +
        `You won ${formatMoney(winnings)}!\n\n` +
        `**New Balance:** ${formatMoney(user.wallet)}`
      );
      
      await interaction.reply({ embeds: [embed] });
    } else {
      user.wallet -= amount;
      user.stats.gamblingLosses++;
      await user.save();
      
      const embed = errorEmbed(
        '🎰 Slots - You Lost',
        `${slot1} | ${slot2} | ${slot3}\n\n` +
        `Better luck next time!\n` +
        `You lost ${formatMoney(amount)}!\n\n` +
        `**New Balance:** ${formatMoney(user.wallet)}`
      );
      
      await interaction.reply({ embeds: [embed] });
    }
  },
};
