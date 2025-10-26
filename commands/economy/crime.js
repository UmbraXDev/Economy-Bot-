const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, removeMoney, formatMoney, random, percentage } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crime')
    .setDescription('Commit a crime for high rewards (risky!)'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'crime');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ Laying Low!',
        `You can commit another crime in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const crime = config.crimes[Math.floor(Math.random() * config.crimes.length)];
    const success = !percentage(config.economy.crime.failChance);
    
    setCooldown(user, 'crime', config.economy.crime.cooldown);
    
    if (success) {
      const amount = random(config.economy.crime.min, config.economy.crime.max);
      await addMoney(user, amount, 'wallet');
      await user.save();
      
      const embed = successEmbed(
        '😈 Crime Success!',
        `You successfully completed: **${crime}**\n` +
        `You earned ${formatMoney(amount)}!`
      );
      
      await interaction.reply({ embeds: [embed] });
    } else {
      await removeMoney(user, config.economy.crime.fine, 'wallet');
      await user.save();
      
      const embed = errorEmbed(
        '🚓 Caught!',
        `You got caught while **${crime}**!\n` +
        `You paid a fine of ${formatMoney(config.economy.crime.fine)}!`
      );
      
      await interaction.reply({ embeds: [embed] });
    }
  },
};