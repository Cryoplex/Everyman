function addToLog(text) {
	lastlog.push(text);
	if (lastlog.length > 10) lastlog.splice(0, 1);

	debug_interns.innerHTML = lastlog.join('<br>');
}