const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('achievements')
    .setDescription('View your achievements'),
  
  async execute(interaction, user) {
    if (!user.achievements || user.achievements.length === 0) {
      const embed = infoEmbed(
        '🏅 Achievements',
        'You haven\'t unlocked any achievements yet!\n\n' +
        'Keep playing to unlock achievements!'
      );
      return interaction.reply({ embeds: [embed] });
    }
    
    let description = '';
    user.achievements.forEach((achievement, index) => {
      description += `${index + 1}. ${achievement}\n`;
    });
    
    const embed = infoEmbed(
      `🏅 ${interaction.user.username}'s Achievements`,
      description
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};