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

async function discordTransport(options: { webhookURL: string }) {
	if (!options.webhookURL) {
		throw new Error('The required option: webhookURL is missing.');
	}

	const webhook = new WebhookClient({
		url: options.webhookURL,
	});

	return build(async function (source) {
		for await (const message of source) {
			const embed = new EmbedBuilder()
				.setColor(embedColors[message.level]!)
				.setTitle(String(message.msg))
				.setTimestamp();

			await webhook.send({
				embeds: [embed],
			});
			await webhook.send(
				'```\n' +
					(message.err
						? String(message.err.stack).slice(0, 4000)
						: 'No stack trace') +
					'\n```',
			);
		}
	});
}

export default discordTransport;
