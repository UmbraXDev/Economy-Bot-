const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loot')
    .setDescription('Loot abandoned places'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'loot');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ Already Looted!',
        `You can loot again in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const amount = random(config.economy.loot.min, config.economy.loot.max);
    await addMoney(user, amount, 'wallet');
    setCooldown(user, 'loot', config.economy.loot.cooldown);
    await user.save();
    
    const places = ['Abandoned House', 'Old Factory', 'Crashed Ship', 'Ancient Ruins'];
    const place = places[Math.floor(Math.random() * places.length)];
    
    const embed = successEmbed(
      '📦 Looting Success!',
      `You looted an **${place}** and found ${formatMoney(amount)}!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};