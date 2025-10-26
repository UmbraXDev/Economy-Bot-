const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { calculateInterest, formatMoney } = require('../../utils/economy');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('interest')
    .setDescription('Collect daily interest from your bank'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'interest');
    
    if (cooldown) {
      return interaction.reply({ 
        embeds: [errorEmbed('⏰ Interest Pending', `You can collect interest again in **${formatCooldown(cooldown)}**`)],
        ephemeral: true 
      });
    }
    
    if (user.bank === 0) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ No Bank Balance', 'You need money in your bank to earn interest!')],
        ephemeral: true 
      });
    }
    
    const interest = calculateInterest(user.bank, config.economy.interestRate);
    user.bank += interest;
    if (user.bank > user.maxBank) user.bank = user.maxBank;
    
    setCooldown(user, 'interest', 86400000);
    await user.save();
    
    const embed = successEmbed(
      '💸 Interest Collected!',
      `You earned ${formatMoney(interest)} in interest!\n` +
      `**New Bank Balance:** ${formatMoney(user.bank)}`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};