export default {
	name: "Testing",
	command: ["test", "testing"],
	models: "%prefix%command",
	run: async(m, { sock }) => {
		await m.reply(`Halo ${m.pushName} aya naon? :D`);
	}
}