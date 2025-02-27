export default {
   name: "menu",
   command: ["menu"],
   tags: "main",
   run: async (m, { sock, plugins }) => {
      try {
         let cat = {};
         Object.values(plugins).forEach(p => p.tags && (cat[p.tags] ??= new Set()).add(...[].concat(p.name)));

         m.reply({
            text:
               "Halo! Berikut daftar menu:\n\n" +
               Object.entries(cat)
                  .map(([c, cmds]) => `🔹 \`${c.toUpperCase()}\`\n${[...cmds].map((cmd, i, a) => ` ${i == a.length - 1 ? "└" : "├"} ${cmd}`).join``}`)
                  .join`\n\n` +
               "\n\n> https://github.com/kenshinaru/autoread",
            contextInfo: {
               mentionedJid: [],
               externalAdReply: {
                  title: `Hi, ${m.pushName}`,
                  thumbnailUrl: "https://files.catbox.moe/26b7a0.png",
                  sourceUrl: "https://github.com/kenshinaru/autoread",
                  mediaType: 1,
                  previewType: 0,
                  renderLargerThumbnail: true,
               },
            },
         });
      } catch (e) {
         console.log(e), m.reply(e);
      }
   },
   location: __filename,
};
