import axios from 'axios';

async function fetch(url) {
   try {
      const id = url.split(/track\/|playlist\//)[1];

      if (/playlist/.test(url)) {
         const { data } = await axios.get(`https://api.fabdl.com/spotify/playlist/${id}`, {
            headers: {
               Accept: "*/*",
               "Content-Type": "application/json",
               "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
               Origin: "https://fabdl.com",
               Referer: "https://fabdl.com/",
               "Referrer-Policy": "strict-origin-when-cross-origin",
            }
         });

         return data.result?.length ? {
            status: true,
            tracks: data.result.map(v => ({
               title: v.name,
               artists: v.artists,
               album: v.album,
               cover: v.image,
               duration: v.duration_ms,
               url: `https://open.spotify.com/track/${v.id}`
            }))
         } : { status: false, msg: 'Playlist tidak ditemukan' };
      }

      const { data: info } = await axios.get(`https://api.fabdl.com/spotify/get?url=${url}`, {
         headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
         }
      });

      const { gid, id: trackId, name, image, duration_ms } = info.result;

      const { data: download } = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${gid}/${trackId}`, {
         headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
         }
      });

      return download.result.download_url ? {
         status: true,
         data: {
            title: name,
            cover: image,
            duration: duration_ms,
            download: `https://api.fabdl.com${download.result.download_url}`
         }
      } : { status: false, msg: 'Gagal mendapatkan link download' };

   } catch (error) {
      return { status: false, msg: error.message };
   }
};

async function search(query, type = 'track', limit = 20) {
   try {
      const { data: creds } = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
         headers: {
            Authorization: 'Basic ' + Buffer.from('4c4fc8c3496243cbba99b39826e2841f' + ':' + 'd598f89aba0946e2b85fb8aefa9ae4c8').toString('base64')
         }
      });
      if (!creds.access_token) return { status: false, msg: "Can't generate token!" };

      const { data } = await axios.get(`https://api.spotify.com/v1/search?query=${query}&type=${type}&limit=${limit}`, {
         headers: { Authorization: `Bearer ${creds.access_token}` }
      });
      return data.tracks.items.length ? {
         status: true,
         data: data.tracks.items.map(v => ({
            title: v.artists[0].name + ' - ' + v.name,
            duration: Math.floor(v.duration_ms / 60000) + ':' + ((v.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0'),
            url: v.external_urls.spotify
         }))
      } : { status: false, msg: 'Music not found!' };
   } catch (e) {
      return { status: false, msg: e.message };
   }
};

export default {
   name: ['play'],
   command: ['putar', 'play'],
   tags: 'owner',
   run: async (m, { sock, text, prefix, command }) => {
      try {
         if (!text) return sock.reply(m.from, `Contoh: ${prefix + command} lathi`, m);
         m.reply({ react: { text: '🕒', key: m.key } });
         const pler = await search(text);
         const json = await fetch(pler.data[0].url);
         if (!json) return m.reply({ react: { text: '❌', key: m.key } });
   

         m.reply({ react: { text: '✅', key: m.key } });
         m.reply({
            audio: { url: json.data.download },
            mimetype: "audio/mpeg",
            waveform: [0,3,58,44,35,32,2,4,31,35,44,34,48,13,0,54,49,40,1,44,50,51,16,0,3,40,39,46,3,42,38,44,46,0,0,47,0,0,46,19,20,48,43,49,0,0,39,40,31,18,29,17,25,37,51,22,37,34,19,11,17,12,16,19],
            contextInfo: {
               externalAdReply: {
                  thumbnailUrl: json.data.cover,
                  title: json.data.title,
                  body: `Duration ${json.data.duration}`,
                  sourceUrl: pler.data[0].url,
                  renderLargerThumbnail: true,
                  mediaType: 1
               }
            }
         });

      } catch (e) {
         console.error(e)
         sock.reply(m.from, JSON.stringify(e, null, 2), m);
      }
   },
   error: false,
};


