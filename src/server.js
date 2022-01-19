import { create } from 'venom-bot';
import { stages, getStage } from './stages.js';

create({ session: 'delicias-neide' })
  .then((client) => start(client))
  .catch((error) => {
    process.exit(error);
  });

async function start(client) {
  await client.onMessage(async (message) => {
    const isValidNumber = await client.checkNumberStatus(message.from);
    if (!message.isGroupMsg && isValidNumber) {
      try {
        const currentStage = getStage({ from: message.from });
        console.log(currentStage);

        const messageResponse = stages[currentStage].stage.exec({
          from: message.from,
          message: message.body,
          client,
        });

        if (messageResponse) {
          await client.sendText(message.from, messageResponse);
        }
      } catch (error) {
        console.log(error);
        client.close();
      }
    }
  });

  process.on('SIGINT', function () {
    client.close();
  });
}
