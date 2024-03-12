# Pino Discord Webhook Transport

A [Pino v7+ transport](https://getpino.io/#/docs/transports?id=v7-transports) to send events to [Slack](https://slack.com/)

## Installation

```
npm install --save pino-discord-webhook
```

## Usage

```js
import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-discord-webhook',
    options: {
      webhookUrl: 'https://discord.com/api/webhooks/xxxx/xxxx',
    }
  }
})

logger.info('test log!');
```
