export function removeAcents(text) {
	return (typeof text === "string") ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : text;
}