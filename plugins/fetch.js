import axios from 'axios';

export default {
  name: 'get',
  command: ['get', 'fetch'],
  tags: 'owner',
  run: async (m, { sock, text, command }) => {
    let url = text || (m.quoted && m.quoted.body.match(/https?:\/\/[^\s]+/i)?.[0]);
    if (!url) return sock.reply(m.chat, "Masukan URL nya!", m);

    try {
      if (url.match('github.com')) {
        let username = url.split(`/`)[3];
        let repository = url.split(`/`)[4];
        let zipball = `https://api.github.com/repos/${username.trim()}/${repository.trim()}/zipball`;
        return sock.sendFile(m.chat, zipball, `${repository}.zip`, '', m)
      }

      const { data, headers } = await axios.get(url, {
        responseType: "arraybuffer",
      });

      if (!data || !headers) {
        return sock.reply(m.chat, "Failed to fetch the url", m);
      }

      let contentType = headers["content-type"] || "";

      if (/video/i.test(contentType)) {
        return sock.sendMessage(m.chat, { video: Buffer.from(data) }, { quoted: m });
      } else if (/image/i.test(contentType)) {
        return sock.sendMessage(m.chat, { image: Buffer.from(data) }, { quoted: m });
      } else if (/audio/i.test(contentType)) {
        return sock.sendMessage(m.chat, { audio: Buffer.from(data) }, { quoted: m });
      }

      try {
        let json = JSON.parse(data.toString());
        sock.reply(m.chat, JSON.stringify(json, null, 2), m);
      } catch {
        sock.reply(m.chat, data.toString(), m);
      }

    } catch (error) {
      sock.reply(m.chat, JSON.stringify(error, null, 2), m);
    }
  },
  error: false,
  wait: true,
};
