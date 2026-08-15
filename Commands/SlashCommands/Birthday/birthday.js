import { ApplicationCommandType, InteractionContextType, ApplicationIntegrationType, MessageFlags, InteractionResponseType, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { JsonResponse } from '../../../Utility/utilityMethods.js';


export const SlashCommand = {
    /** Command's Name, in full lowercase (can include hyphens)
     * @type {String}
     */
    name: "birthday",

    /** Command's Description
     * @type {String}
     */
    description: "Set or remove your birthday",

    /** Command's Localised Descriptions
     * @type {import('discord-api-types/v10').LocalizationMap}
     */
    localizedDescriptions: {
        'en-GB': 'Set or remove your birthday',
        'en-US': 'Set or remove your birthday'
    },

    /** Command's cooldown, in seconds (whole number integers!)
     * @type {Number}
     */
    cooldown: 10,

    /**
     * Cooldowns for specific Subcommands
     */
    // Where "exampleName" is either the Subcommand's Name, or a combo of both Subcommand Group Name and Subcommand Name
    //  For ease in handling cooldowns, this should also include the root Command name as a prefix
    // In either "rootCommandName_subcommandName" or "rootCommandName_groupName_subcommandName" formats
    subcommandCooldown: {
        "birthday_set": 10,
        "birthday_remove": 8
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
        // Command Options
        CommandData.options = [{
            type: ApplicationCommandOptionType.Subcommand,
            name: "set",
            description: "Set the day and month your birthday is on, so you can receive the birthday Role!",
            description_localizations: {
                'en-GB': "Set the day and month your birthday is on, so you can receive the birthday Role!",
                'en-US': "Set the month and day your birthday is on, so you can receive the birthday Role!"
            },
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "month",
                description: "The month your birthday is in",
                description_localizations: {
                    'en-GB': "The month your birthday is in",
                    'en-US': "The month your birthday is in"
                },
                required: true,
                choices: [
                    { name: "January", value: "0" },
                    { name: "February", value: "1" },
                    { name: "March", value: "2" },
                    { name: "April", value: "3" },
                    { name: "May", value: "4" },
                    { name: "June", value: "5" },
                    { name: "July", value: "6" },
                    { name: "August", value: "7" },
                    { name: "September", value: "8" },
                    { name: "October", value: "9" },
                    { name: "November", value: "10" },
                    { name: "December", value: "11" }
                ]
            }, {
                type: ApplicationCommandOptionType.Integer,
                name: "day",
                description: "The day of the month your birthday is on (eg: the 17th would be submitted as '17' here)",
                description_localizations: {
                    'en-GB': "The day of the month your birthday is on (eg: the 17th would be submitted as '17' here)",
                    'en-US': "The day of the month your birthday is on (eg: the 17th would be submitted as '17' here)"
                },
                required: true,
                min_value: 1,
                max_value: 31
                // Can't use pre-set choices here, due to Discord only allowing up to 25 choices per option, and all months have more than 25 days in them!
            }, /* {
                type: ApplicationCommandOptionType.String,
                name: "timezone",
                description: "Your main timezone. Used to give announce your birthday on your midnight instead of using UTC+00",
                description_localizations: {
                    'en-GB': "Your main timezone. Used to give announce your birthday on your midnight instead of using UTC+00",
                    'en-US': "Your main timezone. Used to give announce your birthday on your midnight instead of using UTC+00"
                },
                required: false,
                autocomplete: true
            } */]
        }, {
            type: ApplicationCommandOptionType.Subcommand,
            name: "remove",
            description: "Remove your saved birthday from CakeDay, stopping you from receiving the birthday Role",
            description_localizations: {
                'en-GB': "Remove your saved birthday from CakeDay, stopping you from receiving the birthday Role",
                'en-US': "Remove your saved birthday from CakeDay, stopping you from receiving the birthday Role"
            }
        }];

        return CommandData;
    },

    /** Handles given Autocomplete Interactions, should this Command use Autocomplete Options
     * @param {import('discord-api-types/v10').APIApplicationCommandAutocompleteInteraction} interaction 
     * @param {import('discord-api-types/v10').APIUser} interactionUser 
     */
    async handleAutoComplete(interaction, interactionUser) {
        // Would add timezone support, but I can't seem to get `Temporal` to load or be enabled in NodeJS on my machine :c
        //   Yes, I did download Rust too just in case (apparently Temporal in NodeJS is built using Rust). Still doesn't work.

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

        console.log(Temporal.Now.plainDateTimeISO());
        
        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: "This Command has not yet been implemented yet!"
            }
        });
    }
}
