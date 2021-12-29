//import { create } from 'venom-bot';
const venom = require('../venom/dist/');
import { stages, getStage } from './stages.js';

venom.create(
	//session
	'Bot-Whatsapp', //Pass the name of the client you want to start the bot
	//catchQR
	(base64Qrimg, asciiQR, attempts, urlCode) => {
		//
		console.log('- Número de tentativas de ler o qr-code:', attempts);
		//
		console.log("- Captura do QR-Code");
		//console.log(base64Qrimg);
		//
		console.log("- Captura do asciiQR");
		// Registrar o QR no terminal
		//console.log(asciiQR);
		//
		console.log("- Captura do urlCode");
		// Registrar o QR no terminal
		//console.log(urlCode);
		//
		var qrCode = base64Qrimg.replace('data:image/png;base64,', '');
		const imageBuffer = Buffer.from(qrCode, 'base64');
		//
	},
	// statusFind
	(statusSession, session) => {
		console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser
		//Create session wss return "serverClose" case server for close
		console.log('Session name: ', session);
	},
	// options
	{
		deviceName: "Bot-Whatsapp",
		multidevice: false, // for version not multidevice use false.(default: true)
		folderNameToken: 'tokens', //folder name when saving tokens
		mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
		headless: true, // Headless chrome
		devtools: false, // Open devtools by default
		useChrome: true, // If false will use Chromium instance
		debug: false, // Opens a debug session
		logQR: true, // Logs QR automatically in terminal
		browserWS: '', // If u want to use browserWSEndpoint
		browserArgs: [
			'--log-level=3',
			'--no-default-browser-check',
			'--disable-site-isolation-trials',
			'--no-experiments',
			'--ignore-gpu-blacklist',
			'--ignore-ssl-errors',
			'--ignore-certificate-errors',
			'--ignore-certificate-errors-spki-list',
			'--disable-gpu',
			'--disable-extensions',
			'--disable-default-apps',
			'--enable-features=NetworkService',
			'--disable-setuid-sandbox',
			'--no-sandbox',
			// Extras
			'--disable-webgl',
			'--disable-threaded-animation',
			'--disable-threaded-scrolling',
			'--disable-in-process-stack-traces',
			'--disable-histogram-customizer',
			'--disable-gl-extensions',
			'--disable-composited-antialiasing',
			'--disable-canvas-aa',
			'--disable-3d-apis',
			'--disable-accelerated-2d-canvas',
			'--disable-accelerated-jpeg-decoding',
			'--disable-accelerated-mjpeg-decode',
			'--disable-app-list-dismiss-on-blur',
			'--disable-accelerated-video-decode',
			'--disable-infobars',
			'--window-position=0,0',
			'--ignore-certifcate-errors',
			'--ignore-certifcate-errors-spki-list',
			'--disable-dev-shm-usage',
			'--disable-gl-drawing-for-tests',
			'--incognito',
			'--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',
			//Outros
			'--disable-web-security',
			'--disable-web-security',
			'--aggressive-cache-discard',
			'--disable-cache',
			'--disable-application-cache',
			'--disable-offline-load-stale-cache',
			'--disk-cache-size=0',
			'--disable-background-networking',
			'--disable-sync',
			'--disable-translate',
			'--hide-scrollbars',
			'--metrics-recording-only',
			'--mute-audio',
			'--no-first-run',
			'--safebrowsing-disable-auto-update',
		], //Original parameters  ---Parameters to be added into the chrome browser instance
		puppeteerOptions: {}, // Will be passed to puppeteer.launch
		disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
		disableWelcome: true, // Will disable the welcoming message which appears in the beginning
		updatesLog: true, // Logs info updates automatically in terminal
		autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
		createPathFileToken: false, // creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
		chromiumVersion: '818858', // Version of the browser that will be used. Revision strings can be obtained from omahaproxy.appspot.com.
		addProxy: [''], // Add proxy server exemple : [e1.p.webshare.io:01, e1.p.webshare.io:01]
		userProxy: '', // Proxy login username
		userPass: '' // Proxy password
	},
	// BrowserInstance
	(browser, waPage) => {
		console.log('Browser PID:', browser.process().pid);
		waPage.screenshot({ path: 'screenshot.png' });
	}
).then(async (client) => {
	var browserSessionToken = await client.getSessionTokenBrowser();
	console.log("- Token venom:\n", JSON.parse(JSON.stringify(browserSessionToken)));
	start(client);
}).catch(async (erro) => {
	console.error(erro);
});

async function start(client) {
	await client.onMessage(async (message) => {
		console.log('Menssagem recebida');
		if (message.isGroupMsg === false) {
			try {
				const currentStage = getStage({ from: message.from });
				//
				const messageResponse = stages[currentStage].stage.exec({
					from: message.from,
					message: message.body,
					client,
				});
				//
				if (messageResponse) {
					await client.sendText(message.from, messageResponse).then((result) => {
						//console.log('Result: ', result); //return object success
						console.log('Menssagem enviada com sucesso para: ', message.from); //return object success
					}).catch(async (erro) => {
						console.error('Error when sending: ', erro); //return object error
					});
				}
			} catch (error) {
				client.close().then((result) => {
					//console.log('Result: ', result); //return object success
					console.log('Sessão fechada com sucesso: ', result); //return object success
				}).catch(async (erro) => {
					console.error('Error when close: ', erro); //return object error
				});
			}
		}
	});
}
//
process.stdin.resume(); //so the program will not close instantly
//
async function exitHandler(options, exitCode) {
	if (options.cleanup) {
		console.log("- Cleanup");
	}
	if (exitCode || exitCode === 0) {
		console.log(exitCode);
	}
	//
	if (options.exit) {
		process.exit();
	}
} //exitHandler
//do something when sistema is closing
process.on('exit', exitHandler.bind(null, {
	cleanup: true
}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
	exit: true
}));
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {
	exit: true
}));
process.on('SIGUSR2', exitHandler.bind(null, {
	exit: true
}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
	exit: true
}));
