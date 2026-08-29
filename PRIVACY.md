# CakeDay - Privacy Policy
Last Updated: 29th August 2026

Effective: 29th August 2026

---

## Introduction
**CakeDay** does __not__, and will __never__, collect & store Messages, User Data, or Server Data without explicit notice & consent.
Additionally, **CakeDay** will __never__ sell or give away the Data that it does store.

The developers of **CakeDay** firmly believes in a "we don't want your data keep it away from us" process - thus, **CakeDay** will be developed as "stateless" as possible (i.e: without needing to store any information or data at all). If features and functions are not possible to develop "stateless", we will explicitly include them in this **Privacy Policy**, covering exactly what is needed to be stored, for what purpose, and how that data can be removed from **CakeDay** on request.

**CakeDay**'s source code is viewable in **CakeDay**'s GitHub Repo ( https://github.com/TwilightZebby/CakeDay ).

---

## Data Collection & Purposes
TwiLite currently does *not* collect or store *any* data or information from any Users or Servers that use or interact with CakeDay, apart from what is listed below.

### Logging
**CakeDay** will log when it has been added (otherwise referred to as "authorized") or removed (or "deauthorized") as a Server App to a Discord Server.

The only information included in this log are:
- **When added as a Server App:**
  - Which User added **CakeDay** to a Server (specifically, the User's display/user name, and ID)
  - Which Server **CakeDay** was added to (specifically, the Server's name & ID)
  - and which Scopes **CakeDay** was authorized with (commonly `application.commands` for its Slash Commands, and `bot` for its Bot User)

This is purely for informational purposes (such as tracking the App's growth), and this information will NOT be given or sold to anyone else.

### User Birthdays
In order to provide its core functionality, Members of Servers with **CakeDay** added will be able to use **CakeDay**'s Commands to *manually* input the day and month of their own birthday via use of the **`/birthday set`** Slash Command. Birth year is *never* asked for by **CakeDay**.

This information is stored securely, and is only used for providing the core functionality of posting birthday announcements and granting Server Roles to Server Members on their birthdays.

Should a Server Member want to have their birth day/month removed from **CakeDay**, they can do so via use of the **`/birthday remove`** Slash Command.

### Server Settings
In other to provide its core functionality, Admins of Servers with **CakeDay** added may *optionally* and *manually* input the IDs of Roles or Channels in the Server via use of the **`/settings`** Slash Command. These IDs are used for the following reasons:

- **Role IDs** are used to power the "Birthday Role" module; granting/revoking the specified Role on a/some Members' birthdays
- **Channel IDs** are used to power the "Birthday Announcements" module; posting in the specified text-based Channel when its a/some Members' birthdays

This information is stored securely, and is only used for the functionality mentioned above.

Should the Server no longer want the specified information stored in **CakeDay**, they can remove said information via use of the **`/settings`** Slash Command.

---

## Use of Locale Data
**CakeDay** makes use of the publicly available locale data (i.e: what language Users and Servers have set) Discord sends to all Server/User Apps using Discord's public API for "Interactions" (e.g: Slash Commands, Context Commands, Select Menus, Buttons, Modals). This locale data is only used for knowing which language **CakeDay** should send its responses in, and is __NOT__ stored or tracked in any way.

You can see the public API Documentation regarding what the locale data includes on these official Discord API Documentation Pages:
- [API Locale Reference](https://discord.com/developers/docs/reference#locales)
- [Locale field in Interaction Objects](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object)

---

## Final Notes
Due to limitations with **CakeDay** being hosted on CloudFlare Workers & how Discord's API works for HTTP-only Apps, **CakeDay** will not be able automatically remove any stored Server or User data when removed or de-authorised from said Server.

If you want to have such data removed, you can do so via usage of **CakeDay**'s commands. The relevant commands are named in above sections of this Policy.

The Developer of **CakeDay**, TwilightZebby, is contactable for matters regarding **CakeDay** via GitHub, preferrably via opening an Issue Ticket or Discussion on **CakeDay**'s [GitHub Repo](https://github.com/TwilightZebby/CakeDay).

Please also see [Discord's own Privacy Policy](https://discord.com/privacy).

*This Privacy Policy is subject to change at any time.*
