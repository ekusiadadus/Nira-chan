require("dotenv").config();
const cron = require("cron");
const fs = require("fs");
const Commando = require("discord.js-commando");
const { prefix, allowlists } = require("./config.json");
const { MessageEmbed } = require("discord.js");

// Commando
const client = new Commando.CommandoClient({
    owner: "228880116699103232",
    commandPrefix: prefix,
    unknownCommand: false,
    help: false
});

// Events and Commands
fs.readdir("./Events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      const event = require(`./Events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
    });
});

// Monthly Server Topics
var channelTitles = [
    "Byoushin wo Kamu", "Nouriueno Cracker", "Humanoid", "Mabushii DNA Dake", "Seigi", "Kettobashita Moufu", "Konnakoto Soudou", 
    "Haze Haseru Haterumade", "Dear Mr. 'F'", "Obenkyou Shitoiteyo", "MILABO", "Fastening", "Ham", "Darken"
];

const scheduledMessage = new cron.CronJob("0 0 1 * *", () => {
    const channel = client.channels.cache.find(channel => channel.id === "767550623767068742");
    const random = Math.floor(Math.random() * channelTitles.length);
    channel.setName(channelTitles[random]);
}, null, true, "Etc/UTC");
scheduledMessage.start();

var contributorRoles = [
    "Journalists", "Contestants", "Hackers", "Stans", "Editors",
    "Translators", "Meme Royalty", "Theorists", "Musicians", "Artists"
];
const inContributorGroup = r=>contributorRoles.includes(r.name);

// Starboard
client.on("messageReactionAdd", async (reaction, user) => {
    const starboard = client.channels.cache.find(channel => channel.id === "778734720879951922");
    const message = reaction.message;

    const handleStarboard = async () => {
        const image = message.attachments.size > 0 ? message.attachments.array()[0].url : "";

        const msgs = await starboard.messages.fetch({ limit: 100 });
        const existingMsg = msgs.find(msg => 
            msg.embeds.length === 1 ?
            (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
        if (existingMsg) {
            return;
        }
        else if (message.member.roles.cache.some(inContributorGroup) && 
        allowlists.contributionchannels.includes(message.channel.id)) {
            const embed = new MessageEmbed()
            .setColor(15844367)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${message.content}\n\n[context](${message.url})`)
            .setImage(image)
            .setFooter(reaction.message.id)
            .setTimestamp();

            if(starboard) {
                starboard.send(embed);
            }
        }
    }
    if(reaction.emoji.name === "⭐") {
        if (starboard) return;
        if(reaction.message.partial) {
            await reaction.fetch();
            await reaction.message.fetch();
            handleStarboard();
        }
        else {
            handleStarboard();
        }
    }
    else return;
});

client.login(process.env.CLIENT_TOKEN);