import { toBuffer, makeWASocket, jidDecode, downloadContentFromMessage } from "baileys";

export function WAConnection(...args) {
	let sock = makeWASocket(...args);

sock.parseMentions = (text) => {
   if (typeof text === "string") {
	const matches = text.match(/@([0-9]{5,16}|0)/g) || [];
	   return matches.map((match) => match.replace("@", "") + "@s.whatsapp.net");
	  }
     }

 sock.reply = (jid, text, quoted, options = {}) => {
     sock.sendMessage(jid, {
        text: text,
        mentions: sock.parseMentions(text),
        ...options
    }, {
        quoted: quoted,
        ephemeralExpiration: process?.env?.E_MSG || 0
        });
      };
   
	sock.decodeJid = (jid) => {
		if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || {};
            return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
        } else return jid;
	}

	sock.downloadMediaMessage = async(m) => {
		let quoted = m.msg ? m.msg : m;
		let stream = await downloadContentFromMessage(quoted, m.type.replace(/Message/, ""));
		let buffer = await toBuffer(stream) || Buffer.alloc(0);

		if (buffer) {
			return buffer;
		}
	}

	sock.getAdmins = async(jid) => {
		if (!jid || !jid.endsWith("@g.us")) return;
		let group = await sock.groupMetadata(jid).catch(_ => {});
		let admins = new Array();
		
		for (let user of group.participants) {
			if (user.admin == "admin" || user.admin == "superadmin") admins.push(sock.decodeJid(user.id));
		}

		return admins;
	}

	return sock;
}
