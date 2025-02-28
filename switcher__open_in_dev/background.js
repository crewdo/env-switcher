/*----------------Env to open in. -----------------*/
let OPEN_IN_ENV = 'dev';
/*----------------Env to open in. -----------------*/

let envMappings = [
	{
		platform: 'xm',
		urls: [
			{value: 'eber-xm.test', env: 'local'},
			{value: 'dev-xm.eber.co', env: 'dev'},
			{value: 'xm.eber.co', env: 'live'}
		]
	},
	{
		platform: 'app',
		urls: [
			{value: 'devwebapp.eber.test', env: 'local'},
			{value: 'devwebapp.eber.io', env: 'dev'},
			{value: 'printskitchen.eber.co', env: 'live'}
		]
	}
];

let buildUrl = (href, host) => {
	let parsedUrl = '';

	try {
		parsedUrl = new URL(href);
	} catch (e) {
		return;
	}

	parsedUrl.hostname = host;
	parsedUrl.protocol = 'https://';

	return parsedUrl.toString();
};

chrome.contextMenus.create({
	id: "xm_" + OPEN_IN_ENV,
	title: "Open in " + OPEN_IN_ENV.toUpperCase(),
	contexts: ["all"],
	documentUrlPatterns: envMappings.flatMap(mapping =>
		mapping.urls.filter(url => url.env !== OPEN_IN_ENV).map(url => 'https://' + url.value + '/*')
	),
	//Always allow these target URLs
	targetUrlPatterns: ["<all_urls>"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "xm_" + OPEN_IN_ENV) {
		let currentUrl = info.linkUrl || tab.url, parsedUrl;

		try {
			parsedUrl = new URL(currentUrl);
		} catch (e) {
			return;
		}

		let currentHostName = parsedUrl.hostname, currentHref = parsedUrl.href;
		let currentMapped = envMappings.filter(mapping =>
			mapping.urls.some(url => url.value === currentHostName)
		);

		let hostNameToOpen = currentMapped[0].urls.filter(url => url.env === OPEN_IN_ENV)[0].value;

		chrome.tabs.create({
			url: buildUrl(currentHref, hostNameToOpen)
		});
	}
});