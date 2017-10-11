var client = require('scp2');
var chokidar = require('chokidar');
var fs = require("fs");




var watcher = chokidar.watch('./tmp', {
  ignored: /(^|[\/\\])\../,
  persistent: true
});

var log = console.log.bind(console);


//setup the listener
watcher
	.on('add', path => {
		// stuff to do when a new file comes in
		log("new file: " + path)
		var newFile = JSON.stringify(path);

		var file = fs.readFileSync("config.json");
		var pijson = JSON.parse(file);

		var pathOnPi = pijson["path"];

		
		
		var numPis = pijson["rpis"].length;
		
		for(var i = 0; i < numPis; i++){
			var piPath = 'pi:raspberry@';
			piPath += pijson["rpis"][i];
			piPath += pathOnPi;

			log(piPath);


			client.scp(newFile, piPath, function(err){
				log(newFile);
			});
			
		}
	});