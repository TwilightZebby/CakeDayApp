import { ButtonStyle, ChannelType, ComponentType, InteractionResponseType, SelectMenuDefaultValueType, SeparatorSpacingSize } from 'discord-api-types/v10';
import { hexToRgb, JsonResponse, rgbArrayToInteger } from '../../../Utility/utilityMethods.js';


export const Button = {
    /** The Button's name - set as the START of the Button's Custom ID, with extra data being separated with a "_" AFTER the name
     * @example "buttonName_extraData"
     * @type {String}
     */
    name: "birthdayposts",

    /** Button's Description, mostly for reminding me what it does!
     * @type {String}
     */
    description: "Manages the Birthday Announcements module in the Settings command",

    /** Button's cooldown, in seconds (whole number integers!)
     * @type {Number}
     */
    cooldown: 5,

    /** Runs the Button
     * @param {import('discord-api-types/v10').APIMessageComponentButtonInteraction} interaction 
     * @param {import('discord-api-types/v10').APIUser} interactionUser 
     * @param {*} cfEnv 
     */
    async executeButton(interaction, interactionUser, cfEnv) {
        const SplitCustomId = interaction.data.custom_id.split("_");
        /** @type {'set'|'edit'|'remove'} */
        const InputAction = SplitCustomId[1];

        /** @type {import("discord-api-types/v10").APIMessageTopLevelComponent[]} */
        let responseComponents = [];


        if ( InputAction === 'set-channel' ) {
            // Sets which Text-based Channel to post Birthday Announcements in

            responseComponents = [{
                type: ComponentType.Container,
                accent_color: rgbArrayToInteger(hexToRgb('#2b68c4')),
                components: [{
                    type: ComponentType.TextDisplay,
                    content: `# __CakeDay Settings: Set Announcement Channel__\nPlease use the Select Menu below to set which Channel CakeDay should post your Members' Birthday Announcements in.\n\n> -# :information_source: Please be sure that CakeDay has *both* "**View Channel**" and "**Send Messages**" Permissions at minimum in the Channel you select.`
                }, {
                    type: ComponentType.ActionRow,
                    components: [{
                        type: ComponentType.ChannelSelect,
                        custom_id: `newbirthdaychannel`,
                        placeholder: `Search for a Channel`,
                        min_values: 1,
                        max_values: 1,
                        channel_types: [ ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.PublicThread ]
                    }]
                }, {
                    type: ComponentType.Separator,
                    divider: true,
                    spacing: SeparatorSpacingSize.Large
                }, {
                    type: ComponentType.ActionRow,
                    components: [{
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: `settingsreturntomainpage`,
                        label: `Cancel`
                    }]
                }]
            }];
        }
        else if ( InputAction === 'edit-channel' ) {
            // Edits which Channel CakeDay should post Birthday Announcements in
            const InputChannelId = SplitCustomId[2];

            responseComponents = [{
                type: ComponentType.Container,
                accent_color: rgbArrayToInteger(hexToRgb('#2b68c4')),
                components: [{
                    type: ComponentType.TextDisplay,
                    content: `# __CakeDay Settings: Edit Announcement Channel__\nPlease use the Select Menu below to change the Channel CakeDay posts your Members' Birthday Announcements in.\n**This Server's current Birthday Announcement Channel is <#${InputChannelId}>**\n\n> -# :information_source: Please be sure that CakeDay has *both* "**View Channel**" and "**Send Messages**" Permissions at minimum in the new Channel you select.`
                }, {
                    type: ComponentType.ActionRow,
                    components: [{
                        type: ComponentType.ChannelSelect,
                        custom_id: `editbirthdaychannel_${InputChannelId}`,
                        placeholder: `Search for a Channel`,
                        min_values: 1,
                        max_values: 1,
                        channel_types: [ ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.PublicThread ],
                        default_values: [ { type: SelectMenuDefaultValueType.Channel, id: InputChannelId } ]
                    }]
                }, {
                    type: ComponentType.Separator,
                    divider: true,
                    spacing: SeparatorSpacingSize.Large
                }, {
                    type: ComponentType.ActionRow,
                    components: [{
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: `settingsreturntomainpage`,
                        label: `Cancel`
                    }]
                }]
            }];
        }
        else if ( InputAction === 'remove-channel' ) {
            // Removes the set Announcement Channel from CakeDay, and disables this module
            const InputChannelId = SplitCustomId[2];

            responseComponents = [{
                type: ComponentType.Container,
                accent_color: rgbArrayToInteger(hexToRgb('#2b68c4')),
                components: [{
                    type: ComponentType.TextDisplay,
                    content: `# __CakeDay Settings: Remove Announcement Channel__\nAre you sure you want to remove <#${InputChannelId}> as this Server's Birthday Announcements Channel?\n\nDoing so will disable this module and prevent CakeDay from posting about your Members' birthdays in this Server.`
                }, {
                    type: ComponentType.ActionRow,
                    components: [{
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: `settingsreturntomainpage`,
                        label: `Cancel`
                    }, {
                        type: ComponentType.Button,
                        style: ButtonStyle.Danger,
                        custom_id: `removebirthdaychannel`,
                        label: `Confirm removal`
                    }]
                }]
            }];
        }
        else if ( InputAction === 'add-color' ) {
            // TODO: Sets a sidebar colour for posted Announcements
        }
        else if ( InputAction === 'edit-color' ) {
            // TODO: Edits the set sidebar colour for posted Announcements
            const InputHexColor = SplitCustomId[2];
        }
        else {
            // TODO: Removes the sidebar from posted Announcements
            const InputHexColor = SplitCustomId[2];
        }


        return new JsonResponse({
            type: InteractionResponseType.UpdateMessage,
            data: {
                components: responseComponents
            }
        });
    }
}
