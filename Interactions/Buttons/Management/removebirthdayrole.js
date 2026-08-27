import { InteractionResponseType } from 'discord-api-types/v10';
import { JsonResponse } from '../../../Utility/utilityMethods.js';
import { settingsFetchAndShowMainPanel } from '../../../Modules/guildSettingsModule.js';


export const Button = {
    /** The Button's name - set as the START of the Button's Custom ID, with extra data being separated with a "_" AFTER the name
     * @example "buttonName_extraData"
     * @type {String}
     */
    name: "removebirthdayrole",

    /** Button's Description, mostly for reminding me what it does!
     * @type {String}
     */
    description: "Removes the assigned Birthday Role after being confirmed by the User",

    /** Button's cooldown, in seconds (whole number integers!)
     * @type {Number}
     */
    cooldown: 3,

    /** Runs the Button
     * @param {import('discord-api-types/v10').APIMessageComponentButtonInteraction} interaction 
     * @param {import('discord-api-types/v10').APIUser} interactionUser 
     * @param {*} cfEnv 
     */
    async executeButton(interaction, interactionUser, cfEnv) {
        // Set birthday role value in DB to NULL to remove it
        try {
            const { success } = await cfEnv.DATABASE
                .prepare("UPDATE guildconfig SET birthday_role_id = NULL WHERE guild_id = ?")
                .bind(interaction.guild_id)
                .run();
        
            if ( success ) {
                return await settingsFetchAndShowMainPanel(interaction, 'EDIT', cfEnv);
            }
            else {
                let editComponents = interaction.message.components;
                editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to remove this Server's Birthday Role, please try again in a few moments...`;
        
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
            editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to remove this Server's Birthday Role, please try again in a few moments...`;
        
            return new JsonResponse({
                type: InteractionResponseType.UpdateMessage,
                data: {
                    components: editComponents
                }
            });
        }
    }
}
