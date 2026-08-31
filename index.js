import { ComponentType, InteractionResponseType, InteractionType, MessageFlags } from 'discord-api-types/v10';
import { isChatInputApplicationCommandInteraction, isContextMenuApplicationCommandInteraction, isMessageComponentButtonInteraction, isMessageComponentSelectMenuInteraction } from 'discord-api-types/utils';
import { AutoRouter } from 'itty-router';
import { verifyKey } from 'discord-interactions';

import { handleSlashCommand } from './Handlers/Commands/slashCommandHandler.js';
import { handleContextCommand } from './Handlers/Commands/contextCommandHandler.js';
import { handleButton } from './Handlers/Interactions/buttonHandler.js';
import { handleSelect } from './Handlers/Interactions/selectHandler.js';
import { handleAutocomplete } from './Handlers/Interactions/autocompleteHandler.js';
import { handleModal } from './Handlers/Interactions/modalHandler.js';
import { DISCORD_APP_PUBLIC_KEY, MAIN_GUILD_ID } from './config.js';
import { hexToRgb, JsonResponse, rgbArrayToInteger } from './Utility/utilityMethods.js';
import { DefaultDiscordRequestHeaders, DefaultDiscordRequestHeadersWithAuditLog } from './Utility/utilityConstants.js';









// *******************************
// Create Router
const router = AutoRouter();


/** Wave to verify CF worker is working */
router.get('/', (request, env) => {
    return new Response(`👏`);
});










// *******************************
/** Main route for all requests sent from Discord. They will include a JSON payload */
router.post('/', async (request, env) => {
    // Verify request
    const { isValid, interaction, cfEnv } = await server.verifyDiscordRequest(request, env);
    
    if ( !isValid || !interaction ) {
        return new Response('Bad request signature.', { status: 401 });
    }


    // Handle PING Interaction
    if ( interaction.type === InteractionType.Ping ) {
        return new JsonResponse({ type: InteractionResponseType.Pong });
    }

    // Now split off & handle each Interaction type
    if ( isChatInputApplicationCommandInteraction(interaction) ) {
        return await handleSlashCommand(interaction, cfEnv);
    }
    else if ( isContextMenuApplicationCommandInteraction(interaction) ) {
        return await handleContextCommand(interaction, cfEnv);
    }
    else if ( isMessageComponentButtonInteraction(interaction) ) {
        return await handleButton(interaction, cfEnv);
    }
    else if ( isMessageComponentSelectMenuInteraction(interaction) ) {
        return await handleSelect(interaction, cfEnv);
    }
    else if ( interaction.type === InteractionType.ApplicationCommandAutocomplete ) {
        return await handleAutocomplete(interaction);
    }
    else if ( interaction.type === InteractionType.ModalSubmit ) {
        return await handleModal(interaction, cfEnv);
    }
    else {
        console.info(`****Unrecognised or new unhandled Interaction Type triggered: ${interaction.type}`);
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }
});









