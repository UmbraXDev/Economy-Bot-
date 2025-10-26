const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { successEmbed, errorEmbed, infoEmbed } = require('../../utils/embeds');
const { formatMoney } = require('../../utils/economy');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Play blackjack against the dealer')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to bet')
        .setRequired(true)
        .setMinValue(10)),
  
  async execute(interaction, user) {
    const amount = interaction.options.getInteger('amount');
    
    if (amount > user.wallet) {
      return interaction.reply({ 
        embeds: [errorEmbed('❌ Insufficient Funds', `You only have ${formatMoney(user.wallet)}!`)],
        ephemeral: true 
      });
    }
    
    const drawCard = () => Math.min(Math.floor(Math.random() * 13) + 1, 11);
    
    let playerCards = [drawCard(), drawCard()];
    let dealerCards = [drawCard(), drawCard()];
    
    const calculateTotal = (cards) => {
      let total = cards.reduce((a, b) => a + b, 0);
      let aces = cards.filter(c => c === 11).length;
      
      while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
      }
      
      return total;
    };
    
    const playerTotal = calculateTotal(playerCards);
    const dealerTotal = calculateTotal(dealerCards);
    
    if (playerTotal === 21) {
      const winnings = Math.floor(amount * config.economy.blackjackMultiplier * 1.5);
      user.wallet += winnings;
      user.stats.gamblingWins++;
      await user.save();
      
      const embed = successEmbed(
        '🃏 Blackjack!',
        `**Your Cards:** ${playerCards.join(', ')} = **${playerTotal}**\n` +
        `**Dealer Cards:** ${dealerCards.join(', ')} = **${dealerTotal}**\n\n` +
        `🎉 BLACKJACK! You won ${formatMoney(winnings)}!\n\n` +
        `**New Balance:** ${formatMoney(user.wallet)}`
      );
      
      return interaction.reply({ embeds: [embed] });
    }
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('hit')
          .setLabel('Hit')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('stand')
          .setLabel('Stand')
          .setStyle(ButtonStyle.Success)
      );
    
    const embed = infoEmbed(
      '🃏 Blackjack',
      `**Your Cards:** ${playerCards.join(', ')} = **${playerTotal}**\n` +
      `**Dealer Shows:** ${dealerCards[0]}\n\n` +
      `Hit or Stand?`
    );
    
    const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
    
    const collector = response.createMessageComponentCollector({ time: 60000 });
    
    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: 'This is not your game!', ephemeral: true });
      }
      
      if (i.customId === 'hit') {
        playerCards.push(drawCard());
        const newTotal = calculateTotal(playerCards);
        
        if (newTotal > 21) {
          user.wallet -= amount;
          user.stats.gamblingLosses++;
          await user.save();
          
          const loseEmbed = errorEmbed(
            '🃏 Bust!',
            `**Your Cards:** ${playerCards.join(', ')} = **${newTotal}**\n\n` +
            `You busted! You lost ${formatMoney(amount)}!\n\n` +
            `**New Balance:** ${formatMoney(user.wallet)}`
          );
          
          await i.update({ embeds: [loseEmbed], components: [] });
          collector.stop();
        } else {
          const hitEmbed = infoEmbed(
            '🃏 Blackjack',
            `**Your Cards:** ${playerCards.join(', ')} = **${newTotal}**\n` +
            `**Dealer Shows:** ${dealerCards[0]}\n\n` +
            `Hit or Stand?`
          );
          
          await i.update({ embeds: [hitEmbed] });
        }
      } else if (i.customId === 'stand') {
        let finalDealerTotal = calculateTotal(dealerCards);
        
        while (finalDealerTotal < 17) {
          dealerCards.push(drawCard());
          finalDealerTotal = calculateTotal(dealerCards);
        }
        
        const finalPlayerTotal = calculateTotal(playerCards);
        
        if (finalDealerTotal > 21 || finalPlayerTotal > finalDealerTotal) {
          const winnings = amount * config.economy.blackjackMultiplier;
          user.wallet += winnings;
          user.stats.gamblingWins++;
          await user.save();
          
          const winEmbed = successEmbed(
            '🃏 You Win!',
            `**Your Cards:** ${playerCards.join(', ')} = **${finalPlayerTotal}**\n` +
            `**Dealer Cards:** ${dealerCards.join(', ')} = **${finalDealerTotal}**\n\n` +
            `You won ${formatMoney(winnings)}!\n\n` +
            `**New Balance:** ${formatMoney(user.wallet)}`
          );
          
          await i.update({ embeds: [winEmbed], components: [] });
        } else if (finalPlayerTotal === finalDealerTotal) {
          const tieEmbed = infoEmbed(
            '🃏 Push',
            `**Your Cards:** ${playerCards.join(', ')} = **${finalPlayerTotal}**\n` +
            `**Dealer Cards:** ${dealerCards.join(', ')} = **${finalDealerTotal}**\n\n` +
            `It's a tie! Your bet is returned.`
          );
          
          await i.update({ embeds: [tieEmbed], components: [] });
        } else {
          user.wallet -= amount;
          user.stats.gamblingLosses++;
          await user.save();
          
          const loseEmbed = errorEmbed(
            '🃏 Dealer Wins',
            `**Your Cards:** ${playerCards.join(', ')} = **${finalPlayerTotal}**\n` +
            `**Dealer Cards:** ${dealerCards.join(', ')} = **${finalDealerTotal}**\n\n` +
            `You lost ${formatMoney(amount)}!\n\n` +
            `**New Balance:** ${formatMoney(user.wallet)}`
          );
          
          await i.update({ embeds: [loseEmbed], components: [] });
        }
        
        collector.stop();
      }
    });
  },
};