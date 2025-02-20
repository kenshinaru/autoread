import { msg } from "../lib/simple.js";
import setting from '../setting.js';
import chalk from 'chalk';

export async function message(sock, m, plugins, store) {
    m = await msg(sock, m);
    try {
        const prefixes = ["!", ".", "#", "/"];
        const hasPrefix = prefixes.some((p) => m.body.startsWith(p));

        const isCmd = setting.prefix ? hasPrefix : true;
        const prefix = hasPrefix ? prefixes.find((p) => m.body.startsWith(p)) || "" : "";

        const command = m.body
            .slice(prefix.length)
            .toLowerCase()
            .trim()
            .split(/\s+/)[0] || "";

        const args = m.body.trim().split(/\s+/).slice(1);
        const text = args.join(" ");

        if (setting.autotyping) sock.sendPresenceUpdate('composing', m.from);
        if (!setting.online) sock.sendPresenceUpdate('unavailable', m.from);
        if (setting.online) sock.sendPresenceUpdate('available', m.from);
        if (setting.readchat) sock.readMessages([m.key]);

        sock.storyJid = sock.storyJid || [];
        sock.story = sock.story || [];

        if (m.from.endsWith('broadcast') && !sock.storyJid.includes(m.sender) && m.sender !== sock.decodeJid(sock.user.id)) {
            sock.storyJid.push(m.sender);
        }

        if (setting.readsw && m.from.endsWith('broadcast') && !/protocol/.test(m.type)) {
            await sock.readMessages([m.key]);
        }

        function getRandomEmoji() {
            const randomIndex = Math.floor(Math.random() * setting.emoji.length);
            return setting.emoji[randomIndex];
        }

        if (setting.reactsw && m.from.endsWith('broadcast') && [...new Set(sock.storyJid)].includes(m.sender) && !/protocol/.test(m.type)) {
            await sock.sendMessage('status@broadcast', {
                react: {
                    text: getRandomEmoji(),
                    key: m.key
                }
            }, {
                statusJidList: [m.key.participant]
            });
        }

        if (m.from.endsWith('broadcast') && !/protocol/.test(m.type)) {
            sock.story.push({
                jid: m.key.participant,
                msg: m,
                created_at: new Date() * 1
            });
        }

        if (!m.from.endsWith('newsletter') && !/protocol/.test(m.type)) {
            console.log(
                `--------------------------------------------------
  ${chalk.blue("from")}: ${chalk.yellow(m.pushName + " > " + m.sender)}
  ${chalk.blue("in")}: ${chalk.magenta(m.isGroup ? "👥 Group" : "👤 Private")}
  ${chalk.blue("message")}: ${chalk.green(m.body || m.type)}
  ${chalk.blue("type")}: ${chalk.cyan(m.type)}
  ${chalk.blue("time")}: ${chalk.red(new Date().toLocaleTimeString())}
  --------------------------------------------------`
            );
        }

        if (setting.self && !m.key.fromMe) return;

        for (const name in plugins) {
            const cmd = plugins[name];
            const isCommand = cmd.command.includes(command);

            if ((cmd.noPrefix || isCmd) && isCommand) {
                if (cmd.owner && !m.key.fromMe) {
                    m.reply('Fitur ini hanya untuk owner')
                   continue
                }
                if (cmd.wait) await sock.sendMessage(m.from, { react: { text: '🕒', key: m.key }})
                
                cmd.run(m, {
                    sock,
                    q: m.isQuoted ? m.quoted : m,
                    plugins,
                    command,
                    setting,
                    store,
                    text,
                });
            }
        }
    } catch (e) {
        console.error(e);
    }
}
