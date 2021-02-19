import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { ITinder } from "../../interfaces/db";
import { errorMessage } from "../../nsb/Embeds";
import { getTinderDB } from "../../struct/db";

export default class TinderRemoveDates extends Command {
	constructor() {
		super("tinderremovedates", {
			args: [
				{
					id: "integer",
					type: "integer",
					otherwise: (m: Message) => errorMessage(m, "Provide a number. Check your tinder lists for the specific numbers"),
				},
			],
		});
	}
	public async exec(message: Message, { integer }: { integer: number }): Promise<ITinder> {
		const db = await getTinderDB(message.author.id);

		if (db.tinderData.datingIDs.length) {

			if (db.tinderData.datingIDs.length >= integer) {
				const userID = db.tinderData.datingIDs.splice(integer, 1),
					RemovedMember = message.client.users.cache.get(userID[0]),
					rDB = await getTinderDB(RemovedMember?.id ?? userID[0]),
					userNumber = rDB.tinderData.datingIDs.indexOf(message.author.id);

				if (userNumber !== -1) {
					rDB.tinderData.datingIDs.splice(userNumber, 1);
				}

				message.channel.send(`You stopped dating ${RemovedMember ? RemovedMember?.username : "<@" + userID + ">"}.`).then(SentMsg => {
					SentMsg.react("✅");
					SentMsg.react("💔");
				});
				rDB.markModified("tinderData.datingIDs");
				rDB.save();
			}
			else {
				message.channel.send(new MessageEmbed()
					.setDescription("Please provide a valid number.")
					.withErrorColor(message),
				);
			}
		}
		else {
			message.channel.send("Nothing to delete.");
		}
		db.markModified("tinderData.datingIDs");
		return db.save();
	}
}