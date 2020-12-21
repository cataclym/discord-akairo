import { Command } from "discord-akairo";
import { GuildMember, Message, MessageEmbed } from "discord.js";
export default class InviteCommand extends Command {
	constructor() {
		super("invite", {
			aliases: ["invite", "inv"],
			description: { description: "Get a link to invite Nadeko Sengoku to your server.", usage: "" },
		});
	}
	public async exec(message: Message): Promise<Message> {
		return message.channel.send(new MessageEmbed({
			color: await message.getMemberColorAsync(),
			title: "Invite link",
			description: `[Link](https://discord.com/oauth2/authorize?client_id=${this.client.user?.id}&scope=bot&permissions=2080763126)`,
			image: { url: this.client.user?.displayAvatarURL({ size: 128, dynamic: true }) },
		}));
	}
}