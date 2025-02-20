import fs from 'fs';

export default {
   name: ['getkontak'],
   command: ['getkontak'],
   tags: 'owner',
   run: async (m, { sock, store }) => {
      let contacts = store.contacts;
      if (Object.keys(contacts).length === 0) return sock.reply(m.from, 'Tidak ada kontak tersimpan.', m);

      let vcfData = Object.values(contacts)
         .map(v => {
            let name = v.notify || v.verifiedName
            let phone = v.id.split('@')[0]
            return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEND:VCARD`;
         })
         .join('\n');

      let filePath = './contacts.vcf';
      fs.writeFileSync(filePath, vcfData);

      await m.reply({ document: fs.readFileSync(filePath), mimetype: 'text/vcard', fileName: 'contacts.vcf' });

      fs.unlinkSync(filePath);
   },
   owner: false
};
