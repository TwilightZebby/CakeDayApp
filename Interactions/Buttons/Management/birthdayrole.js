import { ButtonStyle, ComponentType, InteractionResponseType, SelectMenuDefaultValueType, SeparatorSpacingSize } from 'discord-api-types/v10';
import { hexToRgb, JsonResponse, rgbArrayToInteger } from '../../../Utility/utilityMethods.js';


export const Button = {
    /** The Button's name - set as the START of the Button's Custom ID, with extra data being separated with a "_" AFTER the name
     * @example "buttonName_extraData"
     * @type {String}
     */
    name: "birthdayrole",

    /** Button's Description, mostly for reminding me what it does!
     * @type {String}
     */
    description: "Manages the Birthday Role module in the Settings command",

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


        if ( InputAction === 'set' ) {
            // Show Role Select for assigning a Role as the new Birthday Role

            responseComponents = [{
                type: ComponentType.Container,
                accent_color: rgbArrayToInteger(hexToRgb('#2b68c4')),
                components: [{
                    type: ComponentType.TextDisplay,
                    content: `# __CakeDay Settings: Add Birthday Role__\nPlease use the Select Menu below to assign a Role as this Server's Birthday Role.\n\n> -# :information_source: Please be sure that your selected Birthday Role is *below* the highest Role CakeDay has on your Server. Otherwise, CakeDay will not be able to grant it to your Members on their birthday!`
                }, {
                    type: ComponentType.ActionRow,
                    components: [{
                        type: ComponentType.RoleSelect,
                        custom_id: `newbirthdayrole`,
                        placeholder: `Select a Role`,
                        min_values: 1,
                        max_values: 1
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
        else if ( InputAction === 'edit' ) {
            // Show pre-filled Role Select for changing which Role is assigned as the Birthday Role
            const InputRoleId = SplitCustomId[2];

            responseComponents = [{
                type: ComponentType.Container,
                accent_color: rgbArrayToInteger(hexToRgb('#2b68c4')),
                components: [{
                    type: ComponentType.TextDisplay,
                    content: `# __CakeDay Settings: Edit Birthday Role__\nPlease use the Select Menu below to change which Role is this Server's Birthday Role.\n**The current Role set as the Birthday Role is <@&${InputRoleId}>**\n\n> -# :information_source: Please be sure that your new selected Birthday Role is *below* the highest Role CakeDay has on your Server. Otherwise, CakeDay will not be able to grant it to your Members on their birthday!`
                }, {
                    type: ComponentType.ActionRow,
                    components: [{
                        type: ComponentType.RoleSelect,
                        custom_id: `editbirthdayrole_${InputRoleId}`,
                        placeholder: `Select a Role`,
                        min_values: 1,
                        max_values: 1,
                        default_values: [ { type: SelectMenuDefaultValueType.Role, id: InputRoleId } ]
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
        else {
            // Show confirmation prompt for clearing the set Birthday Role and disabling this Module in the process
            const InputRoleId = SplitCustomId[2];

            responseComponents = [{
                type: ComponentType.Container,
                accent_color: rgbArrayToInteger(hexToRgb('#2b68c4')),
                components: [{
                    type: ComponentType.TextDisplay,
                    content: `# __CakeDay Settings: Remove Birthday Role__\nAre you sure you want to remove <@&${InputRoleId}> as the assigned Birthday Role from CakeDay in this Server?\n\nDoing so will disable this module and your Members will no longer be granted a Role on their birthday.`
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
                        custom_id: `removebirthdayrole`,
                        label: `Confirm removal`
                    }]
                }]
            }];
        }


        return new JsonResponse({
            type: InteractionResponseType.UpdateMessage,
            data: {
                components: responseComponents
            }
        });
    }
}
