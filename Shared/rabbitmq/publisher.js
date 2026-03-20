import { getChannel } from "./connection.js";

export const publishEvent = (queue, message) => {

  const channel = getChannel();

  channel.assertQueue(queue);

  channel.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(message))
  );
};