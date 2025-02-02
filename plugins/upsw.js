export default {
  name: ["upsw", "upsw-notag"],
  command: ["upsw", "upsw-notag"],
  tags: "owner",
  wait: true,
  run: async (m, { sock, text, q, store, command }) => {
    const args = text.split(" ");
    const jids = args.filter((id) => id.endsWith("@g.us"));
    const caption = args.filter((id) => !id.endsWith("@g.us")).join(" ").trim();
    const silent = command === 'upsw-notag'; // Check if the command is 'upsw-notag'

    if (jids.length) {
      if (!q.isMedia && caption) {
        await sock.uploadStory(jids, { image: { url: "https://telegra.ph/file/aa76cce9a61dc6f91f55a.jpg" }, caption }, { silent });
        return sock.reply(m.from, `Story teks berhasil diunggah ke ${jids.length} grup.${silent ? ' (Tanpa tag)' : ''}`, m);
      }
      if (/audio/i.test(q.type)) {
        const buffer = await q.download();
        await sock.uploadStory(jids, { audio: buffer }, { silent });
        return sock.reply(m.from, `Story audio berhasil diunggah ke ${jids.length} grup.${silent ? ' (Tanpa tag)' : ''}`, m);
      }
      if (/image/i.test(q.type)) {
        const buffer = await q.download();
        await sock.uploadStory(jids, { image: buffer, caption }, { silent });
        return sock.reply(m.from, `Story gambar berhasil diunggah ke ${jids.length} grup.${silent ? ' (Tanpa tag)' : ''}`, m);
      }
      if (/video/i.test(q.type)) {
        const buffer = await q.download();
        await sock.uploadStory(jids, { video: buffer, caption }, { silent });
        return sock.reply(m.from, `Story video berhasil diunggah ke ${jids.length} grup.${silent ? ' (Tanpa tag)' : ''}`, m);
      }
    } else {
      const statusJidList = Object.values(store.contacts)
        .map((contact) => contact?.id)
        .filter((id) => id && id.endsWith("@s.whatsapp.net"));

      if (!q.isMedia && text) {
        await sock.sendMessage("status@broadcast", { text, backgroundColor: getRandomHexColor(), font: Math.floor(Math.random() * 9) }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.${silent ? ' (Tanpa tag)' : ''}`, m);
      }
      if (/image/i.test(q.type)) {
        const buffer = await q.download();
        await sock.sendMessage("status@broadcast", { image: buffer, mimetype: "image/jpeg", caption: text || "" }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.${silent ? ' (Tanpa tag)' : ''}`, m);
      }
      if (/video/i.test(q.type)) {
        const buffer = await q.download();
        await sock.sendMessage("status@broadcast", { video: buffer, mimetype: "video/mp4", caption: text || "" }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.${silent ? ' (Tanpa tag)' : ''}`, m);
      }
      if (/audio/i.test(q.type)) {
        const buffer = await q.download();
        await sock.sendMessage("status@broadcast", { audio: buffer, mimetype: "audio/mpeg" }, { statusJidList });
        return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.${silent ? ' (Tanpa tag)' : ''}`, m);
      }
      return sock.reply(m.from, "Gunakan format:\n\n🔹 *Upload ke grup tertentu:* `.upsw 12345@g.us 67890@g.us Halo!`\n🔹 *Upload ke semua kontak:* `.upsw Halo!`\n🔹 *Kirim media:* kirim media + `.upsw 12345@g.us`\n\nUntuk upload tanpa tag grup, gunakan `.upsw-notag`", m);
    }
  },
  error: false,
};

function getRandomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}
