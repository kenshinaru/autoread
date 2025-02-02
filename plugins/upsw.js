export default {
  name: "upsw",
  command: ["upsw"],
  tags: "owner",
  wait: true,
  run: async (m, { sock, text, store }) => {
    const args = text.split(" ");
    const jids = args.filter((id) => id.endsWith("@g.us"));
    const caption = args.filter((id) => !id.endsWith("@g.us")).join(" ").trim();

    if (jids.length) {
      if (!m.isMedia && caption) {
        await sock.uploadStory(jids, { image: { url: "https://telegra.ph/file/aa76cce9a61dc6f91f55a.jpg" }, caption });
        return sock.reply(m.from, `Story teks berhasil diunggah ke ${jids.length} grup.`, m);
      }
      if (/audio/i.test(m.quoted?.type)) {
        const buffer = await m.quoted.download();
        await sock.uploadStory(jids, { audio: buffer });
        return sock.reply(m.from, `Story audio berhasil diunggah ke ${jids.length} grup.`, m);
      }
      if (/image/i.test(m.type)) {
        const buffer = await m.download();
        await sock.uploadStory(jids, { image: buffer, caption });
        return sock.reply(m.from, `Story gambar berhasil diunggah ke ${jids.length} grup.`, m);
      }
      if (/video/i.test(m.type)) {
        const buffer = await m.download();
        await sock.uploadStory(jids, { video: buffer, caption });
        return sock.reply(m.from, `Story video berhasil diunggah ke ${jids.length} grup.`, m);
      }
    } else {
      const statusJidList = Object.values(store.contacts)
        .map((contact) => contact?.id)
        .filter((id) => id && id.endsWith("@s.whatsapp.net"));

      if (!m.isMedia && text) {
        await sock.sendMessage("status@broadcast", { text, backgroundColor: getRandomHexColor(), font: Math.floor(Math.random() * 9) }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
      }
      if (/image/i.test(m.type)) {
        const buffer = await m.download();
        await sock.sendMessage("status@broadcast", { image: buffer, mimetype: "image/jpeg", caption: text || "" }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
      }
      if (/video/i.test(m.type)) {
        const buffer = await m.download();
        await sock.sendMessage("status@broadcast", { video: buffer, mimetype: "video/mp4", caption: text || "" }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
      }
      if (/audio/i.test(m.quoted?.type)) {
        const buffer = await m.quoted.download();
        await sock.sendMessage("status@broadcast", { audio: buffer, mimetype: "audio/mpeg" }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
      }
      return sock.reply(m.from, "Gunakan format:\n\n🔹 *Upload ke grup tertentu:* `.upsw 12345@g.us 67890@g.us Halo!`\n🔹 *Upload ke semua kontak:* `.upsw Halo!`\n🔹 *Kirim media:* kirim media + `.upsw 12345@g.us`", m);
    }
  },
  error: false,
};

function getRandomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}
