import build from 'pino-abstract-transport';
import { WebhookClient, EmbedBuilder, type ColorResolvable } from 'discord.js';

const embedColors: Record<string, ColorResolvable> = {
	10: '#c100ff', //trace
	20: '#c100ff', //debug
	30: '#8be836', //info
	40: '#ffc142', //warn
	50: '#e83938', //error
	60: '#e83938', //fatal
};

// https://discordjs.guide/popular-topics/embeds.html#embed-limits
const MAX_FIELD_VALUE = 1024,
	MAX_FIELD_NAME = 256,
	MAX_FIELDS = 25;

const trim = (str: string, max: number) => {
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
};

async function discordTransport(options: { webhookURL: string }) {
	if (!options.webhookURL) {
		throw new Error('The required option: webhookURL is missing.');
	}

	const webhook = new WebhookClient({
		url: options.webhookURL,
	});

	return build(async function (source) {
		for await (const message of source) {
			const { level, msg, err, time, ...rest } = message;

			const fields = Object.entries(rest).map(([name, value]) => ({
				name: trim(name, MAX_FIELD_NAME),
				value: trim(String(value), MAX_FIELD_VALUE),
			}));

			const fieldsExceedingLimit = fields.length > MAX_FIELDS;

			const embed = new EmbedBuilder()
				.setColor(embedColors[level]!)
				.setTitle(String(msg))
				.addFields(fieldsExceedingLimit ? fields.slice(0, MAX_FIELDS) : fields)
				.setTimestamp(typeof time === 'number' ? time : null);

			if (fieldsExceedingLimit) {
				embed.setFooter({
					text: `Some fields have been excluded from the log. The maximum allowed is ${MAX_FIELDS} fields.`,
				});
			}

			await webhook.send({
				embeds: [embed],
			});
			await webhook.send(
				'```\n' +
					(err ? trim(String(err.stack), 4000) : 'No stack trace') +
					'\n```',
			);
		}
	});
}

export default discordTransport;
