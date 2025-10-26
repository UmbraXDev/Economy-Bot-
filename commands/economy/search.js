const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for coins in various locations'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'search');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ Already Searched!',
        `You can search again in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const amount = random(config.economy.search.min, config.economy.search.max);
    await addMoney(user, amount, 'wallet');
    setCooldown(user, 'search', config.economy.search.cooldown);
    await user.save();
    
    const location = config.searchLocations[Math.floor(Math.random() * config.searchLocations.length)];
    
    const embed = successEmbed(
      '🔍 Search Success',
      `You searched the **${location}** and found ${formatMoney(amount)}!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};