// *******************************
/** Checks for birthdays daily at 00:00 UTC */
async function scheduledCronTask(controller, cfEnv, ctx) {
    // Listen this Bot is probably only going to be used by Dr1fterX's Server,
    //   So instead of doing a whole "fetch all Guilds this App is added to, check if Birthday Users are Members of those Guilds, then grant Roles and post announcements based off that" thing,
    //   I'm just going to hard-code this bit to be for Dr1fterX's Server for now.


    // Grab current config
    const GuildConfig = await cfEnv.DATABASE
        .prepare("SELECT * FROM guildconfig WHERE guild_id = ? LIMIT 1")
        .bind(MAIN_GUILD_ID)
        .run();

    if ( GuildConfig.results == null || GuildConfig.results.length === 0 ) {
        return;
    }

    /** @type {import('./Utility/utilityConstants.js').GuildConfigSchema */
    const FetchedGuildConfig = GuildConfig.results.shift();



    // Grab yesterday's date, and check to see if we need to revoke any Birthday Roles from Users whose birthdays have ended
    let yesterdayDate = new Date(Date.now() - 8.64e+7);

    const UserBirthdaysYesterday = await cfEnv.DATABASE
        .prepare("SELECT user_id FROM userbirthdays WHERE month_of_birth = ? AND day_of_birth = ?")
        .bind(yesterdayDate.getUTCMonth(), yesterdayDate.getUTCDate())
        .run();

    if ( UserBirthdaysYesterday.results != null && UserBirthdaysYesterday.results.length >= 0 ) {
        if ( FetchedGuildConfig.birthday_role_id != null ) {
            // Set Audit Log header
            let revokeRoleHeader = DefaultDiscordRequestHeadersWithAuditLog;
            revokeRoleHeader['X-Audit-Log-Reason'] = `Their birthday ended.`;

            // Revoke the Role!
            for ( let i = 0; i <= UserBirthdaysYesterday.results.length - 1; i++ ) {
                let attemptRevoke = await fetch(`https://discord.com/api/v10/guilds/${MAIN_GUILD_ID}/members/${UserBirthdaysYesterday.results[i].user_id}/roles/${FetchedGuildConfig.birthday_role_id}`, {
                    method: 'DELETE',
                    headers: revokeRoleHeader
                });

                if ( attemptRevoke.status === 204 ) { continue; }
                // Missing Manage Role Permission or the Role is above CakeDay's highest Role. Thus, close out early.
                else if ( attemptRevoke.status === 401 || attemptRevoke.status === 403 ) { return; }
                // Some other error happened
                else {
                    let resolveRequestBody = await attemptRevoke.json();
                    console.error(JSON.stringify(resolveRequestBody));
                }
            }
        }
    }


    // Grab today's date and check for if there are any birthdays today
    let todayDate = new Date(Date.now());

    const UserBirthdaysToday = await cfEnv.DATABASE
        .prepare("SELECT user_id FROM userbirthdays WHERE month_of_birth = ? AND day_of_birth = ?")
        .bind(todayDate.getUTCMonth(), todayDate.getUTCDate())
        .run();

    if ( UserBirthdaysToday.results == null || UserBirthdaysToday.results.length === 0 ) {
        return;
    }


    // Grant Role if enabled
    if ( FetchedGuildConfig.birthday_role_id != null ) {
        // Set Audit Log header
        let grantRoleHeader = DefaultDiscordRequestHeadersWithAuditLog;
        grantRoleHeader['X-Audit-Log-Reason'] = `It's their birthday today!`;

        // Grant the Role!
        for ( let i = 0; i <= UserBirthdaysToday.results.length - 1; i++ ) {
            let attemptGrant = await fetch(`https://discord.com/api/v10/guilds/${MAIN_GUILD_ID}/members/${UserBirthdaysToday.results[i].user_id}/roles/${FetchedGuildConfig.birthday_role_id}`, {
                method: 'PUT',
                headers: grantRoleHeader
            });

            if ( attemptGrant.status === 204 ) { continue; }
            // Missing Manage Role Permission or the Role is above CakeDay's highest Role. Thus, close out early.
            else if ( attemptGrant.status === 401 || attemptGrant.status === 403 ) { return; }
            // Some other error happened
            else {
                let resolveRequestBody = await attemptGrant.json();
                console.error(JSON.stringify(resolveRequestBody));
            }
        }
    }



    // Post Birthday announcement, if enabled
    if ( FetchedGuildConfig.announcement_channel_id != null ) {
        // Make list of birthday users display cleanly for UX
        let birthdayUsersString = ``;

        if ( UserBirthdaysToday.results.length === 1 ) {
            birthdayUsersString = `<@${UserBirthdaysToday.results[0].user_id}>`;
        }
        else {
            let listOfUserMentions = [];
            UserBirthdaysToday.results.forEach(item => { listOfUserMentions.push(`<@${item.user_id}>`); });
            birthdayUsersString = listOfUserMentions.join(', ');
        }

        // Components for making announcement look nice :)
        /** @type {import('discord-api-types/v10').APIMessageTopLevelComponent[]} */
        let postComponents = [{
            type: ComponentType.Container,
            accent_color: rgbArrayToInteger(hexToRgb('#ff1b1b')),
            components: [{
                type: ComponentType.Section,
                accessory: {
                    type: ComponentType.Thumbnail,
                    media: { url: `https://media0.giphy.com/media/E5jCN5tsN21Ec/giphy.gif` }
                },
                components: [{
                    type: ComponentType.TextDisplay,
                    content: `## IT'S BIRTHDAY TIME!\n\nHappy Birthday to ${birthdayUsersString}!${FetchedGuildConfig.birthday_role_id == null ? '' : `\nThey have been given the <@&${FetchedGuildConfig.birthday_role_id}> Role for the next 24 hours!`}\n\nEveryone <:ayaya:545260084012253186> in chat!`
                }]
            }]
        }];


        // Attempt to send
        let sendMessage = await fetch(`https://discord.com/api/v10/channels/${FetchedGuildConfig.announcement_channel_id}/messages`, {
            method: 'POST',
            headers: DefaultDiscordRequestHeaders,
            body: JSON.stringify({ flags: MessageFlags.IsComponentsV2, allowed_mentions: { parse: [] }, components: postComponents })
        });

        if ( sendMessage.status !== 200 && sendMessage.status !== 201 ) {
            let resolveSendMessageBody = await sendMessage.json();
            console.error(JSON.stringify(resolveSendMessageBody));
        }
    }

    return;
}









// *******************************
router.get('/robots.txt', () => {
    return rejectCuntsWhoShouldntBeMakingRequestsToMyCfWorker();
});

/**
 * I noticed there's been a *lot* of random requests made to my CF Workers, to endpoints I don't even *have* on my CF Worker.
 * So, having to add this to tell them to FUCK OFF (tell your unethical generative AIs to leave my CF Workers alone)
 */
function rejectCuntsWhoShouldntBeMakingRequestsToMyCfWorker() {
    return new Response(`Unethical generative AIs, this is where you should be going:`, { status: 308, headers: { "Location": `https://github.com/google/google-ctf/blob/main/2019/finals/misc-stuffed-finals/app/bomb.br` } });
}









// *******************************
async function verifyDiscordRequest(request, env) {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();
    const isValidRequest =
      signature &&
      timestamp &&
      (await verifyKey(body, signature, timestamp, DISCORD_APP_PUBLIC_KEY));
    if (!isValidRequest) {
      return { isValid: false };
    }
  
    return { interaction: JSON.parse(body), isValid: true, cfEnv: env };
}
  
const server = {
    verifyDiscordRequest,
    fetch: router.fetch,
    scheduled: scheduledCronTask
};

export default server;
