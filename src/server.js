import { create } from 'venom-bot';
import { stages, getStage } from './stages.js';

create().then((client) => start(client));

async function start(client) {
  await client.onMessage(async (message) => {
    try {
      const currentStage = getStage({ from: message.from });

      const messageResponse = stages[currentStage].stage.exec({
        from: message.from,
        message: message.body,
        client,
      });

      if (messageResponse) {
        await client.sendText(message.from, messageResponse);
      }
    } catch (error) {
      client.close();
    }
  });

  process.on('SIGINT', function () {
    client.close();
  });
}
