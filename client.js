/*
  *  Script by Luthfi Joestars
  *  Github : kenshinaru
  *  Telegram : t.me/kenshin
  *  WhatsApp : wa.me/6281310994964
  *  Instagram : @urheadfather_
*/


import pino from "pino";
import path from "path";
import fs from "node:fs";
import chalk from "chalk"
import { fileURLToPath } from "url";
import { message } from "./messages/upsert.js";
import { WAConnection } from "./lib/whatsapp.js";
import baileys from "baileys";
import setting from './setting.js'
import NodeCache from "node-cache"

const pathStories = `./session/stories.json`
const pathContacts = `./session/contacts.json`
const msgRetryCounterCache = new NodeCache();
const logger = pino({ level: "silent" }).child({ level: "silent" })
const store = baileys.makeInMemoryStore({
  logger
});

global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);

const Starting = async() => {
    const { state, saveCreds } = await baileys.useMultiFileAuthState("session")
	let sock = WAConnection({
		printQRInTerminal: (setting.pairing && setting.pairing.state && setting.pairing.number) ? false : true,
		logger,
		auth: {
			creds: state.creds,
			keys: baileys.makeCacheableSignalKeyStore(state.keys, logger)
		},
     getMessage: async (key) => {
      if (store) {
      let msg = await store.loadMessage(key.remoteJid, key.id);

      return msg?.message || "Hi bro";
      }
       return baileys.proto.Message.fromObject({})
    },
      generateHighQualityLinkPreview: true,
      version: [2, 3000, 1019430034],
      browser: ['Ubuntu', 'Firefox', '20.0.00'],
      msgRetryCounterCache,
      syncFullHistory: true,
      retryRequestDelayMs: 10,
      transactionOpts: {
      maxCommitRetries: 10,
      delayBetweenTriesMs: 10
      },
      maxMsgRetryCount: 15,
      appStateMacVerification: {
      patch: true,
      snapshot: true
        },
      })
    
   if (setting.pairing && setting.pairing.state && !sock.authState.creds.registered) {
   var phoneNumber = setting.pairing.number
   setTimeout(async () => {
      try {
         let code = await sock.requestPairingCode(phoneNumber)
         code = code.match(/.{1,4}/g)?.join("-") || code
         console.log(chalk.black(chalk.bgGreen(` Your Pairing Code `)), ' : ' + chalk.black(chalk.white(code)))
      } catch {}
   }, 3000)
  }
    
   sock.ev.on("creds.update", saveCreds);

   sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
	if (connection === "close") {
	if (lastDisconnect?.error?.output?.statusCode !== 401) {
			Starting();
			} else {
			console.log("Menghapus session lama...");
			fs.rmSync("session", { recursive: true });
			Starting();
			}
	} else if (connection === "open") {
	console.log(chalk.green('[INFO] Connected successfully!'))
            await sock.reply(
  sock.decodeJid(sock.user.id),
  `— *CONNECTION OPEN* —\n\nStatus:\n- Anticall : ${setting.anticall ? 'ON' : 'OFF'}\n- Autotyping : ${setting.autotyping ? 'ON' : 'OFF'}\n- Readchat : ${setting.readchat ? 'ON' : 'OFF'}\n- ReadSW : ${setting.readsw ? 'ON' : 'OFF'}\n- ReactSW : ${setting.reactsw ? 'ON' : 'OFF'}\n- Online : ${setting.online ? 'ON' : 'OFF'}`)
		}
	})

    if (fs.existsSync(pathContacts)) {
		store.contacts = JSON.parse(fs.readFileSync(pathContacts, 'utf-8'));
	} else {
		fs.writeFileSync(pathContacts, JSON.stringify({}));
	}
    
    if (fs.existsSync(pathStories)) {
		sock.story = JSON.parse(fs.readFileSync(pathStories, 'utf-8'));
	} else {
        sock.story = []
		fs.writeFileSync(pathStories, JSON.stringify(sock.story));
	}
    
    sock.ev.on('contacts.update', update => {
		for (let contact of update) {
			let id = baileys.jidNormalizedUser(contact.id);
			if (store && store.contacts) store.contacts[id] = { ...(store.contacts?.[id] || {}), ...(contact || {}) };
		}
	});

    sock.ev.on('contacts.upsert', update => {
		for (let contact of update) {
			let id = baileys.jidNormalizedUser(contact.id);
			if (store && store.contacts) store.contacts[id] = { ...(contact || {}), isContact: true };
		}
	})

   sock.ev.on("messages.upsert", async ({ type, messages }) => {
    
    if (type !== "notify") return;    
    let plugins = {};
    let stack = [path.join(__dirname, "plugins")];
    while (stack.length) {
        let dir = stack.pop();
        for (let file of fs.readdirSync(dir)) {
            let fullPath = path.join(dir, file);
            fs.statSync(fullPath).isDirectory() ? stack.push(fullPath) : fullPath.endsWith(".js") && (plugins[fullPath] = (await import(fullPath + "?t=" + Date.now())).default);
        }
    }

    fs.watch(path.join(__dirname, "plugins"), { recursive: true }, async (event, filename) => {
        if (filename) console.info(chalk.green(`[Info] File changed: ${filename}`));
        plugins = {};
        let stack = [path.join(__dirname, "plugins")];
        while (stack.length) {
            let dir = stack.pop();
            for (let file of fs.readdirSync(dir)) {
                let fullPath = path.join(dir, file);
                fs.statSync(fullPath).isDirectory() ? stack.push(fullPath) : fullPath.endsWith(".js") && (plugins[fullPath] = (await import(fullPath + "?t=" + Date.now())).default);
            }
        }
    });

    for (let m of messages) {
        if (!m.message) continue;
        m.message = m.message?.ephemeralMessage?.message || m.message;
        if (store.groupMetadata && !Object.keys(store.groupMetadata).length) store.groupMetadata = await sock.groupFetchAllParticipating();
        await message(sock, m, plugins, store);
    }
});
    
   sock.ev.on("call", async (calls) => {
  if (!setting.anticall) return;
  for (const call of calls) {
    if (call.status === "offer") {
      await sock.sendMessage(call.from, {
        text: "Maaf akun ini sedang tidak bisa menjawab panggilan anda.",
        mentions: [call.from],
      });
      await sock.rejectCall(call.id, call.from);
    }
  }
})
   
  setInterval(() => {
  const currentTime = Date.now()
  sock.story = sock.story.filter(v => (currentTime - v.created_at) <= 86400000);
   }, 10000)
   
  setInterval(async () => {
    if (store.contacts) fs.writeFileSync(pathContacts, JSON.stringify(store.contacts));
    if (sock.story) fs.writeFileSync(pathStories, JSON.stringify(sock.story))
    }, 10 * 1000)
    
  return sock
}

Starting()
