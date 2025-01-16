export default {
  name: "upsw",
  command: ["upsw"],
  tags: "owner",
  run: async (m, { sock, text, store }) => {
    const teks = text ? text : m.quoted?.body || "";

    if (m.quoted?.type) {
      const typeMap = {
        audioMessage: { key: "audio", mimetype: "audio/mpeg" },
        videoMessage: { key: "video", mimetype: "video/mp4" },
        imageMessage: { key: "image", mimetype: "image/jpeg" },
        extendedTextMessage: { key: "text" },
        conversation: { key: "text" },
      };

      const typeInfo = typeMap[m.quoted.type];
      if (!typeInfo) return sock.reply(m.from, "Unsupported media type.", m);

      const doc = {};
      const buffer = await m.quoted.download(); // Ambil buffer media

      if (typeInfo.key === "audio") {
        doc.audio = buffer;
        doc.mimetype = typeInfo.mimetype;
      } else if (typeInfo.key === "video") {
        doc.video = buffer;
        doc.mimetype = typeInfo.mimetype;
        doc.caption = teks;
      } else if (typeInfo.key === "image") {
        doc.image = buffer;
        doc.mimetype = typeInfo.mimetype;
        doc.caption = teks;
      } else if (typeInfo.key === "text") {
        doc.text = teks;
      }

      try {
        const statusJidList = [
          ...Object.values(store.contacts)
            .map((contact) => contact?.id)
            .filter((id) => id && id.endsWith("@s.whatsapp.net")),
        ];

        await sock.sendMessage("status@broadcast", doc, {
          backgroundColor: getRandomHexColor(),
          font: Math.floor(Math.random() * 9),
          statusJidList,
        });

        await sock.reply(m.from, `Status uploaded to ${statusJidList.length} contacts`, m);
      } catch (e) {
        await sock.reply(m.from, `Failed to upload status: ${e.message}`, m);
      }
    } else {
      return sock.reply(m.from, "No media provided.", m);
    }
  },
  owner: true,
  wait: true,
  error: false,
};

function getRandomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}