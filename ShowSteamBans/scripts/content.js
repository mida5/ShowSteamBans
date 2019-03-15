Number.prototype.clamp = function(min, max) { return Math.min(Math.max(this, min), max);
};

var arr = [];
$('.persona').each((i,persona) =>
{
	arr.push(persona.dataset.steamid);
	// split by chunks, url will be too long
	if( i % 20 == 19 )
		chrome.runtime.sendMessage({contentScriptQuery: "getResult", idsArr: arr.splice(0)}, players => players.forEach(colorPersona));
});//console.log( persona );

function colorPersona(player)
{
	var personaElem = $(`.persona[data-steamid="${player.SteamId}"]`);

	// colder in 1 month
	var n = (1 - player.DaysSinceLastBan / 30).clamp(0, 1);
	var c = (64 + n * 192) >> 0;

	if(player.NumberOfGameBans > 0)
		//personaElem.addClass( "GameBan" );
		personaElem.css("background-color", `rgb(${c},${c},0)`);

	if(player.VACBanned)
		//personaElem.addClass( "VACBanned" );
		personaElem.css("background-color", `rgb(${c},0,0)`);
}
