import { Guild, MessageEmbed, TextChannel } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { CommandoClient } from 'discord.js-commando';

import { onGuildDelete } from '../config/event_handler.json';
import { keyv } from '../database/keyv';
import { updateMap } from '../jobs/emojiMap';

const prisma = new PrismaClient();

export default async function (client: CommandoClient, guild: Guild) {
  if ((await keyv.get(Object.keys({ onGuildDelete })[0])) === false) {
    return;
  }

  await prisma.auth.delete({
    where: {
      guildId: guild.id,
    },
  });

  let plural = '';
  if (guild.memberCount > 1) {
    plural = 's';
  }

  const leaveEmbed = new MessageEmbed({
    title: `Left ${guild.name}!`,
    description: `**Owner:** ${guild.owner.user.tag}\n**Owner ID:** ${guild.owner.user.id}`,
    color: '#f0534b',
    thumbnail: { url: guild.iconURL({ dynamic: true }) },
    footer: { text: `${guild.name} (${guild.id}) now has ${guild.memberCount} member${plural}.` },
  });

  const guildLog = <TextChannel>await client.channels.fetch('823270262194569216');
  guildLog.send(leaveEmbed);

  updateMap(client);
}
