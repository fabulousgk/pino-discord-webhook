# Pino Discord Webhook Transport

A [Pino v7+ transport](https://getpino.io/#/docs/transports?id=v7-transports) to send events to [Discord](https://discord.com/)

## Installation

```
npm install --save pino-discord-webhook
```

## Usage

You will need to [create a webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) on your discord server and copy the URL.  It is recommended that you protect this URL like other secrets to avoid your channel being spammed by others.

```js
import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-discord-webhook',
    options: {
      webhookURL: 'https://discord.com/api/webhooks/xxxx/xxxx',
    }
  }
})

logger.info('test log!');
```
