export default {
  name: "upsw",
  command: ["upsw"],
  tags: "owner",
  run: async (m, { sock, text, store }) => {
  
    const statusJidList = [
      ...Object.values(store.contacts)
        .map((contact) => contact?.id)
        .filter((id) => id && id.endsWith("@s.whatsapp.net")),
    ]
    
    if (!m.isMedia && text) {
      await sock.sendMessage(
        "status@broadcast",
        { 
          text: text, 
          backgroundColor: getRandomHexColor(), 
          font: Math.floor(Math.random() * 9) 
        },
        { statusJidList }
      );
      return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
    } else if (/image/i.test(m.type)) {
      const buffer = await m.download();
      await sock.sendMessage(
        "status@broadcast",
        { 
          image: buffer, 
          mimetype: "image/jpeg", 
          caption: text || "" 
        },
        { statusJidList }
      );
      return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
    } else if (/video/i.test(m.type)) {
      const buffer = await m.download();
      await sock.sendMessage(
        "status@broadcast",
        { 
          video: buffer, 
          mimetype: "video/mp4", 
          caption: text || "" 
        },
        { statusJidList }
      );
      return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
    } else if (/audio/i.test(m.quoted?.type)) {
      const buffer = await m.download();
      await sock.sendMessage(
        "status@broadcast",
        { 
          audio: buffer, 
          mimetype: "audio/mpeg" 
        },
        { statusJidList }
      );
      return sock.reply(m.from, `Status berhasil diunggah ke ${statusJidList.length} kontak.`, m);
    } else {
      return sock.reply(m.from, "Harap sertakan teks atau media dalam pesan Anda.", m);
    }
  },
  error: false,
}

function getRandomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}
