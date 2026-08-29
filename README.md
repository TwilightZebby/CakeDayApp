# CakeDay

A Discord Server App for announcing birthdays and managing Birthday Roles for your Server Members.

Want to add CakeDay to your Server? Use this [Add App link here](https://discord.com/oauth2/authorize?client_id=1504090747475853523).

---

# Contributing
Want to help localise CakeDay into more languages? Feel free to open a [Pull Request](https://github.com/TwilightZebby/CakeDay/pulls) to do so!
Please remember that only languages supported by Discord (as noted on [their API Documentation here](https://discord.com/developers/docs/reference#locales)) are supported by CakeDay.

If you want to localise the command/interaction responses:
1. Go into the `/Locales/` folder
2. Copy the `en-GB.cjs` file, paste a duplicate within that same folder, and rename it to the language you want to add (using the locale key from the "LOCALE" column on Discord's locale [Documentation table here](https://discord.com/developers/docs/reference#locales) as the file name)
  - *PLEASE remember to keep the `.cjs` file extension! Also, the original/main locale for CakeDay is `en-GB`, hence the request to use that one as the base.*
3. Be sure to also update the `appLocales` constant at the very top of `/Utility/localizeResponses.js` file, to include the new locale you are adding

If you want to localise commands themselves, you can find them in `/Commands/SlashCommands`.
**Please note:** Only localise descriptions for Commands & Command Options. Do **NOT** localise the Command/Option names, as Discord still is a little funky when handling localised Command/Option names.

---

# Features List
## Birthday Role
Assign a Role that gets automatically granted to your Members when it's their Birthday.

## Birthday Announcements
Set a Channel (Text, Announcement, or Thread) where CakeDay will announce your Members' Birthdays in.

---

# Commands List
| Command | Description | Default Permissions |
|---------|-------------|---------------------|
| `/birthday` | Used to set or remove your own birthday in CakeDay | - |
| `/settings` | Manage CakeDay's settings for that Server | Manage Server |

---

# Notes
### Command Permissions in Servers
All of CakeDay's Slash Commands can be restricted to only be used by specific Users/Roles, in specific Channels, or by everyone everywhere in Server Settings > Integerations.

Sadly, though, this Settings Page is only viewable on Desktop and Web Browser versions of Discord, not Mobile App versions.

Furthermore, some of these Commands have default Permission requirements set - meaning that they won't be viewable or usable in the Command Pickers unless you have the relevant Permission (or are Server Owner, or have Admin Permission); unless an override has been set on the Command itself by the Server's Admins/Owner.

---

# Questions

## Do you have a support Server for CakeDay?
> No, I do not. However, I do have a [personal Server](https://discord.gg/EU97z7bhhx) which I *guess* you could use?
> 
> **Though I'd prefer it if you kept any bug reports, support requests, and feature requests for CakeDay to this GitHub page.**
