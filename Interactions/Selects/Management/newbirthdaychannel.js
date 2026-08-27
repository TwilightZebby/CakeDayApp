import { ChannelType, InteractionResponseType, PermissionFlagsBits } from 'discord-api-types/v10';
import { JsonResponse } from '../../../Utility/utilityMethods.js';
import { settingsFetchAndShowMainPanel } from '../../../Modules/guildSettingsModule.js';


export const Select = {
    /** The Select's name - set as the START of the Button's Custom ID, with extra data being separated with a "_" AFTER the name
     * @example "selectName_extraData"
     * @type {String}
     */
    name: "newbirthdaychannel",

    /** Select's Description, mostly for reminding me what it does!
     * @type {String}
     */
    description: "Assigns the selected Channel as the new Announcement Channel",

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
        const InputChannelId = interaction.data.values.shift();
        /** @type {import('discord-api-types/v10').APIInteractionDataResolvedChannel} */
        const ResolvedInputChannel = interaction.data.resolved.channels[InputChannelId];

        // Validate CakeDay *does* have the needed permissions to send messages in that Channel
        let appPermsInChannel = BigInt(ResolvedInputChannel.app_permissions);

        if ( ((appPermsInChannel & PermissionFlagsBits.ViewChannel) == PermissionFlagsBits.ViewChannel) === false ) {
            let editComponents = interaction.message.components;
            editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: CakeDay does *not* have "**View Channel**" Permission in <#${InputChannelId}>!\nPlease select a different Channel, or try again after granting CakeDay "**View Channel**" Permission in that Channel.`;

            return new JsonResponse({
                type: InteractionResponseType.UpdateMessage,
                data: {
                    components: editComponents
                }
            });
        }

        if ( ResolvedInputChannel.type !== ChannelType.PublicThread && ((appPermsInChannel & PermissionFlagsBits.SendMessages) == PermissionFlagsBits.SendMessages) === false ) {
            let editComponents = interaction.message.components;
            editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: CakeDay does *not* have "**Send Messages**" Permission in <#${InputChannelId}>!\nPlease select a different Channel, or try again after granting CakeDay "**Send Messages**" Permission in that Channel.`;

            return new JsonResponse({
                type: InteractionResponseType.UpdateMessage,
                data: {
                    components: editComponents
                }
            });
        }
        else if ( ResolvedInputChannel.type === ChannelType.PublicThread && ((appPermsInChannel & PermissionFlagsBits.SendMessages) == PermissionFlagsBits.SendMessages) === false ) {
            let editComponents = interaction.message.components;
            editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: CakeDay does *not* have "**Send Messages in Threads**" Permission in <#${InputChannelId}>!\nPlease select a different Thread or Channel, or try again after granting CakeDay "**Send Messages in Threads**" Permission in that Thread.`;

            return new JsonResponse({
                type: InteractionResponseType.UpdateMessage,
                data: {
                    components: editComponents
                }
            });
        }



        // Check for existing entry in DB
        const { results } = await cfEnv.DATABASE
            .prepare("SELECT * FROM guildconfig WHERE guild_id = ? LIMIT 1")
            .bind(interaction.guild_id)
            .run();
    
        if ( results == null || results.length === 0 ) {
            // Add to DB
            try {
                const { success } = await cfEnv.DATABASE
                    .prepare("INSERT INTO guildconfig ('guild_id', 'announcement_channel_id') VALUES (?, ?)")
                    .bind(interaction.guild_id, InputChannelId)
                    .run();

                if ( success ) {
                    return await settingsFetchAndShowMainPanel(interaction, 'EDIT', cfEnv);
                }
                else {
                    let editComponents = interaction.message.components;
                    editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to set <#${InputChannelId}> as this Server's Birthday Announcement Channel, please try again in a few moments...`;

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
                editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to set <#${InputChannelId}> as this Server's Birthday Announcement Channel, please try again in a few moments...`;

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
                    .prepare("UPDATE guildconfig SET announcement_channel_id = ?2 WHERE guild_id = ?1")
                    .bind(interaction.guild_id, InputChannelId)
                    .run();

                if ( success ) {
                    return await settingsFetchAndShowMainPanel(interaction, 'EDIT', cfEnv);
                }
                else {
                    let editComponents = interaction.message.components;
                    editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to set <#${InputChannelId}> as this Server's Birthday Announcement Channel, please try again in a few moments...`;

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
                editComponents[0].components[0].content = `${editComponents[0].components[0].content}\n\n:warning: An error occurred while trying to set <#${InputChannelId}> as this Server's Birthday Announcement Channel, please try again in a few moments...`;

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
