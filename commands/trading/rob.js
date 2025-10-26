const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatMoney, percentage, random } = require('../../utils/economy');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { getUser } = require('../../utils/database');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Attempt to rob someone (risky!)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to rob')
        .setRequired(true)),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'rob');
    
    if (cooldown) {
      return interaction.reply({ 
        embeds: [errorEmbed('⏰ Cooldown Active', `You can rob again in **${formatCooldown(cooldown)}**`)],
        ephemeral: true 
      });
    }
    
    const target = interaction.options.getUser('user');
    
    if (target.id === interaction.user.id) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Invalid Target', 'You cannot rob yourself!')],
        ephemeral: true 
      });
    }
    
    if (target.bot) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Invalid Target', 'You cannot rob bots!')],
        ephemeral: true 
      });
    }
    
    const targetUser = await getUser(target.id, interaction.guildId);
    
    if (targetUser.wallet < config.economy.robMinimum) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Not Worth It', `${target.username} doesn't have enough money to rob!`)],
        ephemeral: true 
      });
    }
    
    setCooldown(user, 'rob', config.economy.robCooldown);
    
    const success = percentage(config.economy.robSuccessChance);
    
    if (success) {
      const stolen = Math.floor(targetUser.wallet * random(10, 40) / 100);
      targetUser.wallet -= stolen;
      user.wallet += stolen;
      
      await user.save();
      await targetUser.save();
      
      const embed = successEmbed(
        '😈 Robbery Success!',
        `You successfully robbed ${formatMoney(stolen)} from ${target.username}!`
      );
      
      await interaction.reply({ embeds: [embed] });
    } else {
      const fine = Math.floor(user.wallet * 0.3);
      user.wallet -= fine;
      if (user.wallet < 0) user.wallet = 0;
      
      await user.save();
      
      const embed = errorEmbed(
        '🚓 Caught!',
        `You got caught trying to rob ${target.username}!\n` +
        `You paid a fine of ${formatMoney(fine)}!`
      );
      
      await interaction.reply({ embeds: [embed] });
    }
  },
};