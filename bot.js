const { Events, Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const Token = "Token";
const ServerUrl = "http://localhost:8080";
const prvToken = "OlvihPcvyIhNij";

client.once(Events.ClientReady, async () => {
    console.log(`Logged As ${client.user.tag}`);
   
    const commands = [
        new SlashCommandBuilder()
            .setName('serverinfo')
            .setDescription('Avoir les informations du serveur')
    ];

    await client.application.commands.set(commands);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'serverinfo') {
        await GetServerInfos(interaction);
    }
});

async function GetServerInfos(interaction) {
    await interaction.deferReply();

    try {
        const response = await axios.get(`${ServerUrl}/serverinfo?token=${prvToken}`);
        const data = response.data;
        const guild = interaction.guild;

        const embed = new EmbedBuilder()
            .setTitle('Informations du serveur')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name: 'Serveur Discord',
                    value: `> Nom: ${guild.name}\n> Membres: ${guild.memberCount}`,
                    inline: false
                },
                {
                    name: 'Serveur Nova-Life',
                    value: `> Nom: ${data.serverName}\n> Joueurs: ${data.players}`,
                    inline: false
                }
            )
            .setFooter({ 
                text: interaction.user.tag, 
                iconURL: interaction.user.displayAvatarURL() 
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        await interaction.editReply('Erreur: Impossible de contacter le serveur');
    }
}

client.login(Token);
