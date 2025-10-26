const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fish')
    .setDescription('Go fishing for some coins'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'fish');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ Still Fishing!',
        `You can fish again in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const amount = random(config.economy.fish.min, config.economy.fish.max);
    await addMoney(user, amount, 'wallet');
    setCooldown(user, 'fish', config.economy.fish.cooldown);
    await user.save();
    
    const fishes = ['Salmon', 'Tuna', 'Bass', 'Trout', 'Catfish', 'Goldfish'];
    const fish = fishes[Math.floor(Math.random() * fishes.length)];
    
    const embed = successEmbed(
      '🎣 Nice Catch!',
      `You caught a **${fish}** and sold it for ${formatMoney(amount)}!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};