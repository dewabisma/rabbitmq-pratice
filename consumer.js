#!/usr/bin/env node

import amqp from "amqplib";

const consumeMessage = async () => {
  try {
    console.log("Connecting to rabbitmq instance");
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.assertQueue("task", { durable: true });

    await channel.prefetch(1);

    await channel.consume(
      "task",
      (msg) => {
        const secs = msg.content.toString().length;
        console.log(`Message consumed ${msg.content.toString()}`);
        setTimeout(() => {
          console.log("Done");

          channel.ack(msg);
        }, secs * 1000);
      },
      {
        noAck: false,
      }
    );

    console.log("Waiting for message...");
  } catch (error) {
    console.error(error);
  }
};

await consumeMessage();
