export default {
   command: ['listsw'],
   tags: 'owner',
   run: async (m, { sock }) => {
      try {
    sock.story = sock.story ? sock.story : []
         const stories = sock.story
         if (stories.length < 1) return sock.reply(m.from, `🚩 No stories available in the database.`, m)
          
          
         let storyList = stories.map((v, i) => 
            `${i + 1}. ${v.msg.pushName} - ${
               /video/i.test(v.msg.mimetype) 
                  ? 'Video' 
                  : /image/i.test(v.msg.mimetype) 
                  ? 'Image' 
                  : 'Text'
            }`
         ).join('\n');
         sock.reply(m.from, `📜 List of All Stories:\n\n${storyList}\n\nNote: reply this message then \`.getsw <number>\` to get the story`, m);
      } catch (e) {
         console.error(e)
         sock.reply(m.from, `🚩 Can't retrieve stories.`, m);
      }
   },
   location: __filename
};