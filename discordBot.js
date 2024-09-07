const { Client, GatewayIntentBits } = require("discord.js")
const schedule = require("node-schedule")
require('dotenv').config();

const client = new Client({ 
  intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.MessageContent, 
  GatewayIntentBits.GuildPresences,
]
})
const token = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL
const userId = process.env.USER_ID

let onlineReminderCount = 0;
let invisibleReminderCount = 0;
const maxReminders = 2;

client.once("ready", async () => {
  console.log("bot online")

  const sendAdditionalMsg = async (statusToCheck, reminderMsg, count, maxCount) => {
    try {
      const channel = await client.channels.fetch(channelId)
      const user = await client.guilds.cache.first().members.fetch(userId)
      if (user.presence?.status !== statusToCheck && count < maxCount) {
        await channel.send(reminderMsg)
        console.log("sent additional reminder", reminderMsg)
        return true
      }
      return false
    } catch (err) {
      console.log("failed", err)
    }
  }

  // schedule.scheduleJob("*/1 * * * *", async () => {
  //   try {
  //     const channel = await client.channels.fetch(channelId);
  //     const user = await client.guilds.cache.first().members.fetch(userId);
  //     if (user.presence?.status !== 'online') {
  //       await channel.send("@everyone Reminder: Please set your Discord status to online.");
  //       console.log("Sent reminder to set status to online");
  //       onlineReminderCount = 0;
  
  //       const interval = setInterval(async () => {
  //         onlineReminderCount++;
  //         const reminderSent = await sendAdditionalMsg(
  //           'invisible',
  //           '@everyone Additional Reminder: Set your status to online.',
  //           onlineReminderCount,
  //           maxReminders
  //         );
  //         if (!reminderSent || onlineReminderCount >= maxReminders) clearInterval(interval);
  //       }, 1 * 60 * 1000); // Check every 1 minute for testing
  //     }
  //   } catch (error) {
  //     console.log('Failed to send reminder:', error);
  //   }
  // })

  // schedule.scheduleJob("*/2 * * * *", async () => {
  //   try {
  //     const channel = await client.channels.fetch(channelId);
  //     const user = await client.guilds.cache.first().members.fetch(userId);
  //     if (user.presence?.status !== 'invisible') {
  //       await channel.send("@everyone Reminder: Please set your Discord status to invisible.");
  //       console.log("Sent reminder to set status to invisible");
  //       invisibleReminderCount = 0;
  //       console.log(user.presence?.status)
  //       const interval = setInterval(async () => {
  //         invisibleReminderCount++;
  //         const reminderSent = await sendAdditionalMsg(
  //           'online',
  //           '@everyone Additional Reminder: Set your status to invisible.',
  //           invisibleReminderCount,
  //           maxReminders
  //         );
  //         if (!reminderSent || invisibleReminderCount >= maxReminders) clearInterval(interval);
  //       }, 2 * 60 * 1000); // Check every 1 minute for testing
  //     }
  //   } catch (error) {
  //     console.log('Failed to send reminder:', error);
  //   }
  // })

  schedule.scheduleJob("0 9 * * 1-5", async () => {
    try {
      const channel = await client.channels.fetch(channelId)
      const user = await client.guilds.cache.first().members.fetch(userId);
      if (user.presence?.status !== "online") {
      await channel.send("@everyone Reminder: Please set your Discord status to online.")
      console.log("Sent reminder to set status to online")
      onlineReminderCount = 0

      const interval = setInterval(async () => {
        onlineReminderCount++
        const reminderSent = sendAdditionalMsg("online", '@everyone Additional Reminder: Set your status to online.', onlineReminderCount, maxReminders)
        if (!reminderSent || onlineReminderCount >= maxReminders) clearInterval(interval)
      }, 10 * 60 * 1000)
      }
    } catch (error) {
        console.log('Failed to send reminder:', error)
    }
  })

  schedule.scheduleJob("0 17 * * 1-5", async () => {
    try {
      const channel = await client.channels.fetch(channelId)
      const user = await client.guilds.cache.first().members.fetch(userId);
      if (user.presence?.status !== 'offline') {
        await channel.send("@everyone Reminder: Please set your Discord status to invisible.")
        console.log("Sent reminder to set status to invisible")
        invisibleReminderCount = 0

        const interval = setInterval(async () => {
          invisibleReminderCount++
          const reminderSent = await sendAdditionalMsg('offline', '@everyone Additional Reminder: Set your status to invisible.', invisibleReminderCount, maxReminders)
          if (!reminderSent || invisibleReminderCount >= maxReminders) clearInterval(interval)
        }, 10 * 60 * 1000)
      }
    } catch (error) {
        console.log('Failed to send reminder:', error)
    }
  })
})

client.login(token)

