# Economy-Bot-
A advanced economy bot running on mongo db database and / commands
# Support --> https://discord.gg/Whq4T2vYPP
const embed = new EmbedBuilder()
      .setTitle('💰 Economy Bot Commands')
      .setColor(config.colors.primary)
      .setDescription(`**Created by: ${config.developer}**\n[Support Server](${config.supportServer})`)
      .addFields(
        {
          name: '💵 Economy Commands',
          value: '`/balance` `/daily` `/weekly` `/monthly` `/beg` `/work` `/search` `/crime` `/mine` `/fish` `/hunt` `/loot` `/quest`',
          inline: false
        },
        {
          name: '🏦 Banking Commands',
          value: '`/deposit` `/withdraw` `/bankupgrade` `/bankinfo` `/interest`',
          inline: false
        },
        {
          name: '💸 Trading Commands',
          value: '`/pay` `/rob` `/globalstats` `/taxinfo`',
          inline: false
        },
        {
          name: '🏪 Shop Commands',
          value: '`/shop` `/buy` `/sell` `/inventory` `/use` `/gift`',
          inline: false
        },
        {
          name: '🎰 Gambling Commands',
          value: '`/coinflip` `/slots` `/roulette` `/blackjack` `/dice`',
          inline: false
        },
        {
          name: '🏆 Leaderboard & Stats',
          value: '`/leaderboard` `/stats` `/profile` `/achievements`',
          inline: false
        },
        {
          name: '⬆️ Upgrade Commands',
          value: '`/upgradewallet` `/upgradework` `/upgradeluck`',
          inline: false
        },
        {
          name: '👥 Social Commands',
          value: '`/richest` `/poorest` `/giveawaystart` `/giveawayend`',
          inline: false
        },
        {
          name: '⚙️ Admin Commands',
          value: '`/reseteconomy` `/addmoney` `/removemoney`',
          inline: false
        }
      )
