export default {
   name: 'menu',
   command: ['menu'],
   tags: 'main',
   run: async (m, { sock, plugins }) => {
    try {
      const categories = Object.values(plugins).reduce((acc, menu) => {
         if (!menu.tags) return acc;
         const cmds = Array.isArray(menu.name) ? menu.name : [menu.name];
         acc[menu.tags] = acc[menu.tags] || new Set();
         cmds.forEach(cmd => acc[menu.tags].add(cmd));
         return acc;
      }, {});

      let message = "Halo! Berikut adalah daftar menu yang tersedia:\n\n" +
         Object.entries(categories)
            .sort()
            .map(([category, cmds]) =>
               `🔹 \`${category.toUpperCase()}\`\n` + 
               [...cmds].sort().map((cmd, i, arr) => 
                  ` ${i === arr.length - 1 ? '└' : '├'} ${cmd}`
               ).join('\n')
            ).join('\n\n') + '\n\n> https://github.com/kenshinaru/autoread';

      
      return m.reply({
         text: message.trim(), 
         contextInfo: {
            mentionedJid: sock.parseMentions(message),
            isForwarded: true,
            externalAdReply: {
               title: `Hi, ${m.pushName}`,
               thumbnailUrl: 'https://files.catbox.moe/26b7a0.png',
               sourceUrl: 'https://github.com/kenshinaru/autoread',
               mediaType: 1,
               previewType: 0,
               renderLargerThumbnail: true,
            },
         },
      })
      } catch (e) {
        console.log(e)
        m.reply(e)
        }
   },
   location: __filename
};
