export default {
  name: ["upsw"],
  command: ["upsw"],
  tags: "owner",
  wait: true,
  run: async (m, { sock, text, q, store }) => {
    if (!text) return sock.reply(m.from, `Masukkan teks atau media untuk diunggah.

Cara Penggunaan:

➤ *Upload ke Grup (Tag Grup)*
   .upsw 628xxxxxxx@g.us Pesan Anda

➤ *Upload ke Grup tanpa Notifikasi*
   .upsw 628xxxxxxx@g.us Pesan Anda --silent

➤ *Upload ke Status Pribadi*
   .upsw Pesan Anda

➤ *Upload dengan Media*
   Kirim media dengan caption
   .upsw 628xxxxxxx@g.us Pesan Anda`, m);

    const jids = text.split(" ").filter((id) => id.endsWith("@g.us"));
    const silent = text.includes("--silent");
    const caption = text.replace(/--silent/g, "").split(" ").filter((id) => !id.endsWith("@g.us")).join(" ").trim();
    const mime = ((q.msg || q).mimetype || "").split("/")[0];

    const statusJidList = [...new Set([...jids, ...Object.values(store.contacts)
      .map((c) => c?.id)
      .filter((id) => id?.endsWith("@s.whatsapp.net"))])]

    if (jids.length) {
      const totalParticipants = (
        await Promise.all(jids.map(async (jid) => (await sock.groupMetadata(jid)).participants.length))
      ).reduce((acc, count) => acc + count, 0);

      await sock.uploadStory(
        statusJidList,
        q.isMedia ? { [mime]: await q.download(), caption } : { image: { url: "https://telegra.ph/file/aa76cce9a61dc6f91f55a.jpg" }, caption },
        silent
      );

      return sock.reply(m.from, `Story berhasil diunggah ke ${jids.length} grup dan ${statusJidList.length} kontak (${totalParticipants} anggota).${silent ? " (Tanpa tag)" : " (Mention)"}`, m);
    } else {
      await sock.uploadStory(
        statusJidList,
        q.isMedia ? { [mime]: await q.download(), caption } : { text, backgroundColor: getRandomHexColor(), font: Math.floor(Math.random() * 9) }
      );

      return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
    }
  },
  error: false,
};

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
}
