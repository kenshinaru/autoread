import fs from 'fs';

export default {
   name: ['anticall', 'readsw', 'reactsw', 'readchat', 'autotyping', 'self', 'online'],
   command: ['anticall', 'readsw', 'reactsw', 'readchat', 'autotyping', 'self', 'online'],
   tags: 'setting',
   run: async (m, { sock, text, command, setting }) => {
      const option = text.toLowerCase()
      if (!['on', 'off'].includes(option)) return sock.reply(m.from, `🚩 Enter on/off`, m)
      setting[command] = option === 'on'
      const path = './setting.js'
      const newContent = `export default ${JSON.stringify(setting, null, 3)}\n`
      fs.writeFileSync(path, newContent, 'utf-8')
      sock.reply(m.from, `🚩 ${command} has been ${option === 'on' ? 'activated' : 'inactivated'} successfully.`, m)
   },
   owner: true
}
