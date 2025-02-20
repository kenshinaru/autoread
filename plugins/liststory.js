export default {
   name: 'listsw',
   command: ['listsw'],
   tags: 'owner',
   run: async (m, { sock }) => {
      try {
    sock.story = sock.story ? sock.story : []
         const stories = sock.story
         if (stories.length < 1) return sock.reply(m.from, `Belum ada list story tersimpan di database.`, m)
          
         let storyList = stories.map((v, i) => 
            `${i + 1}. ${v.msg.pushName} - ${
               /video/i.test(v.msg.msg?.mimetype) 
                  ? 'Video' 
                  : /image/i.test(v.msg.msg?.mimetype) 
                  ? 'Image' 
                  : 'Text'
            }`
         ).join('\n');
         sock.reply(m.from, `📜 List of All Stories:\n\n${storyList}\n\nNote: reply pesan ini lalu \`.getsw <number>\` untuk mendapatkan story`, m);
      } catch (e) {
         console.error(e)
         sock.reply(m.from, `Tidak bisa menampilkan story.`, m);
      }
   },
   location: __filename,
   owner: true
};
