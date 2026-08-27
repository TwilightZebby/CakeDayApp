export const SlashCommands = {
    'birthday': () => import('../Commands/SlashCommands/Birthday/birthday.js'),
    'settings': () => import('../Commands/SlashCommands/Management/settings.js'),
}

export const ContextCommands = {
    //.
}

export const Autocompletes = {
    //.
}

export const Buttons = {
    'feb29': () => import('../Interactions/Buttons/feb29.js'),

    'settingsreturntomainpage': () => import('../Interactions/Buttons/Management/settingsreturntomainpage.js'),
    'birthdayrole': () => import('../Interactions/Buttons/Management/birthdayrole.js'),
    'removebirthdayrole': () => import('../Interactions/Buttons/Management/removebirthdayrole.js'),
    'birthdayposts': () => import('../Interactions/Buttons/Management/birthdayposts.js'),
    'removebirthdaychannel': () => import('../Interactions/Buttons/Management/removebirthdaychannel.js'),
}

export const Selects = {
    'newbirthdayrole': () => import('../Interactions/Selects/Management/newbirthdayrole.js'),
    'editbirthdayrole': () => import('../Interactions/Selects/Management/editbirthdayrole.js'),
    'newbirthdaychannel': () => import('../Interactions/Selects/Management/newbirthdaychannel.js'),
    'editbirthdaychannel': () => import('../Interactions/Selects/Management/editbirthdaychannel.js'),
}

export const Modals = {
    //.
}
