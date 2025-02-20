import fs from 'fs';

export default {
   name: ['anticall', 'readsw', 'reactsw', 'readchat', 'autotyping', 'self', 'online', 'blacklist'],
   command: ['anticall', 'readsw', 'reactsw', 'readchat', 'autotyping', 'self', 'online', '+blacklist', '-blacklist'],
   tags: 'setting',
   run: async (m, { sock, text, command, setting }) => {
      if (command === '+blacklist' || command === '-blacklist') {
         if (!text) return sock.reply(m.from, `Masukkan nomor yang ingin ${command === '+blacklist' ? 'ditambahkan' : 'dihapus'} dari blacklist.`, m);

         let p = await sock.onWhatsApp(text.trim());
         if (p.length == 0) return sock.reply(m.from, `🚩 Nomor tidak valid.`, m);

         let jid = sock.decodeJid(p[0].jid);
         let number = jid.replace(/@.+/, '');

         setting.blacklist = setting.blacklist || [];

         if (command === '+blacklist') {
            if (setting.blacklist.includes(number)) return sock.reply(m.from, `Nomor sudah ada di blacklist.`, m);
            setting.blacklist.push(number);
            sock.reply(m.from, `Nomor ${number} berhasil ditambahkan ke blacklist.`, m);
         } else {
            if (!setting.blacklist.includes(number)) return sock.reply(m.from, `Nomor tidak ada di blacklist.`, m);
            setting.blacklist = setting.blacklist.filter(n => n !== number);
            sock.reply(m.from, `Nomor ${number} berhasil dihapus dari blacklist.`, m);
         }

         const path = './setting.js';
         const newContent = `export default ${JSON.stringify(setting, null, 3)}\n`;
         fs.writeFileSync(path, newContent, 'utf-8');
         return;
      }

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
