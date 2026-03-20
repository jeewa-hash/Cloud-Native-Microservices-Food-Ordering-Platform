import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {

  const connection = await amqp.connect("amqp://localhost:5672");

  channel = await connection.createChannel();

  console.log("RabbitMQ Connected");
};

export const getChannel = () => channel;