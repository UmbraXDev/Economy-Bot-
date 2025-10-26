/**
 * Discord Economy Bot - Main Entry Point
 * Created by: Umbra X Development
 * Support Server: https://discord.gg/Whq4T2vYPP
 */

require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();

function loadCommands(dir) {
  const files = fs.readdirSync(path.join(__dirname, dir));
  
  for (const file of files) {
    const filePath = path.join(__dirname, dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      loadCommands(path.join(dir, file));
    } else if (file.endsWith('.js')) {
      const command = require(filePath);
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded: ${command.data.name}`);
      }
    }
  }
}

loadCommands('commands');

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`✅ Event loaded: ${event.name}`);
}

async function registerCommands() {
  const commands = [];
  client.commands.forEach(command => {
    commands.push(command.data.toJSON());
  });

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log('🔄 Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Successfully registered slash commands!');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Connected to MongoDB');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎮 Discord Economy Bot v1.0.0');
    console.log('👨‍💻 Created by: Umbra X Development');
    console.log('🔗 Support: https://discord.gg/Whq4T2vYPP');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

client.login(process.env.DISCORD_TOKEN)
  .then(() => registerCommands())
  .catch(err => {
    console.error('❌ Failed to login:', err);
    process.exit(1);
  });

process.on('unhandledRejection', error => {
  console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Uncaught exception:', error);
});

module.exports = client;