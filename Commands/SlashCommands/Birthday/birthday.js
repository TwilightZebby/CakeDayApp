import { ApplicationCommandType, InteractionContextType, ApplicationIntegrationType, MessageFlags, InteractionResponseType, ApplicationCommandOptionType, ComponentType, ButtonStyle } from 'discord-api-types/v10';
import { JsonResponse } from '../../../Utility/utilityMethods.js';


const MonthsWith31Days = [ 0, 2, 4, 6, 7, 9, 11 ];
const MonthsWith30Days = [ 3, 5, 8, 10 ];


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
        // Grab subcommand used
        const InputSubcommand = interaction.data.options.find(item => item.type === ApplicationCommandOptionType.Subcommand);

        // Check to see if User already has a birthday set
        const { results } = await cfEnv.DATABASE
            .prepare("SELECT user_id FROM userbirthdays WHERE user_id = ? LIMIT 1")
            .bind(interactionUser.id)
            .run();

        // SET subcommand was used
        if ( InputSubcommand.name === "set" ) {
            // If User already has a birthday set, reject instantly
            if ( results != null && results.length > 0) {
                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral,
                        content: `You already have a birthday set in CakeDay!\nIf you wish to remove your birthday from this App, use </birthday remove:${interaction.data.id}>`
                    }
                });
            }

            // User doesn't have a birthday set, so try to add it
            //   (While also validating "day" input argument against the inputted "month")
            
            /** @type import("discord-api-types/v10").APIApplicationCommandInteractionDataStringOption */
            const InputMonth = InputSubcommand.options.find(item => item.name === "month");
            const IntInputMonth = parseInt(InputMonth.value);

            /** @type import("discord-api-types/v10").APIApplicationCommandInteractionDataIntegerOption */
            const InputDay = InputSubcommand.options.find(item => item.name === "day");

            if ( MonthsWith30Days.includes(IntInputMonth) && InputDay.value === 31 ) {
                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral,
                        content: `Sorry, but that wasn't a valid date! (For April/June/September/November, it must be between 1 and 30, inclusive)`
                    }
                });
            }
            else if ( IntInputMonth === 1 && InputDay.value > 29 ) {
                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral,
                        content: `Sorry, but that wasn't a valid date! (For February, it must be between 1 and 29, inclusive)`
                    }
                });
            }
            else if ( IntInputMonth === 1 && InputDay.value === 29 ) {
                /** @type {import("discord-api-types/v10").APIMessageTopLevelComponent[]} */
                let responseComponents = [{
                    type: ComponentType.TextDisplay,
                    content: `You are about to set your birthday as 29th February, a date that can only exist during Leap Years.\nAs such, CakeDay will treat 28th February as your birthday on other (non-leap) years.\n\nPlease confirm using the button below if this is suitable for you. If not, you can delete/dismiss this message and your birthday will *NOT* be saved.`
                }, {
                    type: ComponentType.ActionRow,
                    components: [{
                        type: ComponentType.Button,
                        style: ButtonStyle.Primary,
                        custom_id: `feb29_${interactionUser.id}_${IntInputMonth}_${InputDay.value}`,
                        label: `Confirm`
                    }]
                }];

                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                        components: responseComponents
                    }
                });
            }
            else {
                try {
                    const { success } = await cfEnv.DATABASE
                        .prepare("INSERT INTO userbirthdays ('user_id', 'month_of_birth', 'day_of_birth') VALUES (?, ?, ?)")
                        .bind(interactionUser.id, IntInputMonth, InputDay.value)
                        .run();

                    if ( success === false ) {
                        return new JsonResponse({
                            type: InteractionResponseType.ChannelMessageWithSource,
                            data: {
                                flags: MessageFlags.Ephemeral,
                                content: `Sorry, but something went wrong while trying to save your newly added birthday. Please try again later...`
                            }
                        });
                    }
                    else {
                        return new JsonResponse({
                            type: InteractionResponseType.ChannelMessageWithSource,
                            data: {
                                flags: MessageFlags.Ephemeral,
                                content: `Successfully added your birthday to CakeDay!`
                            }
                        });
                    }
                }
                catch (err) {
                    return new JsonResponse({
                        type: InteractionResponseType.ChannelMessageWithSource,
                        data: {
                            flags: MessageFlags.Ephemeral,
                            content: `Sorry, but something went wrong while trying to save your newly added birthday. Please try again later...`
                        }
                    });
                }
            }
        }
        // REMOVE subcommand was used
        else if ( InputSubcommand.name === "remove" ) {
            // Check to make sure User *HAS* a saved birthday to remove
            if ( results != null && results.length === 0) {
                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral,
                        content: `You do not have a birthday saved in CakeDay.\nIf you wish to add your birthday to this App, use </birthday set:${interaction.data.id}>`
                    }
                });
            }

            // Attempt to remove birthday
            try {
                const { success } = await cfEnv.DATABASE
                    .prepare("DELETE FROM userbirthdays WHERE user_id = ?")
                    .bind(interactionUser.id)
                    .run();

                if ( success === false ) {
                    return new JsonResponse({
                        type: InteractionResponseType.ChannelMessageWithSource,
                        data: {
                            flags: MessageFlags.Ephemeral,
                            content: `Sorry, but something went wrong while trying to remove your birthday from CakeDay. Please try again later...`
                        }
                    });
                }
                else {
                    return new JsonResponse({
                        type: InteractionResponseType.ChannelMessageWithSource,
                        data: {
                            flags: MessageFlags.Ephemeral,
                            content: `Successfully removed your birthday from CakeDay`
                        }
                    });
                }
            }
            catch (err) {
                return new JsonResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        flags: MessageFlags.Ephemeral,
                        content: `Sorry, but something went wrong while trying to remove your birthday from CakeDay. Please try again later...`
                    }
                });
            }
        }

        return new JsonResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                flags: MessageFlags.Ephemeral,
                content: "Something went badly wrong. If you see this error, please let CakeDay's developer know by either:\n- Opening an [Issue on GitHub](<https://github.com/TwilightZebby/CakeDayApp/issues/new/choose>)\n- Or via letting `@twilightzebby` know on Discord (if you're in a mutual Server with him)"
            }
        });
    }
}
