import { ComponentType, InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { JsonResponse } from '../../Utility/utilityMethods.js';


export const Button = {
    /** The Button's name - set as the START of the Button's Custom ID, with extra data being separated with a "_" AFTER the name
     * @example "buttonName_extraData"
     * @type {String}
     */
    name: "feb29",

    /** Button's Description, mostly for reminding me what it does!
     * @type {String}
     */
    description: "Confirmation button for birthdays on 29th February",

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
        const SplitCustomId = interaction.data.custom_id.split("_");
        const InputUserId = SplitCustomId[1];
        const InputMonth = parseInt(SplitCustomId[2]);
        const InputDay = parseInt(SplitCustomId[3]);

        /** @type {import("discord-api-types/v10").APIMessageTopLevelComponent[]} */
        let successComponents = [{
            type: ComponentType.TextDisplay,
            content: `Successfully added your birthday to CakeDay!`
        }];

        /** @type {import("discord-api-types/v10").APIMessageTopLevelComponent[]} */
        let failureComponents = [{
            type: ComponentType.TextDisplay,
            content: `Sorry, but something went wrong while trying to save your newly added birthday. Please try again later...`
        }];

        try {
            const { success } = await cfEnv.DATABASE
                .prepare("INSERT INTO userbirthdays ('user_id', 'month_of_birth', 'day_of_birth') VALUES (?, ?, ?)")
                .bind(InputUserId, InputMonth, InputDay)
                .run();
        
            if ( success === false ) {
                return new JsonResponse({
                    type: InteractionResponseType.UpdateMessage,
                    data: {
                        components: failureComponents
                    }
                });
            }
            else {
                return new JsonResponse({
                    type: InteractionResponseType.UpdateMessage,
                    data: {
                        components: successComponents
                    }
                });
            }
        }
        catch (err) {
            return new JsonResponse({
                type: InteractionResponseType.UpdateMessage,
                data: {
                    components: failureComponents
                }
            });
        }
    }
}
