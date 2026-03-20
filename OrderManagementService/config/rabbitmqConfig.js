import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log("RabbitMQ Connected");
  return channel;
};

export const getChannel = () => channel;