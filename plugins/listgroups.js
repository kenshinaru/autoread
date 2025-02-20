export default {
   name: ['listgroups'],
   command: ['groups', 'listgroups'],
   tags: 'owner',
   run: async (m, { sock }) => {
      try {
         let groupList = async () => Object.entries(await sock.groupFetchAllParticipating()).map(entry => entry[1])
         let groups = await groupList()
         let text = `Bot saat ini bergabung di ${groups.length} grup.\n\n`

         const formatDate = timestamp => {
            return new Intl.DateTimeFormat('id-ID', {
               day: '2-digit',
               month: '2-digit',
               year: '2-digit',
               hour: '2-digit',
               minute: '2-digit',
               second: '2-digit',
               timeZone: 'Asia/Jakarta'
            }).format(timestamp)
         }

         groups.forEach(x => {
            text += `◦ *${x.subject}*\n`
            text += `  ↳ ID Grup: ${x.id}\n`
            text += `  ↳ Anggota: ${x.participants.length}\n`
            text += `  ↳ Dibuat: ${formatDate(x.creation * 1000)}\n\n`
         })

         sock.reply(m.from, text.trim(), m)
      } catch (e) {
         sock.reply(m.from, JSON.stringify(e, null, 2), m)
      }
   }
}
