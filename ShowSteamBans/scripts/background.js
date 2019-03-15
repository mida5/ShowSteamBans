
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    if (request.contentScriptQuery == "getResult")
	{
		getResult( request.idsArr, sendResponse );
		return true;  // Will respond asynchronously.
    }
});

function getResult(idsArr, sendResponse)
{
	// apikey from internet, not my
	var apikey = '5DA40A4A4699DEE30C1C9A7BCE84C914';
	var ids = idsArr.join(',');
	var url = `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${apikey}&steamids=${ids}`;

	fetch(url).then(result =>
	{
		if (result.ok)
			return result.json();

		throw Error(`Code ${result.status}. ${result.statusText}`);

	}).then(json => sendResponse(json.players));
}