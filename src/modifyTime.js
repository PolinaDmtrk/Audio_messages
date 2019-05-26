export function modifyTime(time) {
	let modifiedTme = time + "";
	if (modifiedTme.length < 2) {
		modifiedTme = "0" + modifiedTme;
	}
	return modifiedTme;
}