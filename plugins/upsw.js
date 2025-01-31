export default {
  name: "upsw",
  command: ["upsw"],
  tags: "owner",
  wait: true,
  run: async (m, { sock, text, store }) => {
    const jid = (text.match(/"([^"]+@g\.us)"/) || [])[1];

    if (jid) {
      const caption = text.replace(`"${jid}"`, "").trim();

      if (!m.isMedia && caption) {
     await sock.uploadStory([jid], { image: { url: "https://telegra.ph/file/aa76cce9a61dc6f91f55a.jpg" }, caption });
        return sock.reply(m.from, `Story text berhasil diunggah ke ${jid}.`, m);
      }
      if (/audio/i.test(m.quoted?.type)) {
        const buffer = await m.quoted.download();
        await sock.uploadStory([jid], { audio: buffer });
        return sock.reply(m.from, `Story audio berhasil diunggah ke ${jid}.`, m);
      }

      if (/image/i.test(m.type)) {
        const buffer = await m.download();
        await sock.uploadStory([jid], { image: buffer, caption });
        return sock.reply(m.from, `Story gambar berhasil diunggah ke ${jid}.`, m);
      }

      if (/video/i.test(m.type)) {
        const buffer = await m.download();
        await sock.uploadStory([jid], { video: buffer, caption });
        return sock.reply(m.from, `Story video berhasil diunggah ke ${jid}.`, m);
      }
    } else {
      const statusJidList = [
        ...Object.values(store.contacts)
          .map((contact) => contact?.id)
          .filter((id) => id && id.endsWith("@s.whatsapp.net")),
      ];

      if (!m.isMedia && text) {
        await sock.sendMessage("status@broadcast", { text, backgroundColor: getRandomHexColor(), font: Math.floor(Math.random() * 9) }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
      } else if (/image/i.test(m.type)) {
        const buffer = await m.download();
        await sock.sendMessage("status@broadcast", { image: buffer, mimetype: "image/jpeg", caption: text || "" }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
      } else if (/video/i.test(m.type)) {
        const buffer = await m.download();
        await sock.sendMessage("status@broadcast", { video: buffer, mimetype: "video/mp4", caption: text || "" }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
      } else if (/audio/i.test(m.quoted?.type)) {
        const buffer = await m.quoted.download();
        await sock.sendMessage("status@broadcast", { audio: buffer, mimetype: "audio/mpeg" }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
      } else {
        return sock.reply(m.from, "Jika ingin upload story dengan tag groups, masukkan ID groups dalam string.\n\nContoh upsw (tag groups): .upsw halooo \"12344@g.us\"\nContoh upsw (biasa): upsw halooo\n\nKeduanya mendukung upload video, gambar, dan audio.", m);
      }
    }
  },
  error: false,
};

function getRandomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}
