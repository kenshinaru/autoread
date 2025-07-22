import { 
  toBuffer, 
  makeWASocket, 
  jidDecode, 
  downloadContentFromMessage, 
  generateWAMessage, 
  STORIES_JID 
} from "baileys";
import fileType from 'file-type';
import FormData from 'form-data';
import axios from 'axios';

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
    } else {
      return jid;
    }
  }

  sock.downloadMediaMessage = async (m) => {
    let quoted = m.msg ? m.msg : m;
    let stream = await downloadContentFromMessage(quoted, m.type.replace(/Message/, ""));
    let buffer = await toBuffer(stream) || Buffer.alloc(0);

    if (buffer) {
      return buffer;
    }
  }

  sock.getAdmins = async (jid) => {
    if (!jid || !jid.endsWith("@g.us")) return [];

    let group = await sock.groupMetadata(jid).catch(() => {});
    if (!group) return [];

    return group.participants
      .filter(user => user.admin === "admin" || user.admin === "superadmin")
      .map(user => sock.decodeJid(user.id));
  };

  sock.uploadStory = async (jids, content, silent = false) => {
    const fetchParticipants = async (...jids) => {
      const results = await Promise.all(
        jids.map(async (jid) => {
          let { participants } = await sock.groupMetadata(jid);
          return participants.map(({ id }) => id);
        })
      );
      return results.flat();
    };

    const msg = await generateWAMessage("status@broadcast", content, {
      upload: sock.waUploadToServer,
    });

    let statusJidList = await Promise.all(
      jids.map(async (_jid) =>
        _jid.endsWith("@g.us") ? await fetchParticipants(_jid) : _jid
      )
    );

    statusJidList = [...new Set(statusJidList.flat())];

    if (jids.every((jid) => !jid.endsWith("@g.us"))) {
      await sock.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id,
        statusJidList,
      });
    } else if (silent) {
      await sock.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id,
        statusJidList,
        additionalNodes: [
          {
            tag: "meta",
            attrs: {},
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: jids.map((jid) => ({
                  tag: "to",
                  attrs: { jid },
                  content: undefined,
                })),
              },
            ],
          },
        ],
      });
    } else {
      await sock.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id,
        statusJidList,
        additionalNodes: [
          {
            tag: "meta",
            attrs: {},
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: jids.map((jid) => ({
                  tag: "to",
                  attrs: { jid },
                  content: undefined,
                })),
              },
            ],
          },
        ],
      });

      await Promise.all(
        jids.map((jid) => {
          let type = jid.endsWith("@g.us") ? "groupStatusMentionMessage" : "statusMentionMessage";
          return sock.relayMessage(
            jid,
            {
              [type]: {
                message: {
                  protocolMessage: {
                    key: msg.key,
                    type: 25,
                  },
                },
              },
            },
            {
              additionalNodes: [
                {
                  tag: "meta",
                  attrs: { is_status_mention: "true" },
                  content: undefined,
                },
              ],
            }
          );
        })
      );
    }

    return msg;
  };

  sock.uploadFile = async (buffer) => {
    try {
      const { ext, mime } = (await fileType.fromBuffer(buffer)) || {};
      const formData = new FormData();
      formData.append('fileToUpload', buffer, {
        filename: `upload.${ext}`,
        contentType: mime,
      });
      formData.append('reqtype', 'fileupload');

      const response = await axios.post('https://catbox.moe/user/api.php', formData, {
        headers: {
          ...formData.getHeaders(),
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading to Catbox:', error);
      throw new Error('Upload failed');
    }
  }

  return sock;
}
