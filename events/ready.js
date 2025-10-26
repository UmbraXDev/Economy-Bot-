/**
 * Ready Event
 * Created by: Umbra X Development
 * Support: https://discord.gg/Whq4T2vYPP
 */

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot is online as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    client.user.setActivity('💰 Economy Bot | /help', { type: 'PLAYING' });
  },
};
