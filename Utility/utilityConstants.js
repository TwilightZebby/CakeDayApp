import { Collection } from '@discordjs/collection';
import { ChannelType } from 'discord-api-types/v10';
import { DISCORD_TOKEN } from '../config.js';


// *******************************
//  Exports

// TYPINGS
/**
 * @typedef {Object} GuildConfigSchema
 * @property {String} guild_id ID of the Discord Guild
 * @property {?String} birthday_role_id ID of the Role in the Discord Guild to grant as the Birthday Role
 * @property {?String} announcement_channel_id ID of the Text-based Channel in the Discord Guild to post Cake Days in
 * @property {?String} announcement_sidebar_color Colour, in Hex format such as #4488cc, of the sidebar in the Cake Day posts
 * 
 * @public
 */



/** Utility & Command/Interaction Collections */
export const UtilityCollections = {
    /** Holds all Cooldowns for Slash Commands, mapped by "commandName_userID"
     * @type {Collection<String, Number>} 
     */
    SlashCooldowns: new Collection(),

    /** Holds all Cooldowns for Context Commands, mapped by "commandName_userID"
     * @type {Collection<String, Number>} 
     */
    ContextCooldowns: new Collection(),

    /** Holds all Cooldowns for Button Interactions, mapped by "buttonName_userID"
     * @type {Collection<String, Number>} 
     */
    ButtonCooldowns: new Collection(),

    /** Holds all Cooldowns for Select Menu Interactions, mapped by "selectName_userID"
     * @type {Collection<String, Number>}
     */
    SelectCooldowns: new Collection()
};




/** RegEx for Role Mentions */
export const RoleMentionRegEx = new RegExp(/<@&(\d{17,20})>/g);

/** RegEx for Discord Custom Emoji */
export const DiscordEmojiRegex = new RegExp(/<a?:(?<name>[a-zA-Z0-9\_]+):(?<id>\d{15,21})>/);

/** RegEx for Hex Colour Codes */
export const HexColourRegex = new RegExp(/#[0-9a-fA-F]{6}/);



/** Thread-like Channel Types (just for ease) */
export const ThreadLikeChannelTypes = [
    ChannelType.AnnouncementThread, ChannelType.PublicThread, ChannelType.PrivateThread
];



/** Default request headers for Discord API requests */
export const DefaultDiscordRequestHeaders = {
    'content-type': 'application/json',
    Authorization: `Bot ${DISCORD_TOKEN}`,
}

/** Default request headers for Discord API requests, but with audit log entry supported */
export const DefaultDiscordRequestHeadersWithAuditLog = {
    'content-type': 'application/json',
    Authorization: `Bot ${DISCORD_TOKEN}`,
    'X-Audit-Log-Reason': ""
}






/** Endpoint for sending Messages (outside of Interactions)
 * @param channelId ID of the Channel to create a new Message in
 * 
 * @note Uses POST Calls
 */
export const CreateMessageEndpoint = (channelId) => `https://discord.com/api/v10/channels/${channelId}/messages`;

/** Endpoint for editing Messages (outside of Interactions)
 * @param channelId ID of the Channel the Message is in
 * @param messageId ID of the Message to edit
 * 
 * @note Use PATCH to edit - DELETE to delete
 */
export const ManageMessageEndpoint = (channelId, messageId) => `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;

/** Endpoint for creating Interaction Responses
 * @param interactionId {String} ID of the Interaction to respond to
 * @param interactionToken {String} Token of the Interaction to respond to
 * 
 * @note Uses POST Calls
 */
export const CreateInteractionResponseEndpoint = (interactionId, interactionToken) => `https://discord.com/api/v10/interactions/${interactionId}/${interactionToken}/callback`;

/** Endpoint for getting, editing, or deleting ORIGINAL Interaction Responses
 * @param applicationId {String} ID of the Application that sent the Interaction Response
 * @param interactionToken {String} Token of the Interaction to get/edit/delete its Response of
 * 
 * @note Use GET to fetch - PATCH to edit - DELETE to delete
 */
export const OriginalInteractionResponseEndpoint = (applicationId, interactionToken) => `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;

/** Endpoint for creating a Followup Response to an Interaction
 * @param applicationId {String} ID of the Application to send a Followup Response for
 * @param interactionToken {String} Token of the original Interaction to followup
 * 
 * @note Uses POST Calls
 */
export const CreateInteractionFollowupEndpoint = (applicationId, interactionToken) => `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`;
