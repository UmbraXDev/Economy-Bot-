const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { getCooldown, setCooldown, formatCooldown } = require('../../utils/cooldowns');
const { addMoney, formatMoney, random } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quest')
    .setDescription('Complete an adventure quest'),
  
  async execute(interaction, user) {
    const cooldown = getCooldown(user, 'quest');
    
    if (cooldown) {
      const embed = errorEmbed(
        '⏰ On Cooldown!',
        `You can start another quest in **${formatCooldown(cooldown)}**`
      );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const amount = random(config.economy.quest.min, config.economy.quest.max);
    await addMoney(user, amount, 'wallet');
    setCooldown(user, 'quest', config.economy.quest.cooldown);
    await user.save();
    
    const quests = [
      'Defeated the Dragon',
      'Rescued the Princess',
      'Found the Treasure',
      'Slayed the Monster',
      'Completed the Dungeon'
    ];
    const quest = quests[Math.floor(Math.random() * quests.length)];
    
    const embed = successEmbed(
      '⚔️ Quest Complete!',
      `You **${quest}** and earned ${formatMoney(amount)}!`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};