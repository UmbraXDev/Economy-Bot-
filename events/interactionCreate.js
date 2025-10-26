/**
 * Interaction Handler
 * Created by: Umbra X Development
 * Support: https://discord.gg/Whq4T2vYPP
 */

const { getUser } = require('../utils/database');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      const user = await getUser(interaction.user.id, interaction.guildId);
      user.stats.commandsUsed++;
      await user.save();
      
      await command.execute(interaction, user);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}:`, error);
      const reply = { content: '❌ An error occurred!', ephemeral: true };
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  },
};