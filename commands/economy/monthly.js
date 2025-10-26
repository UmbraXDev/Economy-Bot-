const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('monthly')
    .setDescription('Claim your monthly reward!'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'monthly');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ Cooldown Active',
        `You can claim your monthly reward again in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const amount = random(config.economy.monthlyReward.min, config.economy.monthlyReward.max);
    await addMoney(user, amount, 'wallet');
    setCooldown(user, 'monthly', config.cooldowns.monthly);
    await user.save();
    
    const embed = successEmbed(
      '🎁 Monthly Reward Claimed!',
      `You received ${formatMoney(amount)}!\n` +
      `Come back next month for another reward!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};