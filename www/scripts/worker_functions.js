/* Class to fork out a worker thread */
var worker;
var disableCounter; //Disable the Slider UI after certain Time TBD
var count = 0;
var errorCount = 0;

//Start the Thread
function startWebWorker(){
    //worker thread to call service
	try{
		if(typeof(w) == "undefined") {
			worker = new Worker('scripts/worker.js');
			worker.addEventListener('message', function(e){
				if(userModeChanging == false){
					if(connectionStatus == true){
						getAllParams();
					}
				}
				count++;
				if(count == 60){
					if((userLatitude != undefined) && (userLongitude != undefined)){
						getWeather();
					}else{
						getLocation();
					}
				}
			}, false);
			worker.postMessage('Thermostat Updating'); 
		}
	}catch(error){
		alert("Not connected to thermostat!")
	}
}

//Stop the Thread
function stopWorker() {
	if(typeof(worker) != "undefined") {
		worker.terminate();
		worker = undefined;
		setTimeout(function(){ 
			startWebWorker();
		}, 3000);
	}else{ return; }
}

function getAllParams(){
	$.ajax({
		url: 'http://'+ipAddress+'/Get_All',
		method : 'GET',
		success: function( data, textStatus, jQxhr ){
			//alert("Success");
			//alert(data);
			connectionStatus = true;
			errorCount = 0;
			onConnected();
			if(data == "Unknown Token"){
				//alert(data);
			}else{
				//alert(data);
				var result = hex2char(data);
				if(userModeChanging == false){
					updateAllAtStart(result);
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			//alert("Error: "+errorThrown);
			connectionStatus = false;
			setTimeout(function(){
				connectionStatus = true;
			}, 1500);
			errorCount++;
			if(errorCount > 5){
				errorCount = 0;
				onConnectionLost();
			}
		},
		//timeout: 3000
	});
}

function hex2char(data){
	var retData = null;
	var thermoDateTime;
	var strArr = data.split(',');
	var indexOfManualOverRide = false;
	for(var i=0;i<strArr.length;i++){
		if(i == (strArr.length-2)){ //Manual Override
			thermoDateTime = strArr[i].split(':');
			if(thermoDateTime != null || thermoDateTime != null){
				if(thermoDateTime.length > 1){
					//Time
					indexOfManualOverRide = true;
				}
			}
		}
		
		if((i == (strArr.length-2)) && (indexOfManualOverRide == true)){
			thermoDateTime = strArr[i].split(':');
			for(var j=0;j<thermoDateTime.length;j++){
				thermoDateTime[j] = (parseInt(thermoDateTime[j], 16)).toString();
			}
			strArr[i] = thermoDateTime.join(':');
		}else if(i == (strArr.length-1)){
			if(indexOfManualOverRide == true){ //Manual Override Parameter
				strArr[i] = (parseInt(strArr[i], 16)).toString();
			}else{ //Time
				thermoDateTime = strArr[i].split(':');
				for(var j=0;j<thermoDateTime.length;j++){
					thermoDateTime[j] = (parseInt(thermoDateTime[j], 16)).toString();
				}
				strArr[i] = thermoDateTime.join(':');
			}
		}
		else
		{
			strArr[i] = (parseInt(strArr[i], 16)).toString();
		}
	}
	retData = strArr.join(',');
	//alert(retData);
	return retData;
}
