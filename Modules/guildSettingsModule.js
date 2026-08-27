import { ButtonStyle, ComponentType, InteractionResponseType, MessageFlags, SeparatorSpacingSize } from "discord-api-types/v10";
import { hexToRgb, JsonResponse, rgbArrayToInteger } from "../Utility/utilityMethods.js";




/** Utility method for grabbing the Guild's CakeDay Settings in order to show the main settings page
 * 
 * @param {import('discord-api-types/v10').APIChatInputApplicationCommandInteraction} interaction 
 * @param {'NEW'|'EDIT'} responseType Type of Interaction response to use to show the settings page
 * @param {*} cfEnv
 */
export async function settingsFetchAndShowMainPanel(interaction, responseType, cfEnv) {
    const { results } = await cfEnv.DATABASE
        .prepare("SELECT * FROM guildconfig WHERE guild_id = ? LIMIT 1")
        .bind(interaction.guild_id)
        .run();

    if ( results == null || results.length === 0 ) {
        return settingsShowDefaultMainPanel(interaction, responseType);
    }
    else {
        return settingsShowConfiguredMainPanel(interaction, results.shift(), responseType);
    }
}




/** Shows the default main page for the settings panel.
 * 
 * This is used when either the Guild hasn't got any settings saved, or after the Guild has reset all settings.
 * 
 * @param {import('discord-api-types/v10').APIChatInputApplicationCommandInteraction} interaction 
 * @param {'NEW'|'EDIT'} responseType Type of Interaction response to use
 */
export function settingsShowDefaultMainPanel(interaction, responseType) {
    // Setup components
    /** @type {import('discord-api-types/v10').APIMessageTopLevelComponent[]} */
    let responseComponents = [{
        type: ComponentType.Container,
        accent_color: rgbArrayToInteger(hexToRgb('#2b68c4')),
        components: [{
            type: ComponentType.TextDisplay,
            content: `# __CakeDay Settings__\nSetup CakeDay's modules with the below options`
        }, {
            type: ComponentType.Separator,
            divider: true,
            spacing: SeparatorSpacingSize.Large
        }, {
            type: ComponentType.TextDisplay,
            content: `## Birthday Role\nAssign a Role that gets granted to Members when it's their birthday.\n-# Having no Role assigned disables this module.\n\n**Current Status:** No Role assigned.`
        }, {
            type: ComponentType.ActionRow,
            components: [{
                type: ComponentType.Button,
                style: ButtonStyle.Secondary,
                custom_id: `birthdayrole_set`,
                label: `Assign a Role`,
                emoji: { id: "1539923274820231259", name: "RoleAdd" }
            }]
        }, {
            type: ComponentType.Separator,
            divider: true,
            spacing: SeparatorSpacingSize.Large
        }, {
            type: ComponentType.TextDisplay,
            content: `## Birthday Announcements\nConfigure the location of Birthday Announcements.\n-# Having no Channel set disables this module.\n\n**Current Status:** No Channel set.`
        }, {
            type: ComponentType.ActionRow,
            components: [{
                type: ComponentType.Button,
                style: ButtonStyle.Secondary,
                custom_id: `birthdayposts_set-channel`,
                label: `Set a Channel`,
                emoji: { id: "1539925647181479936", name: "AnnouncementAdd" }
            }]
        }]
    }];


    // ACK
    if ( responseType === 'EDIT' ) {
        return new JsonResponse({
            type: InteractionResponseType.UpdateMessage,
            data: {
                components: responseComponents
            }
        });
    }
    else {
        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: responseComponents
            }
        });
    }
    
}




/** Shows the configured main page for the settings panel.
 * 
 * This is used when the Guild has settings saved in the App.
 * 
 * @param {import('discord-api-types/v10').APIChatInputApplicationCommandInteraction} interaction 
 * @param {import('../Utility/utilityConstants').GuildConfigSchema} currentConfigData
 * @param {'NEW'|'EDIT'} responseType Type of Interaction response to use
 */
