const { Events, AuditLogEvent } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
    name: Events.GuildAuditLogEntryCreate,
    async execute(auditLog, guild) {
        const { action, executor, target, reason } = auditLog;

        if (action === AuditLogEvent.MemberKick) {
            await sendLog(
                guild, 
                'Audit Log: Member Kicked', 
                `**Target:** ${target.tag}\n**Executor:** ${executor.tag}\n**Reason:** ${reason || 'No reason provided'}`,
                0xED4245
            );
        }
        
    },
};