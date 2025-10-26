const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weekly')
    .setDescription('Claim your weekly reward!'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'weekly');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ Cooldown Active',
        `You can claim your weekly reward again in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const amount = random(config.economy.weeklyReward.min, config.economy.weeklyReward.max);
    await addMoney(user, amount, 'wallet');
    setCooldown(user, 'weekly', config.cooldowns.weekly);
    await user.save();
    
    const embed = successEmbed(
      '🎁 Weekly Reward Claimed!',
      `You received ${formatMoney(amount)}!\n` +
      `Come back next week for another reward!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};