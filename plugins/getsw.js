export default {
   command: ['getsw', 'getstory'],
   run: async (m, {sock, text}) => {
      try {
         sock.story = sock.story ? sock.story : [];
         const stories = sock.story
         if (/📜 List of All Stories/i.test(m.quoted?.body)) {
        const index = parseInt(text) - 1;
        if (isNaN(index) || index < 0 || index >= stories.length) return sock.sendMessage(m.from, { text: '🚩 Invalid story number.' }, { quoted: m });
            await sock.sendMessage(m.from, { forward: stories[index].msg });
            return;
         }
         let input = text ? text : m.quoted ? m.quoted.sender : m.mentions.length > 0 ? m.mentioneJid[0] : false
         if (!input) return sock.sendMessage(m.from, { text: '🚩 Mentions, reply, or input a target number.' }, { quoted: m })
         let p = await sock.onWhatsApp(input.trim());
         if (p.length === 0) return sock.sendMessage(m.chat, { text: '🚩 Number not registered on WhatsApp.' }, { quoted: m });
         let jid = sock.decodeJid(p[0].jid);
         const userStories = stories.filter(v => v.jid === jid);
         if (userStories.length < 1) return sock.sendMessage(m.from, { text: '🚩 She/He has no story.' }, { quoted: m });
         for (let v of userStories) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            await sock.sendMessage(m.from, { forward: v.msg });
         }
      } catch (e) {
         console.error(e)
         sock.sendMessage(m.from, { text: '🚩 Can\'t get stories.' }, { quoted: m });
      }
   },
   location: __filename
};