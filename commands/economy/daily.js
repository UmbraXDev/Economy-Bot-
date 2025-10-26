const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward!'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'daily');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ Cooldown Active',
        `You can claim your daily reward again in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const amount = random(config.economy.dailyReward.min, config.economy.dailyReward.max);
    await addMoney(user, amount, 'wallet');
    setCooldown(user, 'daily', config.cooldowns.daily);
    await user.save();
    
    const embed = successEmbed(
      '🎁 Daily Reward Claimed!',
      `You received ${formatMoney(amount)}!\n` +
      `Come back tomorrow for another reward!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};