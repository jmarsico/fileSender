var client = require('scp2');
var chokidar = require('chokidar');
var fs = require("fs");



// var udpPort = new osc.UDPPort({
//     localAddress: "0.0.0.0",
//     localPort: 57121,
// });

// udpPort.open();
//

var file = fs.readFileSync("config.json");
var config = JSON.parse(file);

var watchPath = config["watchPath"];

var watcher = chokidar.watch(watchPath, {
  ignored: /(^|[\/\\])\../,
  persistent: true
});

var log = console.log.bind(console);


//setup the listener
watcher
	.on('add', path => {
		// stuff to do when a new file comes in
		log("new file: " + path)
		var newFile = "";
		newFile += path;

		var file = fs.readFileSync("config.json");
		var config = JSON.parse(file);

		var pathOnPi = config["path"];

		
		
		var numPis = config["rpis"].length;
		
		for(var i = 0; i < numPis; i++){
			var piPath = 'pi:raspberry@';
			piPath += config["rpis"][i];
			piPath += ":";
			piPath += pathOnPi;

			log(piPath);


			client.scp(newFile, piPath, function(err){
				log(err);
			});
			
		}
	});