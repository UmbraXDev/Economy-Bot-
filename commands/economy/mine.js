const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mine')
    .setDescription('Mine for valuable resources'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'mine');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ Mine Exhausted!',
        `You can mine again in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const amount = random(config.economy.mine.min, config.economy.mine.max);
    await addMoney(user, amount, 'wallet');
    setCooldown(user, 'mine', config.economy.mine.cooldown);
    await user.save();
    
    const ores = ['Coal', 'Iron', 'Gold', 'Diamond', 'Emerald'];
    const ore = ores[Math.floor(Math.random() * ores.length)];
    
    const embed = successEmbed(
      '⛏️ Mining Success',
      `You mined some **${ore}** and sold it for ${formatMoney(amount)}!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};