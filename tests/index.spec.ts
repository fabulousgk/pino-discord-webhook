import { type Transform } from 'node:stream';
import { WebhookClient } from 'discord.js';
import pinoDiscordTransport from '../src/index';

jest.mock('discord.js', () =>{
	const WebhookClient = jest.fn();
	return { WebhookClient };
});

describe('pino-discord-webhook', () => {
	test('should send error to WebhookClient', async () => {
		const options = {
			webhookURL:
				'https://discord.com/api/webhooks/0000000000000000000/a0aaaaaaaa23aaaaaa0aaa3aa2aaaa4aa4aaa-aaaa5a09aaaa06a8aaaaaaaaaaaaaa',
		};



		const transform = (await pinoDiscordTransport(options)) as Transform;

		const logs = [
			{
				level: 10,
				time: 1617955768092,
				pid: 2942,
				hostname: 'MacBook-Pro.local',
				msg: 'hello world',
			},
			{
				level: 50,
				time: 1617955768092,
				pid: 2942,
				hostname: 'MacBook-Pro.local',
				err: {
					message: 'error message',
					stack: 'error stack',
				},
				msg: 'hello world',
			},
		];

		const logSerialized = logs.map((log) => JSON.stringify(log)).join('\n');

		transform.write(logSerialized);
		transform.end();
		expect(WebhookClient).toHaveBeenCalled();
	});
});
