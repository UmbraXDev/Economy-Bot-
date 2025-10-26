const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work at your job to earn money'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'work');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ Still Working!',
        `You can work again in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    let amount = random(config.economy.work.min, config.economy.work.max);
    amount = Math.floor(amount * (user.upgrades.workLevel * config.economy.workUpgradeMultiplier));
    
    await addMoney(user, amount, 'wallet');
    setCooldown(user, 'work', config.economy.work.cooldown);
    await user.save();
    
    const job = config.workJobs[Math.floor(Math.random() * config.workJobs.length)];
    
    const embed = successEmbed(
      '💼 Work Complete',
      `You worked as a **${job}** and earned ${formatMoney(amount)}!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};
