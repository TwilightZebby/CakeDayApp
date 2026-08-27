import { settingsFetchAndShowMainPanel } from '../../../Modules/guildSettingsModule.js';


export const Button = {
    /** The Button's name - set as the START of the Button's Custom ID, with extra data being separated with a "_" AFTER the name
     * @example "buttonName_extraData"
     * @type {String}
     */
    name: "settingsreturntomainpage",

    /** Button's Description, mostly for reminding me what it does!
     * @type {String}
     */
    description: "Returns the User back to the main guild settings page",

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
        return await settingsFetchAndShowMainPanel(interaction, 'EDIT', cfEnv);
    }
}
