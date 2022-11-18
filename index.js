const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config.json");

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.DirectMessages,
];

const client = new Client({
  intents,
  ws: { intents },
  partials: [Partials.Channel],
});

const channelId = "1041628176637493282";

client.on("voiceStateUpdate", (oldMember, newMember) => {
  const resource = createAudioResource("./tu-tu-ru.opus", {
    inlineVolume: true,
  });
  const player = createAudioPlayer();
  setTimeout(() => {
    if (oldMember.channelId === null) {
      client.channels.fetch(channelId).then((channel) => {
        const VoiceConnection = joinVoiceChannel({
          channelId: channelId,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        resource.volume.setVolume(0.9);
        VoiceConnection.subscribe(player);
        player.play(resource);
        player.on("idle", () => {
          try {
            player.stop();
          } catch (e) {}
          try {
            VoiceConnection.destroy();
          } catch (e) {}
        });
      });
    }
  }, 300);
});

client.login(config.BOT_TOKEN);
