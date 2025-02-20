# WhatsApp AutoRead Story Bot

Bot WhatsApp self untuk membaca status/story secara otomatis dengan berbagai fitur tambahan.

## 📋 Fitur
- Auto Read Story.
- Anti Call (blokir panggilan).
- Reaksi otomatis ke story.
- Status online.
- Reaksi dengan emoji khusus.
- Reaksi story && Read story
- Upload story (image/text/audio)
- Get story
- List story
- Eval / Exec

## 👾 Commmand
- .upsw (upload story whatsapp bisa tag gc)
- .listsw (menampilkan list story tersimpan)
- .listgroups (menampilkan seluruh groups yang bot join)
- .getsw (mengambil salah satu story tersimpan)
- =>, >, $ (exec dan eval command)

## 🛠️ Konfigurasi
Edit file `setting.js`:
```javascript
export default {
  anticall: true, // Anti Call
  readsw: true,   // Auto Read Story
  reactsw: false, // React otomatis
  readchat: false, // read chat otomatis
  autotyping: true, // auto mengetik jika ada pesan
  self: true, // mode self atau public
  online: false,  // Status online
  prefix: true //biarin true jika ingin pake prefix
  blacklist: [] //pengecualian/skip untuk readstory/reactstory
  emoji: ["❤️", "💛", "💚", "💙", "💜"], // Emoji reaksi
  pairing: {
    state: true, // biarin true kalo mau pake pairing code
    number: 6281310994964 // nomer yang akan dijadikan bot
  },
};
```

Made with ❤️ by Luthfi Joestars
