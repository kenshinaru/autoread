export default {
   name: 'menu',
   command: ['menu'],
   tags: 'main',
   run: async (m, { sock, plugins }) => {
      const categories = {};
      const commands = [];

      Object.values(plugins).forEach(menu => {
         if (!menu.tags) return;

         switch (menu.name?.constructor.name) {
            case 'Array':
               commands.push(...menu.name);
               break;
            case 'String':
               commands.push(menu.name);
               break;
         }

         categories[menu.tags] = categories[menu.tags] || new Set();
         const menuCommands = menu.name?.constructor.name === 'Array' ? menu.name : [menu.name];
         menuCommands.forEach(cmd => categories[menu.tags].add(cmd));
      });

      let message = "Halo! Berikut adalah daftar menu yang tersedia:\n\n";
      message += Object.keys(categories)
         .sort()
         .map(category => {
            const commands = [...categories[category]]
               .sort()
               .map((cmd, i, arr) =>
                  ` ${i === arr.length - 1 ? '└' : '├'} ${cmd}`
               ).join('\n');
            return `🔹 \`${category.toUpperCase()}\`\n${commands}`;
         })
         .join('\n\n');

      message += '\n\n> https://github.com/kenshinaru/autoread';
      return sock.sendMessage(m.from, { text: message }, { quoted: m });
   },
   location: __filename
};
