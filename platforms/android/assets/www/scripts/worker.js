/*
This file forks out a web worker to continuously fetch the data from the PI system
*/
self.addEventListener('message', function(e){
	setInterval(function(){ self.postMessage(e.data); }, 1000);       
}, false);