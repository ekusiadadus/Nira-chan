const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

module.exports = class Rule0w0Command extends Command {
    constructor(client) {
        super(client, {
            name: "0w0",
            group: "misc",
            memberName: "0w0",
            description: "P-Pwovide anyothew usew with some much-wewcome encouwagement! -( ﾟ▽ﾟ)/ ",
        });    
    }

    run(message) {
        if (message.guild.id === "603246092402032670") {
            const rule0w0 = new MessageEmbed()
            .setTitle("(Swecrwet Rwulwe) 0w0. Bwe Kwind to Youwsewf")
            .setDescription(
                "We cawe fow ywou, so stwop byeatwing youwsewf up. (・`ω´・)\nNyot evewything is youw fauwt, so "
                + "pwease keep twusting youwsewf, and ouw wespect and wuv fow you.");
            message.channel.send(rule0w0);
        }
    }
};