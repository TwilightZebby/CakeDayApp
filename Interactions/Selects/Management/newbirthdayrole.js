import { InteractionResponseType } from 'discord-api-types/v10';
import { JsonResponse } from '../../../Utility/utilityMethods.js';
import { settingsFetchAndShowMainPanel } from '../../../Modules/guildSettingsModule.js';


export const Select = {
    /** The Select's name - set as the START of the Button's Custom ID, with extra data being separated with a "_" AFTER the name
     * @example "selectName_extraData"
     * @type {String}
     */
    name: "newbirthdayrole",

    /** Select's Description, mostly for reminding me what it does!
     * @type {String}
     */
    description: "Assigns the selected Role as the new Birthay Role",

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

        // Check for existing entry in DB
        const { results } = await cfEnv.DATABASE
            .prepare("SELECT * FROM guildconfig WHERE guild_id = ? LIMIT 1")
            .bind(interaction.guild_id)
            .run();
    
        if ( results == null || results.length === 0 ) {
            // Add to DB
            try {
                const { success } = await cfEnv.DATABASE
                    .prepare("INSERT INTO guildconfig ('guild_id', 'birthday_role_id') VALUES (?, ?)")
                    .bind(interaction.guild_id, InputRoleId)
                    .run();

                if ( success ) {
                    return await settingsFetchAndShowMainPanel(interaction, 'EDIT', cfEnv);
                }
                else {
                    let editComponents = interaction.message.components;
                    editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to assign your new Birthday Role, please try again in a few moments...`;

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
                editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to assign your new Birthday Role, please try again in a few moments...`;

                return new JsonResponse({
                    type: InteractionResponseType.UpdateMessage,
                    data: {
                        components: editComponents
                    }
                });
            }
        }
        else {
            // Add to DB
            try {
                const { success } = await cfEnv.DATABASE
                    .prepare("UPDATE guildconfig SET birthday_role_id = ?2 WHERE guild_id = ?1")
                    .bind(interaction.guild_id, InputRoleId)
                    .run();

                if ( success ) {
                    return await settingsFetchAndShowMainPanel(interaction, 'EDIT', cfEnv);
                }
                else {
                    let editComponents = interaction.message.components;
                    editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to assign your new Birthday Role, please try again in a few moments...`;

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
                editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to assign your new Birthday Role, please try again in a few moments...`;

                return new JsonResponse({
                    type: InteractionResponseType.UpdateMessage,
                    data: {
                        components: editComponents
                    }
                });
            }
        }
    }
}
