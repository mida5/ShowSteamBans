Number.prototype.clamp = function(min, max) { return Math.min(Math.max(this, min), max);
};
Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize)
	{
        var that = this;
        return Array(Math.ceil(that.length/chunkSize)).fill().map(function(_,i){ return that.slice(i * chunkSize, i * chunkSize + chunkSize);
        });
    }
});

// apikey from internet, not my
var apikey = '5DA40A4A4699DEE30C1C9A7BCE84C914';
var list = {};
document.querySelectorAll('.persona').forEach(persona => { list[persona.dataset.steamid] = persona; });//console.log( persona );
//console.log( list );

Object.keys(list).chunk(20).forEach(getReult);

function getReult(idsArr)
{
	//var ids = Object.keys(idsArr).join(',');
	var ids = idsArr.join(',');//
	var url = `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${apikey}&steamids=${ids}`;

	fetch(url).then(res =>
	{
		if (res.ok)
			return res.json();

		throw Error(`Code ${res.status}. ${res.statusText}`);

	}).then(json => json.players.forEach(colorProfile));
}

function colorProfile(player)
{
	var playerElem = $( list[player.SteamId] );
	// colder in 1 month
	var n = (1 - player.DaysSinceLastBan / 30).clamp(0, 1);
	var c = (64 + n * 192) >> 0;

	if(player.VACBanned)
		//playerElem.addClass( "VACBanned" );
		playerElem.css("background-color", `rgb(${c},0,0)`);

	if(player.NumberOfGameBans > 0)
		//playerElem.addClass( "GameBan" );
		playerElem.css("background-color", `rgb(${c},${c},0)`);
}
