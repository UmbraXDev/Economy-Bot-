const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { getGuild } = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('taxinfo')
    .setDescription('View tax information'),
  
  async execute(interaction, user) {
    const guild = await getGuild(interaction.guildId, interaction.guild.name);
    
    const taxRate = (guild.settings.taxRate * 100).toFixed(1);
    
    const embed = infoEmbed(
      '💼 Tax Information',
      `**Current Tax Rate:** ${taxRate}%\n` +
      `**Total Tax Collected:** 🪙 ${guild.stats.totalTaxCollected.toLocaleString()}\n\n` +
      `*Taxes are applied to certain transactions to maintain the economy balance.*`
    );
    
    await interaction.reply({ embeds: [embed] });
  },
};
