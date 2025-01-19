# WhatsApp AutoRead Story Bot

Bot WhatsApp self untuk membaca status/story secara otomatis dengan berbagai fitur tambahan.

## 📋 Fitur
- Auto Read Story.
- Anti Call (blokir panggilan).
- Reaksi otomatis ke story.
- Kontrol status online.
- Reaksi dengan emoji khusus.
- Reaksi story && Read story
- Upload story (image/text/audio)
- Get story
- List story
- Eval / Exec

## 👾 Commmand
- .upsw (upload story whatsapp)
- .listsw (menampilkan list story tersimpan)
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
  online: false,  // Status online
  emojis: ["❤️", "💛", "💚", "💙", "💜"], // Emoji reaksi
};
```

Made with ❤️ by Luthfi Joestars
