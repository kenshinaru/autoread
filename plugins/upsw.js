export default {
  name: ["upsw"],
  command: ["upsw"],
  tags: "owner",
  wait: true,
  run: async (m, { sock, text, q, store }) => {
    if (!text) return sock.reply(m.from, "Masukkan teks atau media untuk diunggah.\n\n📌 *Cara Penggunaan:*\n\n➤ *Upload ke Grup (Tag Grup)*\n    `upsw 628xxxxxxx@g.us Pesan Anda`\n\n➤ *Upload ke Grup tanpa Notif*\n    `upsw 628xxxxxxx@g.us Pesan Anda --silent`\n\n➤ *Upload ke Status Pribadi*\n    `upsw Pesan Anda`\n\n➤ *Upload dengan Media*\n    (Kirim media dengan caption)\n    `upsw 628xxxxxxx@g.us Pesan Anda`", m);

    const jids = text.split(" ").filter((id) => id.endsWith("@g.us"));
    const silent = text.includes("--silent");
    const caption = text.replace(/--silent/g, "").split(" ").filter((id) => !id.endsWith("@g.us")).join(" ").trim();
    const mime = ((q.msg || q).mimetype || "").split("/")[0];

    if (jids.length) {
      await sock.uploadStory(
        jids,
        q.isMedia ? { [mime]: await q.download(), caption } : { image: { url: "https://telegra.ph/file/aa76cce9a61dc6f91f55a.jpg" }, caption },
        silent
      );
      return sock.reply(m.from, `Story berhasil diunggah ke ${jids.length} grup.${silent ? " Silent" : ""}`, m);
    }

    const statusJidList = Object.values(store.contacts).map((c) => c?.id).filter((id) => id?.endsWith("@s.whatsapp.net"));

    await sock.uploadStory(
      statusJidList,
      q.isMedia ? { [mime]: await q.download(), caption } : { text, backgroundColor: getRandomHexColor(), font: Math.floor(Math.random() * 9) }
    );

    return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
  },
  error: false,
};

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
}
