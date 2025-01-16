import baileys, { extractMessageContent } from "baileys";

export async function msg(sock, m) {
	if (m.key) {
		m.id = m.key.id;
		m.isBaileys = m.id.startsWith("BAE5");
		m.from = m.key.remoteJid;
		m.isGroup = m.from.endsWith("@g.us");
		m.sender = m.key.fromMe ? sock.decodeJid(sock.user.id) : (m.key.participant || m.from);

		if (m.isGroup) {
			let admins = await sock.getAdmins(m.from);
			m.isAdmin = admins.includes(m.sender);
			m.isBotAdmin = admins.includes(sock.decodeJid(sock.user.id));
		}
	}

	if (m.message) {
		m.type = Object.keys(m.message)[0];
		m.msg = extractMessageContent(m.message[m.type]);
		m.body = m.msg?.text || m.msg?.caption || m.message?.conversation || "";
		m.mentions = m.msg?.contextInfo?.mentionedJid || []

		m.delete = async() => await sock.sendMessage(m.from, { delete: m.key });
		m.download = async() => await sock.downloadMediaMessage(m);

		m.isQuoted = !!m.msg?.contextInfo?.quotedMessage;

		if (m.isQuoted) {
			let quoted = baileys.proto.WebMessageInfo.fromObject({
				key: {
					remoteJid: m.from,
					fromMe: (m.msg.contextInfo.participant === sock.decodeJid(sock.user.id)),
					id: m.msg.contextInfo.stanzaId,
					participant: m.isGroup ? m.msg.contextInfo.participant : undefined
				},
				message: m.msg.contextInfo.quotedMessage
			})

			m.quoted = await msg(sock, quoted);
		}
	}

	m.reply = async(txt = "", options = {}) => {
		return await sock.sendMessage(options.from || m.from, {
			text: txt,
			contextInfo: {
				mentionedJid: options.mentions || sock.parseMentions(txt) || [m.sender],
				remoteJid: options.remote || null
			}
		}, {
			quoted: options.quoted || m
		})
	}

	return m;
}