Number.prototype.clamp = function(min, max) { return Math.min(Math.max(this, min), max);
};
Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize)
	{
        var arr = this;
        return Array(Math.ceil(arr.length / chunkSize)).fill().map( (_,i) => arr.slice(i * chunkSize, i * chunkSize + chunkSize) );
    }
});

// apikey from internet, not my
var apikey = '5DA40A4A4699DEE30C1C9A7BCE84C914';
var list = {};
document.querySelectorAll('.persona').forEach(persona => { list[persona.dataset.steamid] = persona; });//console.log( persona );
//console.log( list );

// split by chunks, url will be too long
Object.keys(list).chunk(20).forEach(getResult);

function getResult(idsArr)
{
	var ids = idsArr.join(',');
	var url = `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${apikey}&steamids=${ids}`;

	fetch(url).then(result =>
	{
		if (result.ok)
			return result.json();

		throw Error(`Code ${result.status}. ${result.statusText}`);

	}).then(json => json.players.forEach(colorPersona));
}

function colorPersona(player)
{
	var personaElem = $( list[player.SteamId] );
	// colder in 1 month
	var n = (1 - player.DaysSinceLastBan / 30).clamp(0, 1);
	var c = (64 + n * 192) >> 0;

	if(player.VACBanned)
		//personaElem.addClass( "VACBanned" );
		personaElem.css("background-color", `rgb(${c},0,0)`);

	if(player.NumberOfGameBans > 0)
		//personaElem.addClass( "GameBan" );
		personaElem.css("background-color", `rgb(${c},${c},0)`);
}
