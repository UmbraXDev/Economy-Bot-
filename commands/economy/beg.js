const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Beg for some coins'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'beg');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ Too Soon!',
        `You can beg again in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const amount = random(config.economy.beg.min, config.economy.beg.max);
    await addMoney(user, amount, 'wallet');
    setCooldown(user, 'beg', config.economy.beg.cooldown);
    await user.save();
    
    const responses = [
      `Someone felt generous and gave you ${formatMoney(amount)}!`,
      `A kind stranger donated ${formatMoney(amount)} to you!`,
      `You found ${formatMoney(amount)} on the street!`,
      `Someone threw ${formatMoney(amount)} at you!`,
    ];
    
    const embed = successEmbed(
      '🤲 Begging Success',
      responses[Math.floor(Math.random() * responses.length)]
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};