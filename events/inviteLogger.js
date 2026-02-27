const { Events, Collection } = require('discord.js');
const { sendLog } = require('../utils/logger');

const invites = new Collection();

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        client.guilds.cache.forEach(async (guild) => {
            try {
                const firstInvites = await guild.invites.fetch();
                invites.set(guild.id, new Collection(firstInvites.map((inv) => [inv.code, inv.uses])));
            } catch (err) {
                console.log(err);
            }
        });

        client.on(Events.GuildMemberAdd, async (member) => {
            const { guild } = member;

            try {
                const newInvites = await guild.invites.fetch();
                const oldInvites = invites.get(guild.id);
                const invite = newInvites.find((i) => i.uses > (oldInvites.get(i.code) || 0));
                
                invites.set(guild.id, new Collection(newInvites.map((inv) => [inv.code, inv.uses])));

                const inviter = invite ? invite.inviter : null;
                const logTitle = '📥 Member Joined';
                let logDesc = `**Member:** ${member.user.tag}\n**ID:** ${member.id}`;

                if (inviter) {
                    logDesc += `\n**Invited By:** ${inviter.tag}\n**Invite Code:** \`${invite.code}\`\n**Total Uses:** \`${invite.uses}\``;
                } else {
                    logDesc += `\n**Invited By:** Unknown (Vanity URL or Permanent Link)`;
                }

                await sendLog(
                    guild,
                    logTitle,
                    logDesc,
                    0x2ecc71,
                    member.user.displayAvatarURL()
                );

            } catch (err) {
                console.error(err);
            }
        });

        client.on(Events.InviteCreate, async (invite) => {
            const guildInvites = invites.get(invite.guild.id);
            if (guildInvites) guildInvites.set(invite.code, invite.uses);
        });

        client.on(Events.InviteDelete, async (invite) => {
            const guildInvites = invites.get(invite.guild.id);
            if (guildInvites) guildInvites.delete(invite.code);
        });
    },
};