export function settingsShowConfiguredMainPanel(interaction, currentConfigData, responseType) {
    // Construct strings & buttons for components
    let birthdayRoleString = "";
    /** @type {import('discord-api-types/v10').APIComponentInMessageActionRow[]} */
    let birthdayRoleComponents = [];
    let birthdayAnnouncementsString = "";
    /** @type {import('discord-api-types/v10').APIComponentInMessageActionRow[]} */
    let birthdayAnnouncementsComponents = [];

    // BIRTHDAY ROLE
    if ( currentConfigData.birthday_role_id == null ) {
        birthdayRoleString = `No Role assigned.`;

        birthdayRoleComponents = [{
            type: ComponentType.Button,
            style: ButtonStyle.Secondary,
            custom_id: `birthdayrole_set`,
            label: `Assign a Role`,
            emoji: { id: "1539923274820231259", name: "RoleAdd" }
        }];
    } else {
        birthdayRoleString = `<@&${currentConfigData.birthday_role_id}> assigned as Birthday Role.`;

        birthdayRoleComponents = [{
            type: ComponentType.Button,
            style: ButtonStyle.Secondary,
            custom_id: `birthdayrole_edit_${currentConfigData.birthday_role_id}`,
            label: `Change Role`,
            emoji: { id: "1539965401600106616", name: "RoleEdit" }
        }, {
            type: ComponentType.Button,
            style: ButtonStyle.Danger,
            custom_id: `birthdayrole_remove_${currentConfigData.birthday_role_id}`,
            label: `Remove Role`,
            emoji: { id: "1539963345099034624", name: "RoleRemove" }
        }];
    }

    // BIRTHDAY ANNOUNCEMENTS
    if ( currentConfigData.announcement_channel_id == null ) {
        birthdayAnnouncementsString = `No Channel set.`;

        birthdayAnnouncementsComponents = [{
            type: ComponentType.Button,
            style: ButtonStyle.Secondary,
            custom_id: `birthdayposts_set-channel`,
            label: `Set a Channel`,
            emoji: { id: "1539925647181479936", name: "AnnouncementAdd" }
        }]
    }
    else {
        birthdayAnnouncementsString = `Posts in <#${currentConfigData.announcement_channel_id}>`;

        if ( currentConfigData.announcement_sidebar_color != null ) {
            //birthdayAnnouncementsString += ` with sidebar colour of \`${currentConfigData.announcement_sidebar_color}\``;

            birthdayAnnouncementsComponents = [
                /* {
                    type: ComponentType.Button,
                    style: ButtonStyle.Secondary,
                    custom_id: `birthdayposts_edit-color_${currentConfigData.announcement_sidebar_color}`,
                    label: `Change Sidebar`,
                    emoji: { id: "1539969115220082728", name: "ColourEdit" }
                }, */
                {
                    type: ComponentType.Button,
                    style: ButtonStyle.Secondary,
                    custom_id: `birthdayposts_edit-channel_${currentConfigData.announcement_channel_id}`,
                    label: `Change Channel`,
                    emoji: { id: "1539965398609305660", name: "AnnouncementEdit" }
                },
                /* {
                    type: ComponentType.Button,
                    style: ButtonStyle.Danger,
                    custom_id: `birthdayposts_remove-color_${currentConfigData.announcement_sidebar_color}`,
                    label: `Remove Sidebar`,
                    emoji: { id: "1539969116344160348", name: "ColourRemove" }
                }, */
                {
                    type: ComponentType.Button,
                    style: ButtonStyle.Danger,
                    custom_id: `birthdayposts_remove-channel_${currentConfigData.announcement_channel_id}`,
                    label: `Remove Channel`,
                    emoji: { id: "1539965399721054258", name: "AnnouncementRemove" }
                }
            ];
        }
        else {
            birthdayAnnouncementsComponents = [
                /* {
                    type: ComponentType.Button,
                    style: ButtonStyle.Secondary,
                    custom_id: `birthdayposts_add-color`,
                    label: `Add Sidebar`,
                    emoji: { id: "1539969113982632077", name: "ColourAdd" }
                }, */
                {
                    type: ComponentType.Button,
                    style: ButtonStyle.Secondary,
                    custom_id: `birthdayposts_edit-channel_${currentConfigData.announcement_channel_id}`,
                    label: `Change Channel`,
                    emoji: { id: "1539965398609305660", name: "AnnouncementEdit" }
                },
                {
                    type: ComponentType.Button,
                    style: ButtonStyle.Danger,
                    custom_id: `birthdayposts_remove-channel_${currentConfigData.announcement_channel_id}`,
                    label: `Remove Channel`,
                    emoji: { id: "1539965399721054258", name: "AnnouncementRemove" }
                }
            ];
        }
    }



    // Setup components
    /** @type {import('discord-api-types/v10').APIMessageTopLevelComponent[]} */
    let responseComponents = [{
        type: ComponentType.Container,
        accent_color: rgbArrayToInteger(hexToRgb('#2b68c4')),
        components: [{
            type: ComponentType.TextDisplay,
            content: `# __CakeDay Settings__\nSetup CakeDay's modules with the below options`
        }, {
            type: ComponentType.Separator,
            divider: true,
            spacing: SeparatorSpacingSize.Large
        }, {
            type: ComponentType.TextDisplay,
            content: `## Birthday Role\nAssign a Role that gets granted to Members when it's their birthday.\n-# Having no Role assigned disables this module.\n\n**Current Status:** ${birthdayRoleString}`
        }, {
            type: ComponentType.ActionRow,
            components: birthdayRoleComponents
        }, {
            type: ComponentType.Separator,
            divider: true,
            spacing: SeparatorSpacingSize.Large
        }, {
            type: ComponentType.TextDisplay,
            content: `## Birthday Announcements\nConfigure the location of Birthday Announcements.\n-# Having no Channel set disables this module.\n\n**Current Status:** ${birthdayAnnouncementsString}`
        }, {
            type: ComponentType.ActionRow,
            components: birthdayAnnouncementsComponents
        }]
    }];


    // ACK
    if ( responseType === 'EDIT' ) {
        return new JsonResponse({
            type: InteractionResponseType.UpdateMessage,
            data: {
                components: responseComponents
            }
        });
    }
    else {
        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: responseComponents
            }
        });
    }
    
}
