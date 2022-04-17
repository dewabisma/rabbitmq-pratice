#!/usr/bin/env node

import amqp from "amqplib";

const sendMessage = async () => {
  try {
    var msg = process.argv.slice(2).join(" ") || "Hello World!";

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.assertQueue("task", { durable: true });

    channel.sendToQueue("task", Buffer.from(msg), {
      persistent: true,
    });

    console.log("Message sent to broker");

    await channel.close();
    await connection.close();
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
};

await sendMessage();
