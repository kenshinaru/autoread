import fs from 'fs';

export default {
   name: ['anticall', 'prefix', 'readsw', 'reactsw', 'readchat', 'autotyping', 'self', 'online'],
   command: ['anticall', 'prefix', 'readsw', 'reactsw', 'readchat', 'autotyping', 'self', 'online'],
   tags: 'on/off',
   run: async (m, { sock, text, command, setting }) => {
      if (!text) {
         let allStatus = Object.keys(setting)
            .filter(key => typeof setting[key] === 'boolean')
            .map(key => `- ${key} = ${setting[key] ? 'ON' : 'OFF'}`)
            .join('\n');
         return sock.reply(m.from, `Masukkan ON/OFF\n\nCurrent all status:\n${allStatus}`, m);
      }

      if (!['on', 'off'].includes(text.toLowerCase())) {
         return sock.reply(m.from, `Masukkan ON/OFF`, m);
      }

      setting[command] = text.toLowerCase() === 'on';
      const path = './setting.js';
      const newContent = `export default ${JSON.stringify(setting, null, 3)}\n`;
      fs.writeFileSync(path, newContent, 'utf-8');

      sock.reply(m.from, `Berhasil ${text.toLowerCase() === 'on' ? 'Mengaktifkan' : 'Menonaktifkan'} ${command}`, m);
   },
   owner: true
};
