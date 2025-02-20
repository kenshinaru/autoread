export default {
   name: ['rvo'],
   command: ['rvo', 'readviewonce'],
   tags: 'main',
   run: async (m, { sock, q }) => {
      if (!q.msg.viewOnce) return sock.reply(m.from, 'Reply to a message with .rvo', m)
        q.msg.viewOnce = false
        await m.reply({ forward: q, force: true })
   },
   owner: false
}
