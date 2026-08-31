module.exports = {

    // ******* GENERIC STUFF
    DELETE: `Delete`,
    CANCEL: `Cancel`,
    CONFIRM: `Confirm`,

    ERROR_GENERIC: `An error has occurred.`,
    ERROR_GENERIC_WITH_PREVIEW: `An error has occurred. A preview of the raw error is as follows:\n\`\`\`{{0}}\`\`\``,
    ERROR_GENERIC_THIS_SHOULD_NOT_APPEAR: `Something went badly wrong. If you see this error, please let TwilightZebby know by either:\n- \`@ping\`ing or DMing him on Discord\n- OR by opening an [Issue on his GitHub](<https://github.com/TwilightZebby/CakeDayApp/issues/new/choose>)`,



    // ******* GENERIC SLASH COMMAND STUFF
    SLASH_COMMAND_ERROR_GENERIC: `Sorry, but there was a problem trying to run this Slash Command...`,

    SLASH_COMMAND_ERROR_COOLDOWN_SECONDS: `Please wait {{0}} more seconds before using this Slash Command again.`,
    SLASH_COMMAND_ERROR_COOLDOWN_MINUTES: `Please wait {{0}} more minutes before using this Slash Command again.`,
    SLASH_COMMAND_ERROR_COOLDOWN_HOURS: `Please wait {{0}} more hours before using this Slash Command again.`,
    SLASH_COMMAND_ERROR_COOLDOWN_DAYS: `Please wait {{0}} more days before using this Slash Command again.`,
    SLASH_COMMAND_ERROR_COOLDOWN_MONTHS: `Please wait {{0}} more months before using this Slash Command again.`,



    // ******* GENERIC CONTEXT COMMAND STUFF
    CONTEXT_COMMAND_ERROR_GENERIC: `Sorry, an error occurred while trying to run this Context Command...`,
    CONTEXT_COMMAND_ERROR_SYSTEM_AND_BOT_MESSAGES_UNSUPPORTED: `Sorry, but this Context Command cannot be used on a System or Bot Message.`,
    CONTEXT_COMMAND_ERROR_MISSING_CONTENT: `Sorry, but that Message doesn't have any content! (Attachments aren't checked by this Context Command).`,

    CONTEXT_COMMAND_ERROR_COOLDOWN_SECONDS: `Please wait {{0}} more seconds before using this Context Command again.`,
    CONTEXT_COMMAND_ERROR_COOLDOWN_MINUTES: `Please wait {{0}} more minutes before using this Context Command again.`,
    CONTEXT_COMMAND_ERROR_COOLDOWN_HOURS: `Please wait {{0}} more hours before using this Context Command again.`,
    CONTEXT_COMMAND_ERROR_COOLDOWN_DAYS: `Please wait {{0}} more days before using this Context Command again.`,
    CONTEXT_COMMAND_ERROR_COOLDOWN_MONTHS: `Please wait {{0}} more months before using this Context Command again.`,



    // ******* GENERIC BUTTON STUFF
    BUTTON_ERROR_GENERIC: `An error occurred while trying to process that Button press...`,

    BUTTON_ERROR_COOLDOWN_SECONDS: `Please wait {{0}} more seconds before using this Button again.`,
    BUTTON_ERROR_COOLDOWN_MINUTES: `Please wait {{0}} more minutes before using this Button again.`,
    BUTTON_ERROR_COOLDOWN_HOURS: `Please wait {{0}} more hours before using this Button again.`,
    BUTTON_ERROR_COOLDOWN_DAYS: `Please wait {{0}} more days before using this Button again.`,
    BUTTON_ERROR_COOLDOWN_MONTHS: `Please wait {{0}} more months before using this Button again.`,



    // ******* GENERIC SELECT MENU STUFF
    SELECT_ERROR_GENERIC: `An error occurred while trying to process that Select Menu choice...`,

    SELECT_ERROR_COOLDOWN_SECONDS: `Please wait {{0}} more seconds before using this Select Menu again.`,
    SELECT_ERROR_COOLDOWN_MINUTES: `Please wait {{0}} more minutes before using this Select Menu again.`,
    SELECT_ERROR_COOLDOWN_HOURS: `Please wait {{0}} more hours before using this Select Menu again.`,
    SELECT_ERROR_COOLDOWN_DAYS: `Please wait {{0}} more days before using this Select Menu again.`,
    SELECT_ERROR_COOLDOWN_MONTHS: `Please wait {{0}} more months before using this Select Menu again.`,



    // ******* GENERIC MODAL STUFF
    MODAL_ERROR_GENERIC: `An error occurred while trying to process that Modal submission...`,



    // ******* GENERIC AUTOCOMPLETE STUFF
    AUTOCOMPLETE_ERROR_GENERIC: `Error: Unable to process.`,



    // ******* BIRTHDAY COMMAND
    BIRTHDAY_COMMAND_SET_FEBRUARY_CONFIRMATION: `You are about to set your birthday as 29th February, a date that can only exist during Leap Years.\nAs such, CakeDay will treat 28th February as your birthday on other (non-leap) years.\n\nPlease confirm using the button below if this is suitable for you. If not, you can delete/dismiss this message and your birthday will *NOT* be saved.`,
    BIRTHDAY_COMMAND_SET_SUCCESSFUL: `Successfully added your birthday to CakeDay!`,

    BIRTHDAY_COMMAND_SET_ERROR_GENERIC: `Sorry, but something went wrong while trying to save your newly added birthday. Please try again later...`,
    BIRTHDAY_COMMAND_SET_ERROR_BIRTHDAY_ALREADY_SET: `You already have a birthday set in CakeDay!\nIf you wish to remove your birthday from this App, use {{0}}`,
    BIRTHDAY_COMMAND_SET_ERROR_MONTH_ONLY_HAS_30_DAYS: `Sorry, but that wasn't a valid date! (For April/June/September/November, it must be between 1 and 30, inclusive)`,
    BIRTHDAY_COMMAND_SET_ERROR_FEBRUARY_ONLY_HAS_29_DAYS_MAXIMUM: `Sorry, but that wasn't a valid date! (For February, it must be between 1 and 29, inclusive)`,

    BIRTHDAY_COMMAND_REMOVE_SUCCESSFUL: `Successfully removed your birthday from CakeDay.`,

    BIRTHDAY_COMMAND_REMOVE_ERROR_GENERIC: `Sorry, but something went wrong while trying to remove your birthday from CakeDay. Please try again later...`,
    BIRTHDAY_COMMAND_REMOVE_ERROR_NO_BIRTHDAY_STORED: `You do not have a birthday save in CakeDay.\nIf you wish to add your birthday to this App, use {{0}}`,
}
