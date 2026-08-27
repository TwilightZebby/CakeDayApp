import { InteractionResponseType } from 'discord-api-types/v10';
import { JsonResponse } from '../../../Utility/utilityMethods.js';
import { settingsFetchAndShowMainPanel } from '../../../Modules/guildSettingsModule.js';


export const Select = {
    /** The Select's name - set as the START of the Button's Custom ID, with extra data being separated with a "_" AFTER the name
     * @example "selectName_extraData"
     * @type {String}
     */
    name: "editbirthdayrole",

    /** Select's Description, mostly for reminding me what it does!
     * @type {String}
     */
    description: "Changes the selected Birthday Role",

    /** Select's cooldown, in seconds (whole number integers!)
     * @type {Number}
     */
    cooldown: 3,

    /** Runs the Select
     * @param {import('discord-api-types/v10').APIMessageComponentSelectMenuInteraction} interaction 
     * @param {import('discord-api-types/v10').APIUser} interactionUser 
     * @param {*} cfEnv 
     */
    async executeSelect(interaction, interactionUser, cfEnv) {
        // Grab input
        const InputRoleId = interaction.data.values.shift();
        const SplitCustomId = interaction.data.custom_id.split("_");
        const OriginalRoleId = SplitCustomId[1];

        // Don't do anything to DB if selected Role is the same as existing Role
        if ( InputRoleId === OriginalRoleId ) {
            return await settingsFetchAndShowMainPanel(interaction, 'EDIT', cfEnv);
        }


        // Update in DB
        try {
            const { success } = await cfEnv.DATABASE
                .prepare("UPDATE guildconfig SET birthday_role_id = ? WHERE guild_id = ?")
                .bind(InputRoleId, interaction.guild_id)
                .run();

            if ( success ) {
                return await settingsFetchAndShowMainPanel(interaction, 'EDIT', cfEnv);
            }
            else {
                let editComponents = interaction.message.components;
                editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to update this Server's Birthday Role, please try again in a few moments...`;

                return new JsonResponse({
                    type: InteractionResponseType.UpdateMessage,
                    data: {
                        components: editComponents
                    }
                });
            }
        }
        catch (err) {
            console.error(err);

            let editComponents = interaction.message.components;
            editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to update this Server's Birthday Role, please try again in a few moments...`;

            return new JsonResponse({
                type: InteractionResponseType.UpdateMessage,
                data: {
                    components: editComponents
                }
            });
        }
    }
}
