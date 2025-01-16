import util from 'util';
import cp from 'child_process';
const { exec: _exec } = cp;
const exec = util.promisify(_exec).bind(cp);

export default {
  command: ["=>", ">", "$"],
  run: async (m, { sock, command, text }) => {
    if (!text) return
    if (command === "$") {
      let o;
      try {
        o = await exec(text.trimEnd());
      } catch (e) {
        o = e;
      } finally {
        const { stdout, stderr } = o;
        if (stdout?.trim()) {
          return sock.sendMessage(m.from, { text: stdout }, { quoted: m });
        }
        if (stderr?.trim()) {
         return sock.sendMessage(m.from, { text: stderr }, { quoted: m });
        }
      }
    }

    const code = command === "=>" ? `(async () => { return ${text} })()` : `(async () => { ${text} })()`;
    try {
      const result = await eval(code);
      if (Buffer.isBuffer(result)) {
        sock.sendMessage(m.from, { image: result }, { quoted: m });
      } else if (typeof result === "string" && /^data:image\/[a-z]+;base64,/.test(result)) {
        const base64Data = result.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        sock.sendMessage(m.from, { image: buffer }, { quoted: m });
      } else {
        sock.sendMessage(m.from, { text: util.format(result) }, { quoted: m });
      }
    } catch (e) {
      sock.sendMessage(m.from, { text: util.format(e) }, { quoted: m });
    }
  },
  noPrefix: true,
};