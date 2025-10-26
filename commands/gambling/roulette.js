const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney, random } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('Play roulette')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to bet')
        .setRequired(true)
        .setMinValue(10))
    .addStringOption(option =>
      option.setName('bet')
        .setDescription('What to bet on')
        .setRequired(true)
        .addChoices(
          { name: 'Red', value: 'red' },
          { name: 'Black', value: 'black' },
          { name: 'Green (0)', value: 'green' }
        )),
  
  async execute(interaction, user) {
    const amount = interaction.options.getInteger('amount');
    const bet = interaction.options.getString('bet');
    
    if (amount > user.wallet) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You only have ${formatMoney(user.wallet)}!`)],
        ephemeral: true 
      });
    }
    
    const number = random(0, 36);
    let color;
    
    if (number === 0) {
      color = 'green';
    } else if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(number)) {
      color = 'red';
    } else {
      color = 'black';
    }
    
    let multiplier = 0;
    
    if (bet === color) {
      if (color === 'green') {
        multiplier = 35;
      } else {
        multiplier = 2;
      }
    }
    
    if (multiplier > 0) {
      const winnings = amount * multiplier;
      user.wallet += winnings;
      user.stats.gamblingWins++;
      await user.save();
      
      const embed = successEmbed(
        '🎡 Roulette - You Won!',
        `The ball landed on **${number} (${color})**!\n\n` +
        `You won ${formatMoney(winnings)}!\n\n` +
        `**New Balance:** ${formatMoney(user.wallet)}`
      );
      
      await interaction.reply({ embeds: [embed] });
    } else {
      user.wallet -= amount;
      user.stats.gamblingLosses++;
      await user.save();
      
      const embed = errorEmbed(
        '🎡 Roulette - You Lost',
        `The ball landed on **${number} (${color})**!\n\n` +
        `You lost ${formatMoney(amount)}!\n\n` +
        `**New Balance:** ${formatMoney(user.wallet)}`
      );
      
      await interaction.reply({ embeds: [embed] });
    }
  },
};