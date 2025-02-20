export default {
   name: ['tourl'],
   command: ['tourl', 'tolink'],
   tags: 'main',
   run: async (m, { q, sock }) => {
      let mime = (q.msg || q).mimetype || '';
      if (/image\/(png|jpe?g|webp)|video\/mp4|audio\/(mpeg|opus)/.test(mime)) {
                        let img = await q.download();
                        const json = await sock.uploadFile(img);
                        sock.reply(m.from, json, m);
                    } else {
                        return sock.reply(m.chat, `Kirim Gambar dengan caption .tourl atau reply gambar dengan command ${prefix + command}`, m);
                    }
   },
   owner: false,
   wait: true
}

