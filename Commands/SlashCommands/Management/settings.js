import { ApplicationCommandType, InteractionContextType, ApplicationIntegrationType, InteractionResponseType, PermissionFlagsBits } from 'discord-api-types/v10';
import { JsonResponse } from '../../../Utility/utilityMethods.js';
import { settingsShowConfiguredMainPanel, settingsShowDefaultMainPanel } from '../../../Modules/guildSettingsModule.js';


export const SlashCommand = {
    /** Command's Name, in full lowercase (can include hyphens)
     * @type {String}
     */
    name: "settings",

    /** Command's Description
     * @type {String}
     */
    description: "Opens the settings panel for configuring CakeDay in this Server",

    /** Command's Localised Descriptions
     * @type {import('discord-api-types/v10').LocalizationMap}
     */
    localizedDescriptions: {
        'en-GB': 'Opens the settings panel for configuring CakeDay in this Server',
        'en-US': 'Opens the settings panel for configuring CakeDay in this Server'
    },

    /** Command's cooldown, in seconds (whole number integers!)
     * @type {Number}
     */
    cooldown: 5,

    /**
     * Cooldowns for specific Subcommands
     */
    // Where "exampleName" is either the Subcommand's Name, or a combo of both Subcommand Group Name and Subcommand Name
    //  For ease in handling cooldowns, this should also include the root Command name as a prefix
    // In either "rootCommandName_subcommandName" or "rootCommandName_groupName_subcommandName" formats
    subcommandCooldown: {
        "exampleName": 3
    },
    

    /** Get the Command's data in a format able to be registered with via Discord's API
     * @returns {import('discord-api-types/v10').RESTPostAPIApplicationCommandsJSONBody}
     */
    getRegisterData() {
        /** @type {import('discord-api-types/v10').RESTPostAPIApplicationCommandsJSONBody} */
        const CommandData = {};

        CommandData.name = this.name;
        CommandData.description = this.description;
        CommandData.description_localizations = this.localizedDescriptions;
        CommandData.type = ApplicationCommandType.ChatInput;
        // Integration Types - 0 for GUILD_INSTALL, 1 for USER_INSTALL.
        //  MUST include at least one. 
        CommandData.integration_types = [ ApplicationIntegrationType.GuildInstall ];
        // Contexts - 0 for GUILD, 1 for BOT_DM (DMs with the App), 2 for PRIVATE_CHANNEL (DMs/GDMs that don't include the App).
        //  MUST include at least one. PRIVATE_CHANNEL can only be used if integration_types includes USER_INSTALL
        CommandData.contexts = [ InteractionContextType.Guild ];
        // Default permission requirements
        CommandData.default_member_permissions = String(PermissionFlagsBits.ManageGuild);

        return CommandData;
    },

    /** Handles given Autocomplete Interactions, should this Command use Autocomplete Options
     * @param {import('discord-api-types/v10').APIApplicationCommandAutocompleteInteraction} interaction 
     * @param {import('discord-api-types/v10').APIUser} interactionUser 
     */
    async handleAutoComplete(interaction, interactionUser) {
        return new JsonResponse({
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: {
                choices: [ {name: "Not implemented yet!", value: "NOT_IMPLEMENTED"} ]
            }
        });
    },

    /** Runs the Command
     * @param {import('discord-api-types/v10').APIChatInputApplicationCommandInteraction} interaction 
     * @param {import('discord-api-types/v10').APIUser} interactionUser 
     * @param {String} usedCommandName 
     * @param {*} cfEnv 
     */
    async executeCommand(interaction, interactionUser, usedCommandName, cfEnv) {
        // Check for, and fetch if existing, current Guild settings
        const { results } = await cfEnv.DATABASE
            .prepare("SELECT * FROM guildconfig WHERE guild_id = ? LIMIT 1")
            .bind(interaction.guild_id)
            .run();

        
        if ( results == null || results.length === 0 ) {
            return settingsShowDefaultMainPanel(interaction, 'NEW');
        }
        else {
            return settingsShowConfiguredMainPanel(interaction, results.shift(), 'NEW');
        }
    }
}
