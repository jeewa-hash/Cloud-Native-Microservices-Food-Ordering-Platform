import { getChannel } from "../config/rabbitmqConfig.js";
import { createNotification } from "../controllers/notificationController.js";

export const listenOrderEvents = async () => {
  const channel = getChannel();

  const exchange = "order_events";
  const queue = "notification_queue";

  await channel.assertExchange(exchange, "fanout", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, "");

  console.log("Waiting for order events...");

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const event = JSON.parse(msg.content.toString());

      console.log("Event received:", event);

      if (event.type === "ORDER_CREATED") {
        // Notify User
        await createNotification({
          recipientId: event.userId,
          recipientType: "USER",
          type: "ORDER_CREATED",
          title: "Order Placed",
          message: "Your order has been placed successfully.",
          relatedId: event.orderId
        });

        // Notify Restaurant
        await createNotification({
          recipientId: event.restaurantId,
          recipientType: "RESTAURANT",
          type: "ORDER_CREATED",
          title: "New Order",
          message: "You have received a new order.",
          relatedId: event.orderId
        });
      }

      channel.ack(msg);
    }
  });
};