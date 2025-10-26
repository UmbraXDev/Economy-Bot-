const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hunt')
    .setDescription('Hunt for animals'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'hunt');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ Still Hunting!',
        `You can hunt again in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const amount = random(config.economy.hunt.min, config.economy.hunt.max);
    await addMoney(user, amount, 'wallet');
    setCooldown(user, 'hunt', config.economy.hunt.cooldown);
    await user.save();
    
    const animals = ['Deer', 'Rabbit', 'Duck', 'Boar', 'Fox', 'Bear'];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    
    const embed = successEmbed(
      '🏹 Successful Hunt!',
      `You hunted a **${animal}** and sold it for ${formatMoney(amount)}!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};