var dateTypeSelected = {START: 0, END: 1};
var currentDateType = null;

var scheduleType = {RANGE: 0, REPEAT: 1, properties: {0: {name: "Range"}, 1: {name: "Repeat"}}};
var currentScheduleType = scheduleType.RANGE;

var manipulationType = {EDIT: 0, ADD: 1, properties: {0: {name: "Edit"}, 1: {name: "Add"}}};
var currentManipulationType;
var currentTimingType;
var currentTimingEditIndex = null;

var scheduleTemperatureValue = 73;		//Hardcoded initial value to set while adding timing to new schedule
var timingTemperatureDiv = '<span style="font-size:40pt;">'+scheduleTemperatureValue+'<sup class="supUnit"><i class="wi wi-fahrenheit"></i></sup></span>';

var timingsArray = [];	//to store timings which user gonna enter while creating new schedule.
var modeToSet;  //to keep track of thermostat mode click while adding new time in schedule.

var arrayId = [];

var currentMode;
var timer;
var isUserInteracting = false;
var fanOffStateReady = true;
var secondStageHeaterEnabled = 0;

$(document).ready(function () {
    // jQuery is properly loaded at this point
    // so proceed to bind the Cordova's deviceready event
    //FastClick.attach(document.body);
    // $(document).bind('deviceready', function () {
       // Now Cordova is loaded
        //its great JS API can be used to access low-level
        //features as accelerometer, contacts and so on

        // document.addEventListener('pause', onPause.bind(this), false);
        // document.addEventListener('resume', onResume.bind(this), false);
        // window.addEventListener("batterystatus", onBatteryStatus, false);
        // window.addEventListener("batterycritical", onBatteryCritical, false);
        // window.addEventListener("batterylow", onBatteryLow, false);

        //alert("Device is ready");
    // });

	//localStorage.clear();
	/*if(typeof(Storage) !== "undefined") {
		if(window.localStorage.getItem("Last Configured") !== null){
			lastUsedIpKey = window.localStorage.getItem("Last Configured");
			ipAddress = window.localStorage.getItem(lastUsedIpKey);
			$("#thermostatName").html(lastUsedIpKey);
		}else{
			ipAddress = '192.168.1.1';
			localStorage.setItem(defaultIpKey, ipAddress);
			//window.localStorage.setItem("apmode", ipAddress);
		}
	} else {
		//Default IP Address
		ipAddress = '192.168.1.1';
	}*/
	
	$.ajaxSetup({
        cache: false
    });
	
	if(typeof(Storage) !== "undefined") {
		if($.jStorage.get("Last Configured") !== null){
			lastUsedIpKey = $.jStorage.get("Last Configured");
			ipAddress = $.jStorage.get(lastUsedIpKey);
			$("#thermostatName").html(lastUsedIpKey);
		}else{
			ipAddress = '192.168.1.1';
			$.jStorage.set(defaultIpKey, ipAddress);
			$.jStorage.set("Last Configured",defaultIpKey);
			lastUsedIpKey = $.jStorage.get("Last Configured");
			ipAddress = $.jStorage.get(lastUsedIpKey);
			//window.localStorage.setItem("apmode", ipAddress);
		}
	} else {
		//Default IP Address
		ipAddress = '192.168.1.1';
	}
	//$("#weekdayTime").html(moment().format("ddd - hh:mm A"));
	//$("#currentDate").html(moment().format("MMMM D, YYYY"));
	
	$("#timingTemperature").html(timingTemperatureDiv);
	//$('#schedulerFanControlDiv').slideUp();
	
	
	/*$('#schedule-name').bind('input', function() {
	  var c = this.selectionStart,
		  r = /[^a-z0-9]/gi,
		  v = $(this).val();
	  if(r.test(v)) {
		$(this).val(v.replace(r, ''));
		c--;
	  }
	  this.setSelectionRange(c, c);
	});*/
	
	//$("nav ul li").bind( "touchstart", modeNavigationControl);
	
	/*$('#schedule-name').bind('keypress', function (event) {
		var regex = new RegExp("^[a-zA-Z0-9_ ]+$");
		var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		if (!regex.test(key)) {
		   event.preventDefault();
		   return false;
		}
	});*/
	
	/*
	$(document).on('pagebeforeshow', '#scheduler', function(){
		$('#allSchedule').empty();
		$('#activeScheduleTable').empty();
		//showSchedules();
		//showAllSchedules();
		//showActiveSchedule();
		//scheduleListInit();
		//getAllSchedules();
	});*/
	
	$(document).on('pagebeforeshow', '#settings', function(){
		verificationDialog("before", "verification", function(){
			
		});
		$("#configure").slideUp("slow");
		$("#settingsPanel").slideDown("slow");
		initializeSettingsParameter();
	});
	
	/*$("#selectThermostat").bind("change", function(event, ui) {
		$('#ip').val("");
		$('#ipName').val("");
		ipAddress = $(this).find('option:selected').val();
		var name = $(this).find('option:selected').text();
		$('#ipName').val(name);
		if(ipAddress !== undefined || ipAddress !== null){
			var ipSplit = (ipAddress).split('.');
			$('#form_ip_octet_1').val(ipSplit[0]);
			$('#form_ip_octet_2').val(ipSplit[1]);
			$('#form_ip_octet_3').val(ipSplit[2]);
			$('#form_ip_octet_4').val(ipSplit[3]);
		}
	});*/
	
	/*$(document).on('pagebeforeshow', '#modification', function(){
		if(currentManipulationType == manipulationType.EDIT){
			//fillEditDetails(sessionStorage.title, sessionStorage.id, sessionStorage.startDate, sessionStorage.endDate, timingsArray, sessionStorage.index, sessionStorage.days);
		fillEditDetails(sessionInfo["title"], sessionInfo["id"], sessionInfo["startDate"], sessionInfo["endDate"], timingsArray, sessionInfo["index"], sessionInfo["days"]);
			$('#delete').show();
		}
		if(currentManipulationType == manipulationType.ADD){
			repeatTracker = 127;
			parseRepeatWeekDays(repeatTracker);
			$('#delete').hide();
		}
		timingsListInit();
	});*/
	
	$(document).on('pagebeforeshow', '#thermostat', function(){
		populateThermostat();  //To list all the saved thermostat
		//$('#ipName').val("");
		/*if(ipAddress !== undefined || ipAddress !== null){
			var ipSplit = (ipAddress).split('.');
			$('#form_ip_octet_1').val(ipSplit[0]);
			$('#form_ip_octet_2').val(ipSplit[1]);
			$('#form_ip_octet_3').val(ipSplit[2]);
			$('#form_ip_octet_4').val(ipSplit[3]);
		}*/
	});
	
	$("div[data-role=page]").bind("pagebeforeshow", function (e, data) {
		$.mobile.silentScroll(0);
		$.mobile.changePage.defaults.transition = 'flip';
		
	});
	
	$( document ).bind( "mobileinit", function() {
		// Make your jQuery Mobile framework configuration changes here!
		$.mobile.allowCrossDomainPages = true;
	});
	/*
	$("#btnAddSchedule").on("vmouseup", function() {
		if(totalScheduleCount < scheduleMaxLimit){
			currentManipulationType = manipulationType.ADD;
			delete sessionInfo["title"];
			delete sessionInfo["id"]; 
			delete sessionInfo["startDate"];
			delete sessionInfo["endDate"];
			delete sessionInfo["days"];
			delete sessionInfo["index"];
			//sessionStorage.clear();
			//refreshScheduleWindow();
			$.mobile.navigate( "#modification", {
				
			});
		}else{
			alertPopup(maxLimitMessage);
		}
	});
	*/
	/*$("#btnViewAll").on("vmouseup", function(){
		var link = $(this);
        $("#scheduleControlDiv").slideToggle("slow", function() {
            if ($(this).is(":visible")) {
                 link.text('Upcoming');                
            } else {
                 link.text('View All');                
            }
		});
		$("#upcomingSchedules").slideToggle("slow");
		//scheduleListInit();
    });*/
	
	/*if (window.navigator.msPointerEnabled) {
	    alert("New code");
	    var advanced = document.getElementById('wrench');
	    advanced.addEventListener("pointerdown", testPointer, false);
	} else {*/
	    $("#wrench").on("vmousedown", function () {
	        $("#configure").slideToggle("slow");
	        $("#settingsPanel").slideToggle("slow");
	    });
	//}
	
	$('.weekdays .week').change(function() {
	var day = $(this).data("day");
		switch(day){
			case "SUN":
				repeatTracker = repeatTracker ^ 0x01;
				break;
			case "MON":
				repeatTracker = repeatTracker ^ 0x02;
				break;
			case "TUE":
				repeatTracker = repeatTracker ^ 0x04;
				break;
			case "WED":
				repeatTracker = repeatTracker ^ 0x08;
				break;
			case "THU":
				repeatTracker = repeatTracker ^ 0x10;
				break;
			case "FRI":
				repeatTracker = repeatTracker ^ 0x20;
				break;
			case "SAT":
				repeatTracker = repeatTracker ^ 0x40;
				break;
		}
    });
	
	$('#saveIpAddress').on("vmousedown", function (e) {
		var octet1 = $('#form_ip_octet_1').val();
		var octet2 = $('#form_ip_octet_2').val();
		var octet3 = $('#form_ip_octet_3').val();
		var octet4 = $('#form_ip_octet_4').val();
		if(octet1 !== "" && octet2 !== "" && octet3 !== "" && octet4 !== ""){
			ipAddress = octet1 + "." + octet2 + "." + octet3 + "." + octet4;
			var thermostatName = $('#ipName').val();
			thermostatName = thermostatName.trim();
			if(thermostatName == "" || thermostatName == null){
				//Popup
				alertPopup("Invalid Name");
			}else{
				//Store IP Address
				if(typeof(Storage) !== "undefined") {
					$.jStorage.set(thermostatName, ipAddress);
					$.jStorage.set("Last Configured", thermostatName); //Updating lastip
				} else {
					// No Web Storage support..
				}
				
				$("#addThermoDiv").slideToggle("slow");
				populateThermostat();
				/*$('#ipName').val("");
				$('#form_ip_octet_1').val("");
				$('#form_ip_octet_2').val("");
				$('#form_ip_octet_3').val("");
				$('#form_ip_octet_4').val("");*/
				//alertPopup("IP address saved");
			}
		}else{
			alertPopup("Invalid IP Address");
		}
	});
	
	$('#syncThermo').on("vmousedown", function (e) {
		//Saving parameters of Thermostat
			initialCycleRate = parseInt($("#cyclesPerHour").val()).toString(16);
			initialMinOffTime = parseInt($("#minOffTime").val()).toString(16);
			initialMinOnTime = parseInt($("#minOnTime").val()).toString(16);
			initialCoolDeadBand = parseInt($("#coolDeadband").val()).toString(16);
			initialHeatDeadBand = parseInt($("#heatDeadband").val()).toString(16);
			initial2StageThreshold = parseInt($("#secondStageHeater").val()).toString(16);
			initialManualOverride = parseInt($("#manualOverride").val()).toString(16);
			var degreeUnit = parseInt($("#degreeUnit").val()).toString(16);
			
			var paramsString = initialCycleRate + "," + initialMinOffTime + "," + initialMinOnTime + "," + initialCoolDeadBand + "," + initialHeatDeadBand + "," + initialManualOverride + "," + degreeUnit;
			/*if(initial2StageThreshold === undefined)
			{
				paramsString = paramsString + ",0";
			}else{
				paramsString = paramsString + ",1," + initial2StageThreshold;
			}*/
			
			//update implemented on 1st Dec.
			paramsString = paramsString + "," + secondStageHeaterEnabled;
			if(secondStageHeaterEnabled == 1){
				paramsString = paramsString + "," + initial2StageThreshold;
			}
			
			//Calling Backend calls
			setTimezone();
			setParameters(paramsString);		
    });
	
	$('#syncTime').on("vmousedown", function (e) {
		syncTime();
    });
	
	
	$('#resetPassword').on("vmousedown", function (e) {
		verificationDialog("after", "change", function(){	
			passwordResetDialog(function(){
				
			});	
		});			
    });
	
	$('#factoryReset').on("vmousedown", function (e) {
		verificationDialog("after", "factory", function(){	
			//do Factory Reset Call here
			//doFactoryReset(currentPassword);
		});
    });
	
	/*$('#startDate').on("vmouseup", function (e) {
			$('#calendarPicker').slideToggle("slow");
			if(currentDateType == dateTypeSelected.END){
				$('#calendarPicker').slideDown();
			}
			currentDateType = dateTypeSelected.START;
			//setting back constraint Start Date to current Date
			calendarRange.options.constraints.startDate = (moment()).format("YYYY-MM-DD");
			calendarRange.render();
    });
	
	$('#endDate').on("vmouseup", function (e) {
			$('#calendarPicker').slideToggle();
			if(currentDateType == dateTypeSelected.START){
				$('#calendarPicker').slideDown();
			}
			currentDateType = dateTypeSelected.END;
    });*/
	
	/*var calendarRange = $('#calendar-range').clndr({
    events: schedulerEvents,
    multiDayEvents: {
      startDate: 'startDate',
      endDate: 'endDate',
      singleDay: 'date'
    },
	constraints: {
		startDate: '2015-05-06'
	},
    clickEvents: {
      click: function(target) {
		switch(currentDateType){
			case dateTypeSelected.START:
				if( !$(target.element).hasClass('inactive') ) {
					//console.log('You picked a valid date!');
					$('#startDate').val((target.date).format("MMM DD, YYYY"));
					$('#calendarPicker').slideUp();
					//update start Date Constraint. Dont allow user to select end date previous to startDate
					this.options.constraints.startDate = (target.date).format("YYYY-MM-DD");
					this.render();
					//check if end Date is before start Date. Clear endDate in that case
					if(moment($("#endDate").val()).isBefore($("#startDate").val())){
						console.log("End Date is before Start Date");
						$("#endDate").val("");
					}
				}else {
					console.log('That date is outside of the range.');
				}
				break;
			case dateTypeSelected.END:
				if( !$(target.element).hasClass('inactive') ) {
					//console.log('You picked a valid date!');
					$('#endDate').val((target.date).format("MMM DD, YYYY"));
					$('#calendarPicker').slideUp();	
				}else {
					console.log('That date is outside of the range.');
				}
				break;
		}
			
      }
    }
  });
	calendarRange.options.constraints.startDate = (moment()).format("YYYY-MM-DD");
	calendarRange.render();*/
  
	$('#timezone select').change(function(){
	  console.log($(this).find(":selected"));
	  console.log($(this).find(":selected").text());
	  console.log($(this).find(":selected").val());
	  console.log($(this).find(":selected").data("offset"));
	  console.log(moment().tz($(this).find(":selected").val()).format());
	  console.log(moment());
	});
	/*	
	$("#add-time").on("vmousedown", function () {
		var timeFrom = $('#timeFrom').val();
		//var timeTo = $('#timeTo').val();
		var fanControlValue = $("#schedulerFanControl").val();
		var temperatureToSet = scheduleTemperatureValue;
		if(timeFrom !== ""){
			if(modeToSet === null || modeToSet === undefined){ alertPopup("select any mode first");}
			else{
				var setModeTo = thermostatMode.properties[modeToSet].name;
				
				if(currentTimingType == manipulationType.ADD){
					if(timingsArray.length < (timingsMaxLimit-1) ){
					var indexId = timingsArray.length;
					if(modeToSet === 0 || modeToSet === 4){*/
						//timingsArray.push({startTime: moment(moment(timeFrom, "HH:mm").format('YYYY-MM-DD HH:mm')), /*endTime: moment(timeTo, "hh:mm"),*/ mode: modeToSet});	//pushing to timing array to pass in scheduler events
					//}else{
						//timingsArray.push({startTime: moment(moment(timeFrom, "HH:mm").format('YYYY-MM-DD HH:mm')), /*endTime: moment(timeTo, "hh:mm"),*/ mode: modeToSet, temperature: temperatureToSet, fan: fanControlValue});	//pushing to timing array to pass in scheduler events
					//}
					//timeFrom = (moment(timeFrom, "hh:mm")).format("hh:mm A");
					//timeTo = (moment(timeTo, "hh:mm")).format("hh:mm A");
					//addTimings(timeFrom, timeTo, setModeTo, temperatureToSet, indexId);
					/*timingsArray = (_.sortBy(timingsArray, function(o) { return moment(o.startTime); }));
					refreshTimingDiv(timingsArray);
					clearTiming();
					}else{alertPopup("Maximum timings limit reached !");}
				}
				if(currentTimingType == manipulationType.EDIT){
					timingsArray[currentTimingEditIndex].startTime = moment(timeFrom, "HH:mm");
					timingsArray[currentTimingEditIndex].mode = modeToSet;
					if(modeToSet == 0 || modeToSet == 4){
						//do nothing
					}else{
						timingsArray[currentTimingEditIndex].temperature = temperatureToSet;
						timingsArray[currentTimingEditIndex].fan = fanControlValue;
					}
					timingsArray = (_.sortBy(timingsArray, function(o) { return moment(o.startTime); }));
					refreshTimingDiv(timingsArray);
					clearTiming();
				}
			}
		}
		else{
			alertPopup("Please set the time first");
		}
		timingsListInit();
	});
	
	$("#delete-time").on("vmouseup",function () {
		if(currentTimingType == manipulationType.EDIT){
			var indexId = currentTimingEditIndex;
			timingsArray.splice(indexId, 1);
			refreshTimingDiv(timingsArray);
			clearTiming();
		}
		timingsListInit();
	});*/
	
	/*$("#save").on("vmouseup", function () {
		//validateInput();
		var scheduleName = $('#schedule-name').val();
		scheduleName = scheduleName.trim();
		scheduleName = scheduleName.substring(0, 20);
		var sDate = $('#startDate').val();
		var eDate = $('#endDate').val();
		var startDate = moment(sDate).format("YYYYMMDD");
		var endDate = moment(eDate).format("YYYYMMDD");
		if(totalScheduleCount < scheduleMaxLimit){
			if(scheduleName!==""){
				if(currentManipulationType == manipulationType.ADD){
					if(sDate!==""&& eDate!=="" && repeatTracker !== 0){
						var timeFrom = $('#timeFrom').val();
						var fanControlValue = $("#schedulerFanControl").val();
						var firstPush = false;
						if(timingsArray.length==0){
							if(timeFrom!=="" && (typeof(modeToSet) !== "undefined" && modeToSet !== null)){
								var temperatureToSet = scheduleTemperatureValue;
								var setModeTo = thermostatMode.properties[modeToSet].name;
								if(modeToSet == 0 || modeToSet == 4){
									timingsArray.push({startTime: moment(moment(timeFrom, "HH:mm").format('YYYY-MM-DD HH:mm')), mode: modeToSet});
									firstPush = true;
								}else{
									timingsArray.push({startTime: moment(moment(timeFrom, "HH:mm").format('YYYY-MM-DD HH:mm')), mode: modeToSet, temperature: temperatureToSet, fan: fanControlValue});
									firstPush = true;
								}
								timingsArray = (_.sortBy(timingsArray, function(o) { return moment(o.startTime); }));
							}else{alertPopup("Please add time and select mode");}
						}
						if(timingsArray.length !== 0){	//and timings array is less than 5
							if(timeFrom!=="" && firstPush === false &&(typeof(modeToSet) !== "undefined" && modeToSet !== null)){
								var temperatureToSet = scheduleTemperatureValue;
								var setModeTo = thermostatMode.properties[modeToSet].name;
								//check if currentTimingType == manipulationType.EDIT
								if(currentTimingType == manipulationType.EDIT){
									timingsArray[currentTimingEditIndex].startTime = moment(timeFrom, "HH:mm");
									timingsArray[currentTimingEditIndex].mode = modeToSet;
									if(modeToSet == 0 || modeToSet == 4){
										//do nothing
									}else{
										timingsArray[currentTimingEditIndex].temperature = temperatureToSet;
										timingsArray[currentTimingEditIndex].fan = fanControlValue;
									}
								}else{
									if(modeToSet == 0 || modeToSet == 4){
										timingsArray.push({startTime: moment(moment(timeFrom, "HH:mm").format('YYYY-MM-DD HH:mm')), mode: modeToSet});
									}else{
										timingsArray.push({startTime: moment(moment(timeFrom, "HH:mm").format('YYYY-MM-DD HH:mm')), mode: modeToSet, temperature: temperatureToSet, fan: fanControlValue});
									}
								}
								timingsArray = (_.sortBy(timingsArray, function(o) { return moment(o.startTime); }));
							}					
							saveSchedule(scheduleName, nextScheduleId, startDate, endDate, timingsArray, repeatTracker);
							refreshScheduleWindow();
						}
					}else{	alertPopup("Please select date range and weekdays");	}
				}
				else if((timingsArray.length!==0) && (currentManipulationType == manipulationType.EDIT)){
					if(sDate!==""&& eDate!=="" && repeatTracker !== 0){
						var timeFrom = $('#timeFrom').val();
						var fanControlValue = $("#schedulerFanControl").val();
						var firstPush = false;
						if(timingsArray.length===0){
							if(timeFrom!=="" && (typeof(modeToSet) !== "undefined" && modeToSet !== null)){
								var temperatureToSet = scheduleTemperatureValue;
								var setModeTo = thermostatMode.properties[modeToSet].name;
								if(modeToSet === 0 || modeToSet === 4){
									timingsArray.push({startTime: moment(moment(timeFrom, "HH:mm").format('YYYY-MM-DD HH:mm')), mode: modeToSet});
									firstPush = true;
								}else{
									timingsArray.push({startTime: moment(moment(timeFrom, "HH:mm").format('YYYY-MM-DD HH:mm')), mode: modeToSet, temperature: temperatureToSet, fan: fanControlValue});
									firstPush = true;
								}
								timingsArray = (_.sortBy(timingsArray, function(o) { return moment(o.startTime); }));
							}else{alertPopup("Please add time and select mode");}
						}
						if(timingsArray.length !== 0){	//and timings array is less than 5
							if(timeFrom!=="" && firstPush === false && timingsArray.length < timingsMaxLimit &&(typeof(modeToSet) !== "undefined" && modeToSet !== null)){
								var temperatureToSet = scheduleTemperatureValue;
								var setModeTo = thermostatMode.properties[modeToSet].name;
								//check if currentTimingType == manipulationType.EDIT
								if(currentTimingType == manipulationType.EDIT){
									timingsArray[currentTimingEditIndex].startTime = moment(timeFrom, "HH:mm");
									timingsArray[currentTimingEditIndex].mode = modeToSet;
									if(modeToSet == 0 || modeToSet == 4){
										//do nothing
									}else{
										timingsArray[currentTimingEditIndex].temperature = temperatureToSet;
										timingsArray[currentTimingEditIndex].fan = fanControlValue;
									}
								}else{
									if(modeToSet == 0 || modeToSet == 4){
										timingsArray.push({startTime: moment(moment(timeFrom, "HH:mm").format('YYYY-MM-DD HH:mm')), mode: modeToSet});
									}else{
										timingsArray.push({startTime: moment(moment(timeFrom, "HH:mm").format('YYYY-MM-DD HH:mm')), mode: modeToSet, temperature: temperatureToSet, fan: fanControlValue});
									}
								}
								timingsArray = (_.sortBy(timingsArray, function(o) { return moment(o.startTime); }));
							}
							//var editId = schedulerEvents[sessionStorage.index].id;
							var editId = schedulerEvents[sessionInfo["index"]].id;
							
							saveSchedule(scheduleName, editId, startDate, endDate, timingsArray, repeatTracker);
							refreshScheduleWindow();
								//alert("schedule saved");
						}
					}else{	alertPopup("Please select date range and weekdays");	}
					
				}else{
					alertPopup("please add atleast one timing");
				}
			}
			else{
				alertPopup("Provide schedule unique name");
			}
		}else{alertPopup(maxLimitMessage);}		
	}); */
	
	/*$("#delete").on("vmouseup",function () {	
		if((timingsArray.length!==0) && (currentManipulationType == manipulationType.EDIT)){
			var scheduleToBeDeleted = (schedulerEvents[sessionInfo["index"]].id).toString();
			if(scheduleToBeDeleted == activeScheduleId){
				confirmDialog("Are you sure? This is an active schedule", "Delete Schedule", function(){
					setActiveSchedule("0f");
					deleteSchedule(scheduleToBeDeleted);
				});	
			}else{
				confirmDialog("Are you sure?", "Delete Schedule", function(){
					deleteSchedule(scheduleToBeDeleted);
				});
			}
		}
		else{alertPopup("This schedule can't be deleted");}
	});*/
	/*
	$("#sliderDiv").change(function() {
		scheduleTemperatureValue = $("#slideToSet").val();
		if(temperatureUnit == 0){
			timingTemperatureDiv = '<span style="font-size:40pt;">'+scheduleTemperatureValue+'<sup class="supUnit"><i class="wi wi-fahrenheit"></i></sup></span>';
		}else if(temperatureUnit == 1){
			timingTemperatureDiv = '<span style="font-size:40pt;">'+scheduleTemperatureValue+'<sup class="supUnit"><i class="wi wi-celsius"></i></sup></span>';
		}
		$("#timingTemperature").html(timingTemperatureDiv);
	});*/
	
	$('#modeSelection .inactiveModeSelection').on("vmouseup",function(){
		var selectedMode = $(this).data("mode");
		var modeToSetInit = selectedModeToSet(selectedMode);
		$(this).addClass("activeModeSelection");
        $("#modeSelection .inactiveModeSelection").not(this).removeClass("activeModeSelection");
		$(this).find(".modeDesc").css("visibility","visible");
		$("#modeSelection .inactiveModeSelection").not(this).find(".modeDesc").css("visibility","hidden");
	});
	
	$('#saveRouterInfo').click(function () {
		var passVisible = $("#passwordContainer").is(":visible"); 
		var checkDisplay = passVisible == true ? $('#password').val() : true;
		if($('#ssid').val() != "" && checkDisplay != ""){
			var $this = $( this ),
	        theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
	        textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
	        textonly = !!$this.jqmData( "textonly" );
		    $.mobile.loading( "show", {
		            text: "Saving Router's Info",
		            textVisible: textVisible,
		            theme: theme,
		            textonly: textonly,
		    });
			setThermostatWifi($('#ssid').val(), $('#password').val());
		}else{
			alertPopup("SSID and password can't be blank");
		}
	});
	
	$('#fanSpin').on("vmouseup", function () {
		//var value;
		if(fanOffStateReady === true && currentThermostatMode !== thermostatMode.FAN && currentFanState == thermostatFanState.ON){
			//value = currentMode +","+ temperatureSlider.getValue() + ",1";  //set to Auto
			setMode("5,1");
		}else if(fanOffStateReady === true && currentThermostatMode !== thermostatMode.FAN && currentFanState == thermostatFanState.AUTO){
			//value = currentMode +","+ temperatureSlider.getValue() + ",0";  //set to On
			setMode("5,0");
		}//else if(fanOffStateReady === true && currentThermostatMode !== thermostatMode.FAN && currentFanState == thermostatModeState.AUTO){
			//setMode("5, 1");
		//}
	});
	
	/*$('#refreshSchedule').on("vmouseup", function () {
		$("#refreshLoader").show();
		$('#allSchedule').empty();
		$('#activeScheduleTable').empty();
		getAllSchedules();
	});*/

	$('#editThermo').on("vmousedown", function (e) {
		$("#addThermoDiv").slideDown("slow");
		$('#ipName').textinput('disable');
		lastUsedIpKey = $.jStorage.get("Last Configured");
		ipAddress = $.jStorage.get(lastUsedIpKey);
		$("#ipName").html(lastUsedIpKey);
		if(ipAddress !== undefined || ipAddress !== null){
			var ipSplit = (ipAddress).split('.');
			$('#form_ip_octet_1').val(ipSplit[0]);
			$('#form_ip_octet_2').val(ipSplit[1]);
			$('#form_ip_octet_3').val(ipSplit[2]);
			$('#form_ip_octet_4').val(ipSplit[3]);
		}
	});

	$('#newThermoRefresh').on("vmousedown", function (e) {
		//$('#ipName').val("");
		$('#addThermoDiv').slideUp();
	});
		
	$('#delThermo').on("vmousedown", function (e) {
		if(typeof(Storage) !== "undefined") {
			var keyToRemove = $.jStorage.get("Last Configured");
			if(keyToRemove != defaultIpKey){
				confirmDialog("Are you sure?", "Remove selected", function(){
					$.jStorage.deleteKey(keyToRemove);
					$.jStorage.set("Last Configured",defaultIpKey);
					lastUsedIpKey = $.jStorage.get("Last Configured");
					ipAddress = $.jStorage.get(lastUsedIpKey);
					$("#thermostatName").html(lastUsedIpKey);
					populateThermostat();
				});	
			}else{
				alertPopup("This Thermostat can't be removed.");
			}
		}
	});

	$('#delAllThermo').on("vmousedown", function (e) {
	if(typeof(Storage) !== "undefined") {
			confirmDialog("Are you sure?", "Remove All", function(){
			$.jStorage.flush();
			ipAddress = '192.168.1.1';
			$.jStorage.set(defaultIpKey, ipAddress);
			$.jStorage.set("Last Configured",defaultIpKey);
			lastUsedIpKey = $.jStorage.get("Last Configured");
			ipAddress = $.jStorage.get(lastUsedIpKey);
			$("#thermostatName").html(lastUsedIpKey);
			populateThermostat();
		});
	}
});
	onConnectionLost();
	disableAtStart();
	getAllParams(); //Getting parameters at the start of the thermostat
	//getAllSchedules();
	
	//Start the Worker Thread at the end of everything
	startWebWorker();
	
	updateSettingsParameters();
	
	$("#refreshLoader").hide();
	$("#upperTemperatureValue").hide();
	
});


function getLocation() {
	navigator.geolocation.getCurrentPosition(userPosition, displayError, {enableHighAccuracy: true });
}

function displayError(error) {
  var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  console.log("Error: " + errors[error.code]);
}

function userPosition(position){
	userLatitude = position.coords.latitude;
	userLongitude = position.coords.longitude;
	getWeather();
} 

function getWeather(){
	$.ajax({
		url: 'http://api.openweathermap.org/data/2.5/weather?lat='+userLatitude+'&lon='+userLongitude+'&units=imperial&APPID='+appid,
		dataType: 'json',
		method : 'GET',
		success: function( data, textStatus, jQxhr ){
			//console.log("Success: "+data + "Status: "+textStatus);
			updateCurrentWeatherUI(data);
		},
		error: function( jqXhr, textStatus, errorThrown ){
			//alert("Error: "+errorThrown);
			$('#currentOutsideTemperature').html('&nbsp-_- ');
			$('#weatherDescription').html('');
			iconClass = "wi-na";
			if($('#currentWeatherIcon').hasClass(currentWeatherIconClass)){
				$('#currentWeatherIcon').removeClass(currentWeatherIconClass);
				$('#currentWeatherIcon').addClass(iconClass);
				currentWeatherIconClass = iconClass;
			}
		},
		timeout: 3000
	});
}

function updateCurrentWeatherUI(data){
//data.main.humidity: 100
//data.main.pressure: 1015
//data.main.temp: 299.15
//data.weather[0].description
//data.weather[0].icon
//data.wind.speed
	var iconClass;
	var temperature = data.main.temp;
	var humidity = data.main.humidity;
	var windSpeed = data.wind.speed;
	var outdoordesp = data.weather[0].description;
	$('#currentOutsideTemperature').html('&nbsp' + temperature + '&#176;F');
	$('#weatherDescription').html(outdoordesp);
	
	switch(data.weather[0].icon){
		case "01d":
			iconClass = "wi-day-sunny";
			break;
		case "01n":
			iconClass = "wi-night-clear";
			break;
		case "02d":
			iconClass = "wi-day-cloudy";
			break;
		case "02n":
			iconClass = "wi-night-alt-cloudy";
			break;
		case "03d":
			iconClass = "wi-day-cloudy-gusts";
			break;
		case "03n":
			iconClass = "wi-night-alt-cloudy-gusts";
			break;
		case "04d":
			iconClass = "wi-day-cloudy-high";
			break;
		case "04n":
			iconClass = "wi-night-alt-cloudy-high";
			break;
		case "09d":
			iconClass = "wi-day-showers";
			break;
		case "09n":
			iconClass = "wi-night-alt-showers";
			break;
		case "10d":
			iconClass = "wi-day-rain";
			break;
		case "10n":
			iconClass = "wi-night-alt-rain";
			break;
		case "11d":
			iconClass = "wi-day-thunderstorm";
			break;
		case "11n":
			iconClass = "wi-night-thunderstorm";
			break;
		case "13d":
			iconClass = "wi-day-snow";
			break;
		case "13n":
			iconClass = "wi-night-snow";
			break;
		case "50d":
			iconClass = "wi-day-fog";
			break;
		case "50n":
			iconClass = "wi-night-fog";
			break;
		default:
			iconClass = "wi-day-sunny";
			break;
	}
	if($('#currentWeatherIcon').hasClass(currentWeatherIconClass)){
		$('#currentWeatherIcon').removeClass(currentWeatherIconClass);
		$('#currentWeatherIcon').addClass(iconClass);
		currentWeatherIconClass = iconClass;
	}
	
	/*$('#currentWeatherDesp').text(outdoordesp);
	$('#currentOutdoorHumidity').text(humidity+"%");
	$('#currentOutdoorTime').text(moment().format("hh:mm"));
	$('#currentOutdoorWind').text(windSpeed);*/
	//
}

//updating settings parameter every 30 seconds.
function updateSettingsParameters() {
	initializeSettingsParameter();
    setTimeout(updateSettingsParameters, 30000);
}

//initialize ip address field and timezone input
$(function(){
	$('.ip').ipaddress();
	$('#timezone select').timezones();
});


function initializeSettingsParameter(){
	var matchString;
			
	//-----------Heat Deadband
	$('#heatDeadband').selectmenu();
	$("#heatDeadband").empty();
	for (var i=1; i<=10; i+=1) {
		/*if(i<10){
			matchString = "0"+i + " Degrees";
		}else{
			matchString = i + " Degrees";
		}*/
		matchString = i;
		if(initialHeatDeadBand !== undefined && initialHeatDeadBand == matchString)
		{
			$("#heatDeadband").append('<option value="' + i + '" selected="selected">' + (i) + ' Degrees</option>');
		}
		else{
			$("#heatDeadband").append('<option value="' + i + '">' + (i) + ' Degrees</option>');
		}
	}
	$('#heatDeadband').selectmenu('refresh', true);
	
	//-----------Cool Deadband
	$('#coolDeadband').selectmenu();
	$("#coolDeadband").empty();
	for (i=1; i<=10; i+=1) {
		/*if(i<10){
			matchString = "0"+i + " Degrees";
		}else{
			matchString = i + " Degrees";
		}*/
		matchString = i;
		if(initialCoolDeadBand !== undefined && initialCoolDeadBand == matchString)
		{
			$("#coolDeadband").append('<option value="' + i + '" selected="selected">' + (i) + ' Degrees</option>');
		}
		else{
			$("#coolDeadband").append('<option value="' + i + '">' + (i) + ' Degrees</option>');
		}
	}
	$('#coolDeadband').selectmenu('refresh', true);
	
	//-----------OnTIme
	$('#minOnTime').selectmenu();
	$("#minOnTime").empty();
	for (i=30; i<=120; i+=10) {
		matchString = i + " Seconds";
		if(initialMinOnTime !== undefined && initialMinOnTime == matchString)
		{
			$("#minOnTime").append('<option value="' + i + '" selected="selected">' + (i) + ' Seconds</option>');
		}
		else{
			$("#minOnTime").append('<option value="' + i + '">' + (i) + ' Seconds</option>');
		}
	}
	$('#minOnTime').selectmenu('disable');
	$('#minOnTime').selectmenu('refresh', true);
	
	//-----------OffTIme
	$('#minOffTime').selectmenu();
	$("#minOffTime").empty();
	for (i=30; i<=600; i+=10) {
		matchString = i + " Seconds";
		if(initialMinOffTime !== undefined && initialMinOffTime == matchString)
		{
			$("#minOffTime").append('<option value="' + i + '" selected="selected">' + (i) + ' Seconds</option>');
		}
		else{
			$("#minOffTime").append('<option value="' + i + '">' + (i) + ' Seconds</option>');
		}
	}
	$('#minOffTime').selectmenu('refresh', true);
	
	//-----------CyclesPerHour
	$('#cyclesPerHour').selectmenu();
	$("#cyclesPerHour").empty();
	for (i=0; i<=10; i++) {
		matchString = i;
		if(initialCycleRate !== undefined && initialCycleRate == matchString)
		{
			$("#cyclesPerHour").append('<option value="' + i + '" selected="selected">' + (i) + '</option>');
		}else{
			$("#cyclesPerHour").append('<option value="' + i + '">' + (i) + '</option>');
		}
	}
	$('#cyclesPerHour').selectmenu('refresh', true);
	
	//-----------Manual Control Override
	$('#manualOverride').selectmenu();
	$("#manualOverride").empty();
	for (i=5; i<=30; i=i+5) {
		matchString = i;
		if(initialManualOverride !== undefined && initialManualOverride == matchString){
			$("#manualOverride").append('<option value="' + i + '" selected="selected">' + (i) + ' Minutes</option>');
		}else{
			$("#manualOverride").append('<option value="' + i + '">' + (i) + ' Minutes</option>');
		}
	}
	$('#manualOverride').selectmenu('refresh', true);
	
	//-----------secondStageHeater
	$('#secondStageHeater').selectmenu();
	$("#secondStageHeater").empty();
	for (i=120; i<=300; i+=10) {
		matchString = i + " Seconds";
		if(initial2StageThreshold !== undefined && initial2StageThreshold == matchString)
		{
			$("#secondStageHeater").append('<option value="' + i + '" selected="selected">' + (i) + ' Seconds</option>');
		}
		else{
			$("#secondStageHeater").append('<option value="' + i + '">' + (i) + ' Seconds</option>');
		}
	}
	$('#secondStageHeater').selectmenu('refresh', true);
	
	$('#enableDisableSecondStage').change(function() {
        if($(this).is(":checked")) {
            // $("#enableDisableSecondStage").attr("checked", "checked");
			// $("#enableDisableSecondStage").checkboxradio("refresh");
			// $('#secondStageHeaterDiv').slideDown();
			// $('#secondStageHeater').selectmenu();
			// $("#secondStageHeater").prop('disabled', false);
			// $('#secondStageHeater').selectmenu('refresh', true);
			secondStageHeaterEnabled = 1;
        }else{
			// $("#enableDisableSecondStage").removeAttr("checked");
			// $("#enableDisableSecondStage").checkboxradio("refresh");
			// $('#secondStageHeaterDiv').slideUp();
			// $('#secondStageHeater').selectmenu();
			// $("#secondStageHeater").prop('disabled', 'disabled');
			// $('#secondStageHeater').selectmenu('refresh', true);
			secondStageHeaterEnabled = 0;
		}   
    });
	
	/*--Check Box is clicked start---*/
		$('#disablePassword').click(function() {
				if($(this).is(":checked")) {
					$('#passwordContainer').hide();
				}else{
					$('#passwordContainer').show();
				}
			}
		);
	/*--Check Box is clicked end---*/
	
	
	//-----------update enableDisbleSecondStageHeater property checked/umchecked
	if(isSecondStageHeaterEnabled == 0){
		$("#enableDisableSecondStage").removeAttr("checked");
		$("#enableDisableSecondStage").checkboxradio("refresh");
	}else if(isSecondStageHeaterEnabled == 1){
		isSecondStageHeaterEnabled = 1;
		$("#enableDisableSecondStage").attr("checked", "checked");
		$("#enableDisableSecondStage").checkboxradio("refresh");
	}
	
	//-----------Temperature Unit
	$('#degreeUnit').selectmenu();
	$("#degreeUnit").empty();
		if(temperatureUnit !== undefined && temperatureUnit == 0){
			$("#degreeUnit").append('<option value="0" selected="selected">Fahrenheit</option>');
			$("#degreeUnit").append('<option value="1">Celsius</option>');
		}
		if(temperatureUnit !== undefined && temperatureUnit == 1){
			$("#degreeUnit").append('<option value="0">Fahrenheit</option>');
			$("#degreeUnit").append('<option value="1" selected="selected">Celsius</option>');
		}
	$('#degreeUnit').selectmenu('refresh', true);
}

function disableAtStart(){
	 //$("#temperature").roundSlider("disable");
	 isSliderActive = sliderState.INACTIVE;
	 $('#newSvg').css('opacity', 0.5);
	 $('#increment').css('z-index', 0);
	 $('#decrement').css('z-index', 0);
	 $('#increment').css('opacity', 0.5);
	 $('#decrement').css('opacity', 0.5);
	 $('#upperTemperatureValue').css('opacity', 0.5);
	 $('#currentModeInfoDiv').slideDown();
	 $('#fanSpin').css('z-index',99);
	 $('#fanSpin').css('top', '76%');
	 $('#fanSpin').css('font-size','26pt');
	 
}

function enableUIControls(){
	// $("#temperature").roundSlider("enable");
	 isSliderActive = sliderState.ACTIVE;
	 $('#newSvg').css('opacity', 1.0);
	 $('#increment').css('z-index', 10);
	 $('#decrement').css('z-index', 10);
	 $('#increment').css('opacity', 1.0);
	 $('#decrement').css('opacity', 1.0);
	 $('#upperTemperatureValue').css('opacity', 1.0);
	 $('#currentModeInfoDiv').slideUp();
	 $('#fanSpin').css('z-index',100);
	 $('#fanSpin').css('top', '68%');
	 $('#fanSpin').css('font-size','35pt');
}

function selectedModeToSet(dataMode){
	var setMode;
	switch(dataMode){
		case "AUTO":
			modeToSet = thermostatMode.AUTO;
			setMode = '[data-mode="AUTO"]';
			$('#slideToSet').slider('enable');
			$('#slideToSet').slider('refresh');
			//$('#schedulerFanControlDiv').slideDown();
			break;
		case "HEAT":
			modeToSet = thermostatMode.HEAT;
			setMode = '[data-mode="HEAT"]';
			$('#slideToSet').slider('enable');
			$('#slideToSet').slider('refresh');
			//$('#schedulerFanControlDiv').slideDown();
			break;
		case "COOL":
			modeToSet = thermostatMode.COOL;
			setMode = '[data-mode="COOL"]';
			$('#slideToSet').slider('enable');
			$('#slideToSet').slider('refresh');
			//$('#schedulerFanControlDiv').slideDown();
			break;
		case "FAN":
			modeToSet = thermostatMode.FAN;
			setMode = '[data-mode="FAN"]';
			$('#slideToSet').slider('disable');
			$('#slideToSet').slider('refresh');
			//$('#schedulerFanControlDiv').slideUp();
			break;
		case "OFF":
			modeToSet = thermostatMode.OFF;
			setMode = '[data-mode="OFF"]';
			$('#slideToSet').slider('disable');
			$('#slideToSet').slider('refresh');
			//$('#schedulerFanControlDiv').slideUp();
			break;
	}
	return setMode;
}
  
function scheduleListInit(){
			
	$('.collapsibleDiv h3 span').click(function(event) {
		var idSplit = ($(this).attr('id')).split('-');
		var scheduleIndex = idSplit[1];
		if(schedulerEvents[scheduleIndex].title !== undefined || schedulerEvents[scheduleIndex].title !== null){
			//activeScheduleId = (schedulerEvents[scheduleIndex].id).toString();
			var scheduleId = (schedulerEvents[scheduleIndex].id).toString();
			//var scheduleId = activeScheduleId;
			//updateRunningSchedule(scheduleId);
			//showAllSchedules();
			//showActiveSchedule();
			//ToDo - reflect active schedule changes in server. make a post call here.
			setActiveSchedule(scheduleId);
			event.stopImmediatePropagation();
			event.preventDefault();
		}
		scheduleListInit();
	});
	
	$('#scheduleOff').click(function(event) {
		//scheduleRunningState = false;
		//activeScheduleId = "f";
		//showAllSchedules();
		//showActiveSchedule();
		//ToDo - set schedule Off
		setActiveSchedule("0f");
	});
	
	
	$('.collapsibleDiv .editSchedule').on("vmouseup", function(event) {
		var idSplit = ($(this).attr('id')).split('-');
		var index = idSplit[1];
		var name = schedulerEvents[index].title;
		var id = schedulerEvents[index].id;
		//if(type == 'Range'){
			var startDate = schedulerEvents[index].startDate;
			var endDate = schedulerEvents[index].endDate;
			repeatTracker = schedulerEvents[index].days;
			sessionInfo["title"] = name;
			sessionInfo["id"] = id; 
			sessionInfo["startDate"] = startDate;
			sessionInfo["endDate"] = endDate;
			sessionInfo["days"] = repeatTracker;
			sessionInfo["index"] = index;
			/*if(typeof(Storage)!=="undefined") {
				sessionStorage.clear();
				sessionStorage.title = name;
				sessionStorage.id = id; 
				sessionStorage.startDate = startDate;
				sessionStorage.endDate = endDate;
				sessionStorage.days = repeatTracker;
				sessionStorage.index = index;
			}else{
				alertPopup("Your browser doesn't support Storage, Please try upgrading");
			}*/
		//}
		/*if(type == 'Repeat'){
			repeatTracker = schedulerEvents[index].days;
			if(typeof(Storage)!=="undefined") {
				sessionStorage.clear();
				sessionStorage.title = name;
				sessionStorage.type = type; 
				sessionStorage.days = repeatTracker;
				sessionStorage.index = index;
			}
			else{
				alert("Your browser doesn't support Storage, Please try upgrading");
			}
		}*/
		timingsArray = [];
		timingsArray = schedulerEvents[index].time;
		// store some data
		currentManipulationType = manipulationType.EDIT;
		currentTimingType = manipulationType.ADD;
		// Change page
		$.mobile.changePage("#modification");		
	});
}
	
function timingsListInit(){
	
	//re -initializing slider here
	if(temperatureUnit == 0){
        scheduleTemperatureValue = 73;
        timingTemperatureDiv = '<span style="font-size:40pt;">'+scheduleTemperatureValue+'<sup class="supUnit"><i class="wi wi-fahrenheit"></i></sup></span>';
    }//Hardcoded for reinitialisation at this temperature
	else if(temperatureUnit == 1){
        scheduleTemperatureValue = 23;
        timingTemperatureDiv = '<span style="font-size:40pt;">'+scheduleTemperatureValue+'<sup class="supUnit"><i class="wi wi-celsius"></i></sup></span>';
    }
	$('#slideToSet').val(scheduleTemperatureValue).slider("refresh");
	scheduleTemperatureValue = $("#slideToSet").val();
	
	$("#timingTemperature").html(timingTemperatureDiv);
	
	/*
	$('#time .edit').on("vmouseup", function(event) {
		if($(this).attr('id') != undefined){
			$('html, body').animate({
				scrollTop: $("#actionDiv").offset().top
			}, 1000);
			var idSplit = ($(this).attr('id')).split('-');
			var index = idSplit[1];
			currentTimingType = manipulationType.EDIT; //switching to timing edit mode
			currentTimingEditIndex = index;
			var fromTime = moment(timingsArray[index].startTime).format("HH:mm");
			//var toTime = moment(timingsArray[index].endTime).format("HH:mm");
			var mode = thermostatMode.properties[timingsArray[index].mode].name.toUpperCase();
			var temperature;
			if((timingsArray[index].mode == 0) || (timingsArray[index].mode == 4)){
				timingTemperatureDiv = '<span style="font-size:40pt;">--</span>';
			}else{
				temperature = timingsArray[index].temperature;
				timingTemperatureDiv = '<span style="font-size:40pt;">'+temperature+'<sup class="supUnit"><i class="wi wi-fahrenheit"></i></sup></span>';
				var fanControlValue = (timingsArray[index].fan).toString();
				$("#schedulerFanControl").val(fanControlValue).flipswitch("refresh");
			}
			
			$('#timeFrom').val(fromTime);
			//$('#timeTo').val(toTime);
			
			$('#slideToSet').val(temperature).slider("refresh");
			scheduleTemperatureValue = $("#slideToSet").val();
			//var timingTemperatureDiv = '<span style="font-size:40pt;">'+temperature+'<sup class="supUnit"><i class="wi wi-fahrenheit"></i></sup></span>';
			$("#timingTemperature").html(timingTemperatureDiv);
			
			$("#add-time").html("Save Time");
			$("#delete-time").css({"visibility":"visible"});
			
			var modeToSetInit = selectedModeToSet(mode);
			var modes = $('#modeSelection .inactiveModeSelection').filter(modeToSetInit);
			$(modes).addClass("activeModeSelection");
			$("#modeSelection .inactiveModeSelection").not(modes).removeClass("activeModeSelection");
			$(modes).find(".modeDesc").css("visibility","visible");
			$("#modeSelection .inactiveModeSelection").not(modes).find(".modeDesc").css("visibility","hidden");	
		}
	});*/
}
	

function populateThermostat(){
    var grid = document.getElementById('grid');
	while( grid.hasChildNodes() ){
		grid.removeChild(grid.lastChild);
	}
	var addthermostat = '<li id="addNewThermostat"><div class="thermoAdd"><i class="fa fa-plus"></i></div><span class="thermoName">Add</span></li>';
	$(addthermostat).appendTo('#grid');
	if(typeof(Storage) !== "undefined") {
		var thermostat;
		for (var i = 0; i < $.jStorage.index().length; i++){
			if($.jStorage.index()[i] !== "Last Configured"){
				if($.jStorage.index()[i] == $.jStorage.get("Last Configured")){
					thermostat = '<li id="'+ $.jStorage.index()[i] +'" class="selectedThermo"><div class="thermo">J</div></span><span class="thermoIP">' + $.jStorage.get($.jStorage.index()[i]) + '</span><span class="thermoName">' + ($.jStorage.index()[i]) + '</li>';
					$('#ipName').val($.jStorage.index()[i]);
					if(ipAddress !== undefined || ipAddress !== null){
						var ipSplit = (ipAddress).split('.');
						$('#form_ip_octet_1').val(ipSplit[0]);
						$('#form_ip_octet_2').val(ipSplit[1]);
						$('#form_ip_octet_3').val(ipSplit[2]);
						$('#form_ip_octet_4').val(ipSplit[3]);
					}
				}else{
					thermostat = '<li id="'+ $.jStorage.index()[i] +'"><div class="thermo">J</div></span><span class="thermoIP">' + $.jStorage.get($.jStorage.index()[i]) + '</span><span class="thermoName">' + ($.jStorage.index()[i]) + '</li>';		
				}
				$(thermostat).appendTo('#grid');
			}
		}
	}
	
	//binding touchend listener for dynamically created list of thermostat
	
	$('#grid li').on("vmousedown", function (e) {
		var thermostatId = $(this).attr("id");
		if(thermostatId == "addNewThermostat"){
			$('#addThermoDiv').slideDown();
			$('#ipName').textinput('enable');
			$('#ipName').val("");
			$('#form_ip_octet_1').val("");
			$('#form_ip_octet_2').val("");
			$('#form_ip_octet_3').val("");
			$('#form_ip_octet_4').val("");			
		}else{
			$(this).addClass("selectedThermo");
			$('#grid li').not($(this)).removeClass("selectedThermo");
			ipAddress = $.jStorage.get(thermostatId);
			$.jStorage.set("Last Configured", thermostatId); //Updating lastip
			$('#ipName').val(thermostatId);	
			$('#ipName').textinput('disable');
			if(ipAddress !== undefined || ipAddress !== null){
				var ipSplit = (ipAddress).split('.');
				$('#form_ip_octet_1').val(ipSplit[0]);
				$('#form_ip_octet_2').val(ipSplit[1]);
				$('#form_ip_octet_3').val(ipSplit[2]);
				$('#form_ip_octet_4').val(ipSplit[3]);
			}
		}
	});
}
    
	
(function () {

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);


    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        window.addEventListener("batterystatus", onBatteryStatus, false);
        window.addEventListener("batterycritical", onBatteryCritical, false);
        window.addEventListener("batterylow", onBatteryLow, false);
        document.addEventListener('onDOMContentLoaded', jQueryInit(), false);
		
		
		getLocation();
		//StatusBar.hide();
		//StatusBar.backgroundColorByHexString("#C0C0C0");
        //alert("Device is ready");
		//navigator.splashscreen.hide();
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }
	
    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }

    function onBatteryStatus(info) {
        // The battery level and plugged/unplugged status
        updateBatteryUI(info.level, info.isPlugged);
    }
    function onBatteryCritical(info) {
        alert("Battery Level Critical " + info.level + "%\nRecharge Soon!");
    }
    function onBatteryLow(info) {
        alert("Battery Level Low " + info.level + "%");
    }

    // Handle the online event
    //
    function onOnline() {
		$('.noWifi').css({"visibility":"hidden"});
		$('.wifi').css({"color":"white"});
    }

    function onOffline() {
		$('.noWifi').css({"visibility":"visible"});
		$('.wifi').css({"color":"grey"});
		
		$("#temperatureValue").html("-_-");
		//$("#degreeO").html("");
		$("#temperatureUnit").html("");
		$("#currentMode").html("");
		$("#fanSpin").html("");
		
		//hideDetailsfromServer();
		
        //alert("Network Status:  Error connecting to network");
        //navigator.app.exitApp();
    }
	
	$("#temperature").roundSlider({
        radius: 130,
        min: minTemperature*10,
        max: maxTemperature*10,
        step: 1,
        width: 36,
        circleShape: "pie",
        showTooltip: false,
        value: currentTemperature*10,
        startAngle: 350
    });
	
		
	//updateGradient(incrementCounter);
	//$("#temperatureValue").html(initialTemperature);
	//$("#upperTemperatureValue").html(currentTemperature+'<sup style="font-size:15pt; letter-spacing: 3px;">o</sup>F');
   // temperatureSlider = $("#temperature").data("roundSlider");
	//$("#temperature").roundSlider("disable");
	
	if ((screen.width>=960) && (screen.height>=600)){
	 temperatureSlider.option("radius", 180);
	}
	if ((screen.width>=600) && (screen.height>=960)){
	 temperatureSlider.option("radius", 180);
	}
	if ((screen.width>=1024) && (screen.height>=768)){
	 temperatureSlider.option("radius", 220);
	}
	if ((screen.width>=768) && (screen.height>=1024)){
	 temperatureSlider.option("radius", 220);
	}
	if ((screen.width>=1280) && (screen.height>=800)){
	 temperatureSlider.option("radius", 220);
	}
	if ((screen.width>=800) && (screen.height>=1280)){
	 temperatureSlider.option("radius", 220);
	}
	if ((screen.height>=450) && (screen.height<=550)){
	 temperatureSlider.option("radius", 110);
	}
	
	
    $("#temperature").on("stop", function (e) {
		var currentValue = Math.round(temperatureSlider.getValue()/10);
        //$("#temperatureValue").html(currentValue);
		$("#upperTemperatureValue").html(currentValue+''+temperatureUnitSymbol);
        //incrementCounter = currentValue - (minTemperature + 1);
        //updateGradient(incrementCounter);
		//$('#temperature .rs-handle').css("background-color","#fff");
		
		//Need to set mode instead of set temperature
		var value = currentMode + "," + currentValue;//getModeValue(currentMode, currentValue); //
		switch(currentMode){
			case "1":
				if(currentValue == initialHeatSetPoint){
					isUserInteracting = false;
					isSliderActive = sliderState.INACTIVE;
					sliderEnableOnModeSelection();
				}
				break;
			case "2":
				if(currentValue == initialCoolSetPoint){
					isUserInteracting = false;
					isSliderActive = sliderState.INACTIVE;
					sliderEnableOnModeSelection();
				}
				break;
			case "3":
				if(currentValue == initialAutoSetPoint){
					isUserInteracting = false;
					isSliderActive = sliderState.INACTIVE;
					sliderEnableOnModeSelection();
				}
				break;
		}
		//setMode(value);
		//isUserInteracting = false;
		//isSliderActive = sliderState.INACTIVE;
		//sliderEnableOnModeSelection();
	});

    $("#temperature").on("drag", function (e) {
        //$("#temperatureValue").html(e.value);
		var currentValue = Math.round(temperatureSlider.getValue()/10);
		//if(parseInt(temperatureUnit) == 0){
			$("#upperTemperatureValue").html(currentValue+''+temperatureUnitSymbol);
		//}if(parseInt(temperatureUnit) == 1){
			//$("#upperTemperatureValue").html(currentValue+'<sup style="font-size:15pt; letter-spacing: 3px;">o</sup>C');
		//}
        //incrementCounter = 73 - (minTemperature + 1);
        //updateGradient(incrementCounter);
		//$('#temperature .rs-handle').css("background-color","#808080");
		isUserInteracting = true;
		sliderEnableOnModeSelection();
    });

    $("#temperature").on("start", function (e) {
		var currentValue = Math.round(temperatureSlider.getValue()/10);
        //$("#temperatureValue").html(currentValue);
		$("#upperTemperatureValue").html(currentValue+''+temperatureUnitSymbol);
		isUserInteracting = true;
		sliderEnableOnModeSelection();
    });

    $("#temperature").on("change", function (e) {
		var currentValue = Math.round(temperatureSlider.getValue()/10);
		$("#upperTemperatureValue").html(currentValue+''+temperatureUnitSymbol);
        //incrementCounter = e.value - (minTemperature+1);
        //updateGradient(incrementCounter);
		var value = currentMode + "," + currentValue;
		setMode(value);
		//isUserInteracting = true;
		//enableUIControls();
		clearTimeout(timer);
		timer = setTimeout(function(){
			isUserInteracting = false;
			isSliderActive = sliderState.INACTIVE;
			sliderEnableOnModeSelection();
		}, 2000);
    });

    $("#increment").on("vmouseup", function (e) {
        var currentValue = Math.round(temperatureSlider.getValue()/10);
        if (currentValue < maxTemperature){
			currentValue = currentValue + 1;
            temperatureSlider.setValue(currentValue*10);
		}
		$("#upperTemperatureValue").html(currentValue+''+temperatureUnitSymbol);
        //incrementCounter = temperatureSlider.getValue() - (minTemperature + 1);
        //updateGradient(incrementCounter);
		var value = currentMode + "," + currentValue;
		setMode(value);
		isUserInteracting = true;
		//sliderEnableOnModeSelection();
		enableUIControls();
		clearTimeout(timer);
		timer = setTimeout(function(){
			isUserInteracting = false;
			//disableAtStart();
			sliderEnableOnModeSelection();
		}, 1000);
    });
	/*$("#increment").on("touchend", function (e) {
		//isUserInteracting = false;
		isSliderActive = sliderState.INACTIVE;
		sliderEnableOnModeSelection();
    });*/

    $("#decrement").on("vmouseup", function (e) {
        var currentValue = Math.round(temperatureSlider.getValue()/10);
        if (currentValue > minTemperature){
			currentValue = currentValue - 1;
            temperatureSlider.setValue(currentValue*10);
		}
        $("#upperTemperatureValue").html(currentValue+''+temperatureUnitSymbol);
        //incrementCounter = temperatureSlider.getValue() - (minTemperature + 1);
        //updateGradient(incrementCounter);
		var value = currentMode + "," + currentValue;
		setMode(value);
		isUserInteracting = true;
		enableUIControls();
		clearTimeout(timer);
		timer = setTimeout(function(){
			isUserInteracting = false;
			//disableAtStart();
			sliderEnableOnModeSelection();
		}, 1000);

    });
	/*$("#decrement").on("touchend", function (e) {
		//isUserInteracting = false;
		isSliderActive = sliderState.INACTIVE;
		sliderEnableOnModeSelection();
    });*/


    $("nav ul li").on("vmouseup", function () {
	    var xcoord = $(this).data("xcoord");
		var marginValue;
		var mode;
		var change = false;
		var modeON = false;
		var value;
		userModeChanging = true;
		switch(xcoord){
			case "iconCalendar":
				marginValue = "8.33%";
				mode = "Scheduler";
				userModeChanging = false;
				break;
			case "iconSunny":
				marginValue = "24.99%";
				mode = "Heat";
				if(currentHeatState == thermostatModeState.ON){
					//makeAllOff();
					userModeChanging = false;
					sliderEnableOnModeSelection();
					//alertPopup("Any mode needs to be selected");
				}else if(currentHeatState == thermostatModeState.OFF){
					makeAllOff();
					currentThermostatMode = thermostatMode.HEAT;
					currentHeatState = thermostatModeState.ON;
					//currentFanState = thermostatModeState.ON;
					value = "1," + initialHeatSetPoint;
					$("#upperTemperatureValue").html(initialHeatSetPoint+''+temperatureUnitSymbol);
					setMode(value);
					currentMode = "1";
					enableUIControls();
					clearTimeout(timer);
					timer = setTimeout(function(){ 
						disableAtStart();
					}, 15000);
					modeON = true;
				}
				break;
			case "iconSnow":
				marginValue = "41.65%";
				mode = "Cool";
				if(currentCoolState == thermostatModeState.ON){
					//makeAllOff();
					userModeChanging = false;
					sliderEnableOnModeSelection();
					//alertPopup("Any mode needs to be selected");
				}else if(currentCoolState == thermostatModeState.OFF){
					makeAllOff();
					currentThermostatMode = thermostatMode.COOL;
					currentCoolState = thermostatModeState.ON;
					//currentFanState = thermostatModeState.ON;
					value = "2," + initialCoolSetPoint;
					$("#upperTemperatureValue").html(initialCoolSetPoint+''+temperatureUnitSymbol);					
					setMode(value);
					currentMode = "2";
					enableUIControls();
					clearTimeout(timer);
					timer = setTimeout(function(){ 
						disableAtStart();
					}, 15000);
					modeON = true;
				}		
				break;
			case "iconAuto":
				marginValue = "58.31%";
				mode = "Auto";
				if(currentAutoState == thermostatModeState.ON){
					//makeAllOff();
					userModeChanging = false;
					sliderEnableOnModeSelection();
					//alertPopup("Any mode needs to be selected");
				}else if(currentAutoState == thermostatModeState.OFF){
					makeAllOff();
					currentThermostatMode = thermostatMode.AUTO;
					currentAutoState = thermostatModeState.ON;
					//currentFanState = thermostatModeState.ON;
					value = "3," + initialAutoSetPoint;
					$("#upperTemperatureValue").html(initialAutoSetPoint+''+temperatureUnitSymbol);
					setMode(value);
					currentMode = "3";
					enableUIControls();
					clearTimeout(timer);
					timer = setTimeout(function(){ 
						disableAtStart();
					}, 15000);
					modeON = true;
				}
				break;
			case "iconFan":
				//check if manual fanOffcondition is true
					marginValue = "74.97%";
					mode = "Fan";
					makeAllOff();
					currentThermostatMode = thermostatMode.FAN;
					currentMode = "4";
					setMode("4");	//make fan on condition.
					disableAtStart();
					modeON = true;
				break;
			case "iconPower":
				if(currentThermostatMode !== thermostatMode.OFF){
					change = true;
					currentMode = "0";
				}
				break;
			default:
				break;
		}		
		if(modeON === true){
			$(this).addClass("activeMode");
			//$('#iconFan').addClass("runningFanMode");
			$(this).find(".modeDesc").css("visibility","visible");
		}
		
	
		//$(this).toggleClass( "activeMode" );
		
		if(change === true){
			//confirmDialog("Are you sure?", "Mode Off", function(){
				marginValue = "90.53%";
				mode = "Power Off";
				makeAllOff();
				currentThermostatMode = thermostatMode.OFF;
				setMode("0");
				disableAtStart();
					$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
					$('#iconPower').addClass("activeMode");
					$("nav ul li").not('#iconPower').removeClass("activeMode");
					$('#iconPower').find(".modeDesc").css("visibility","visible");
					$("nav ul li").not('#iconPower').find(".modeDesc").css("visibility","hidden");
			//});
			userModeChanging = false;
		}//else{
			//$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
			//$(this).addClass("activeMode");
			//$("nav ul li").not(this).removeClass("activeMode");
			//$(this).find(".modeDesc").css("visibility","visible");
			//$("nav ul li").not(this).find(".modeDesc").css("visibility","hidden");
		//}
		
		//$('#currentModeIcon').attr("src", thermostatMode.properties[currentThermostatMode].icon);
		//$('#currentMode').html(thermostatMode.properties[currentThermostatMode].name);	
    });
	
    function jQueryInit() {
        if (jQuery) {
            console.log("jQuery loaded successfully");
        }
    }
		
})();


function sliderEnableOnModeSelection(){
	if(isSliderActive == sliderState.INACTIVE && isUserInteracting === false) {
		if(currentMode != "4" && currentMode != "0"){
			enableUIControls();
		}
		clearTimeout(timer);
		timer = setTimeout(function(){
			isUserInteracting = false;
			disableAtStart();
			}, 15000);
	 }else{
		clearTimeout(timer);
		//isSliderActive = sliderState.INACTIVE;
		//sliderEnableOnModeSelection();
	 }
}

function makeAllOff(){
	currentHeatState = thermostatModeState.OFF;
	currentCoolState = thermostatModeState.OFF;
	currentAutoState = thermostatModeState.OFF;
	currentFanState = thermostatFanState.AUTO;
	$("nav ul li").removeClass("activeMode");
	$("nav ul li").find(".modeDesc").css("visibility","hidden");
}

function updateBatteryUI(level, plugged) {
	$(".battery .level").css("width", level + "%");
	if (plugged) {
		$("#batteryLife").removeClass("battery").addClass("battery plugged");
		$("#batteryLif").removeClass("battery").addClass("battery plugged");
	}
	else {
		$("#batteryLife").removeClass("battery plugged").addClass("battery");
		$("#batteryLif").removeClass("battery plugged").addClass("battery");
	}
}

function heatGradient(){
	incrementCounter = maxTemperature - (minTemperature + 1);
	updateGradient(incrementCounter);
	$('#temperature .rs-handle').css("background-color","#fff");
}
function coolGradient(){
	incrementCounter = minTemperature - (minTemperature + 1);
	updateGradient(incrementCounter);
	$('#temperature .rs-handle').css("background-color","#fff");
}
function autoGradient(){
	incrementCounter = 8;//73 - (minTemperature + 1);
	updateGradient(incrementCounter);
	$('#temperature .rs-handle').css("background-color","rgba(0,0,0,0.7)");
}
function fanGradient(){
	incrementCounter = 8; //74 - (minTemperature + 1);
	updateGradient(incrementCounter);
	$('#temperature .rs-handle').css("background-color","rgba(0,0,0,0.7)");
}
function offGradient(){
	incrementCounter = 8; //74 - (minTemperature + 1);
	updateGradient(incrementCounter);
	$('#temperature .rs-handle').css("background-color","rgba(0,0,0,0.7)");
}

function updateGradient(counter) {
	var saturation;
	var colorDefault = "hsl(0, 0%, 100%)";
	var midValue = Math.round(temperatureCount/2);
	if (counter < midValue) {
		saturation = 50 + (counter) * (50 / midValue);
		$(".rs-block .rs-inner").css({
			"box-shadow": "0 0 25px 3px hsl(208, 100%, " + saturation + "%), 0 0 50px 3px hsl(208, 100%, " + saturation + "%) inset"
		});
		
		var color = "hsl(208, 100%, " + saturation + "%)";
		var color1 = "hsl(223, 100%, " + saturation + "%)";
		changeGradient($("#newSvg svg")[0],'MyGradient',[
			{offset:'10%', 'stop-color':colorDefault},
			{offset:'30%', 'stop-color':color},
			{offset:'95%','stop-color':color1}
		]);
		$('#newSvg svg path').attr('fill','url(#MyGradient)');
		
		var left = $(".left-glow");
		var top = $(".top-glow");
		var right = $(".right-glow");
		var bottom = $(".bottom-glow");
			left.css("background", "-webkit-radial-gradient(0% 50%, 60px 50%, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)"	);
			left.css("background", "-0-radial-gradient(0% 50%, 60px 50%, hsla(208, 100%, " + saturation + "%, 085) 0%, rgba(255, 255, 255, 0) 100%)"	);
			left.css("background", "-moz-radial-gradient(0% 50%, 60px 50%, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			left.css("background", "-ms-radial-gradient(0% 50%, 60px 50%, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			left.css("background", "radial-gradient(0% 50%, 60px 50%, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)"	);
			
			top.css("background", "-webkit-radial-gradient(50% 0%, 68% 60px, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			top.css("background", "-o-radial-gradient(50% 0%, 68% 60px, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			top.css("background", "-moz-radial-gradient(50% 0%, 68% 60px, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			top.css("background", "-ms-radial-gradient(50% 0%, 68% 60px, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			top.css("background", "radial-gradient(50% 0%, 68% 60px, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			
			right.css("background", "-webkit-radial-gradient(100% 50%, 60px 50%, hsla(208, 100%, " + saturation + "%, 0.7) 0%, rgba(165, 18, 18, 0) 100%)");
			right.css("background", "-o-radial-gradient(100% 50%, 60px 50%, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(165, 18, 18, 0) 100%)");
			right.css("background", "-moz-radial-gradient(100% 50%, 60px 50%, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(165, 18, 18, 0) 100%)");
			right.css("background", "-ms-radial-gradient(100% 50%, 60px 50%, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(165, 18, 18, 0) 100%)");
			right.css("background", "radial-gradient(100% 50%, 60px 50%, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(165, 18, 18, 0) 100%)");
			
			bottom.css("background", "-webkit-radial-gradient(50% 100%, 68% 60px, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			bottom.css("background", "-o-radial-gradient(50% 100%, 68% 60px, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			bottom.css("background", "-moz-radial-gradient(50% 100%, 68% 60px, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			bottom.css("background", "-ms-radial-gradient(50% 100%, 68% 60px, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			bottom.css("background", "radial-gradient(50% 100%, 68% 60px, hsla(208, 100%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
				
		
	}
	if (counter > midValue) {
		counter = counter - midValue;
		saturation = 100 - ((50 / midValue) * (counter));
		$(".rs-block .rs-inner").css({
			"box-shadow": "0 0 25px 3px hsl(27, 97%, " + saturation + "%), 0 0 50px 3px hsl(27, 97%, " + saturation + "%) inset"
		});
		
		var color = "hsl(56, 100%, " + saturation + "%)";
		var color1 = "hsl(27, 97%, " + saturation + "%)";
		changeGradient($("#newSvg svg")[0],'MyGradient',[
			{offset:'10%', 'stop-color':colorDefault},
			{offset:'30%', 'stop-color':color},
			{offset:'95%','stop-color':color1}
		]);
		$('#newSvg svg path').attr('fill','url(#MyGradient)');
		
		var left = $(".left-glow");
		var top = $(".top-glow");
		var right = $(".right-glow");
		var bottom = $(".bottom-glow");
			left.css("background", "-webkit-radial-gradient(0% 50%, 60px 50%, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)"	);
			left.css("background", "-0-radial-gradient(0% 50%, 60px 50%, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)"	);
			left.css("background", "-moz-radial-gradient(0% 50%, 60px 50%, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			left.css("background", "-ms-radial-gradient(0% 50%, 60px 50%, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			left.css("background", "radial-gradient(0% 50%, 60px 50%, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)"	);
			
			top.css("background", "-webkit-radial-gradient(50% 0%, 68% 60px, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			top.css("background", "-o-radial-gradient(50% 0%, 68% 60px, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			top.css("background", "-moz-radial-gradient(50% 0%, 68% 60px, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			top.css("background", "-ms-radial-gradient(50% 0%, 68% 60px, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			top.css("background", "radial-gradient(50% 0%, 68% 60px, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			
			right.css("background", "-webkit-radial-gradient(100% 50%, 60px 50%, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(165, 18, 18, 0) 100%)");
			right.css("background", "-o-radial-gradient(100% 50%, 60px 50%, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(165, 18, 18, 0) 100%)");
			right.css("background", "-moz-radial-gradient(100% 50%, 60px 50%, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(165, 18, 18, 0) 100%)");
			right.css("background", "-ms-radial-gradient(100% 50%, 60px 50%, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(165, 18, 18, 0) 100%)");
			right.css("background", "radial-gradient(100% 50%, 60px 50%, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(165, 18, 18, 0) 100%)");
			
			bottom.css("background", "-webkit-radial-gradient(50% 100%, 68% 60px, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			bottom.css("background", "-o-radial-gradient(50% 100%, 68% 60px, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			bottom.css("background", "-moz-radial-gradient(50% 100%, 68% 60px, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			bottom.css("background", "-ms-radial-gradient(50% 100%, 68% 60px, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			bottom.css("background", "radial-gradient(50% 100%, 68% 60px, hsla(27, 97%, " + saturation + "%, 0.8) 0%, rgba(255, 255, 255, 0) 100%)");
			
	}
	
}
function changeGradient(svg, id, stops){
	var defs = svg.childNodes[1];
	var gradient = defs.childNodes[1];
	for (var i=0;i<stops.length;i++){
		var attrs = stops[i];
		var stop = gradient.childNodes[2*i+1];
		for (var attr in attrs){
			if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr,attrs[attr]);
		}
	}
}

/*
function showSchedules() {	
    var myTableDiv = document.getElementById('upTable');
	while( myTableDiv.hasChildNodes() ){
		myTableDiv.removeChild(myTableDiv.lastChild);
	}
	if(schedulerEvents.length === 0){
		myTableDiv.appendChild(document.createTextNode("You have not created any schedule yet."));
		myTableDiv.style.marginTop="10px";
	}else{
		for (var m=0; ((m<schedulerEvents.length)&&(m<3)); m++){	//schedulerEvents.length - limiting it to two
			var scheduleTitle = schedulerEvents[m].title;
			var scheduleId = (schedulerEvents[m].id).toString();
			if(scheduleId == activeScheduleId){continue;}
			var scheduleDuration = moment(schedulerEvents[m].startDate).format("MMM DD") +" - "+ moment(schedulerEvents[m].endDate).format("MMM DD");*/
			/*if(schedulerEvents[m].type == "Repeat"){
				scheduleDuration = parseRepeatWeekDays(schedulerEvents[m].days);			//"Mo Tu We Th Fr Sa Su";	//ToDo - get Repeating days here
				$('.week').prop("checked", false);
			}*/		
		/*	var weekDaysDuration = parseRepeatWeekDays(schedulerEvents[m].days);

			var table = document.createElement('TABLE');
			table.className ="table"; 
			var tableBody = document.createElement('TBODY');
			table.appendChild(tableBody);
			
			var daysDuration = scheduleDuration+'<div style="font-size: 0.8em;text-shadow: none;">'+weekDaysDuration+'</div>';
			
			
			var tableBackground = "-webkit-linear-gradient(top, #020e3d, #2980b9)";
			var tableTitle = document.createElement('TABLE');
			tableTitle.className ="tableTitle";
			tableTitle.style.marginTop="10px";
			tableTitle.style.color="#FFF";
			var tableTitleBody = document.createElement('TBODY');
			tableTitle.appendChild(tableTitleBody);
			var trTitle = document.createElement('TR');
			tableTitleBody.appendChild(trTitle);
				var th = document.createElement('TH');
				th.className = "table-th title";
				var the = document.createElement('TH');
				the.className = "table-th duration";
				th.appendChild(document.createTextNode(scheduleTitle));
				//the.appendChild(document.createTextNode(scheduleDuration));
				the.innerHTML = daysDuration;
				trTitle.appendChild(th); 
				trTitle.appendChild(the); 
			
			//Adding extra 00:00 to 'whatever' information. 
			var tr = document.createElement('TR');
			tableBody.appendChild(tr);
			var timingsLen = schedulerEvents[m].time.length;
			var indexZeroTime = (schedulerEvents[m].time[0].startTime).format("HH:mm");
			if(indexZeroTime != "00:00"){
				var timings = schedulerEvents[m].time[timingsLen-1];
				if(schedulerEvents[m].time[0] != undefined){
					var endTime = moment(schedulerEvents[m].time[0].startTime).subtract(1, 'minutes');  //timings.endTime;		//Assumption - Timings will be sorted. So, just adding end time as start time of next timing
				}
				var intmode = parseInt(timings.mode);
				var mode = thermostatMode.properties[intmode].name;
				var temperature = timings.temperature;
				var timeTo = moment(endTime).format("HH:mm");
			   
				var firstCell = getThermostatModeIcon(mode, temperature);
				var secondCell = '  '+'00:00'+ '  -  ' +timeTo;
			   
				for (var j=0; j<2; j++){
					var td = document.createElement('TD');
					if(j==0){
						td.className = "table-tdo";
						td.innerHTML = firstCell;
					}
					else{
						td.className = "table-td";
						td.innerHTML = secondCell;
					}
					tr.appendChild(td);
				}
			}
				  
			for (var i=0; i<schedulerEvents[m].time.length; i++){
				var tr = document.createElement('TR');
				tableBody.appendChild(tr);
			   
				var timings = schedulerEvents[m].time[i];
				var startTime = timings.startTime;
			   	if(schedulerEvents[m].time[i+1] != undefined){
					var endTime = moment(schedulerEvents[m].time[i+1].startTime).subtract(1, 'minutes');  //timings.endTime;		//Assumption - Timings will be sorted. So, just adding end time as start time of next timing
				}else{var endTime = moment(moment("23:59", "HH:mm").format('YYYY-MM-DD HH:mm'));}
				
				var intmode = parseInt(timings.mode);
				var mode = thermostatMode.properties[intmode].name;
				var temperature = timings.temperature;
			   
				var timeFrom = moment(startTime).format("HH:mm");
				var timeTo = moment(endTime).format("HH:mm");
			   
				var firstCell = getThermostatModeIcon(mode, temperature);
				var secondCell = '  '+timeFrom + ' - ' +timeTo;
			   
				for (var j=0; j<2; j++){
					var td = document.createElement('TD');
					if(j==0){
						td.className = "table-tdo";
						td.innerHTML = firstCell;
					}
					else{
						td.className = "table-td";
						td.innerHTML = secondCell;
					}
					tr.appendChild(td);
				}
			}
			myTableDiv.appendChild(tableTitle);
			myTableDiv.appendChild(table);
		}
	}
}*/
/*
function showActiveSchedule() {	
    var myTableDiv = document.getElementById('activeScheduleTable');
	while( myTableDiv.hasChildNodes() ){
		myTableDiv.removeChild(myTableDiv.lastChild);
	}
	for (var m=0; m<schedulerEvents.length; m++){
		var scheduleTitle = schedulerEvents[m].title;
		var scheduleId = (schedulerEvents[m].id).toString();
		if(scheduleId == activeScheduleId){
			$('#scheduleRunning').html(schedulerEvents[m].title);
			$('#runningSchedule').html(schedulerEvents[m].title);
			var scheduleDuration = moment(schedulerEvents[m].startDate).format("MMM DD") +" - "+ moment(schedulerEvents[m].endDate).format("MMM DD");*/
			/*if(schedulerEvents[m].type == "Range"){
				scheduleDuration = moment(schedulerEvents[m].startDate).format("MMM DD") +" - "+ moment(schedulerEvents[m].endDate).format("MMM DD");
			}
			if(schedulerEvents[m].type == "Repeat"){
				scheduleDuration = parseRepeatWeekDays(schedulerEvents[m].days);			//"Mo Tu We Th Fr Sa Su";	//ToDo - get Repeating days here
				$('.week').prop("checked", false);
			}*/
		/*	var weekDaysDuration = parseRepeatWeekDays(schedulerEvents[m].days);
			var daysDuration = scheduleDuration+'<div style="font-size: 0.8em;text-shadow: none;">'+weekDaysDuration+'</div>';
			
			var table = document.createElement('TABLE');
			table.className ="table"; 
			var tableBody = document.createElement('TBODY');
			table.appendChild(tableBody);
			var tableBackground = "-webkit-linear-gradient(top, #020e3d, #2980b9)";
			var tableTitle = document.createElement('TABLE');
			tableTitle.className ="tableTitle";
			tableTitle.style.color="#FFF";
			var tableTitleBody = document.createElement('TBODY');
			tableTitle.appendChild(tableTitleBody);
			var trTitle = document.createElement('TR');
			tableTitleBody.appendChild(trTitle);
				var th = document.createElement('TH');
				th.className = "table-th title";
				var the = document.createElement('TH');
				the.className = "table-th duration";
				th.appendChild(document.createTextNode(scheduleTitle));
				//the.appendChild(document.createTextNode(scheduleDuration));
				the.innerHTML = daysDuration;
				trTitle.appendChild(th); 
				trTitle.appendChild(the);
				
			//Adding extra 00:00 to 'whatever' information. 
			var tr = document.createElement('TR');
			tableBody.appendChild(tr);
			var timingsLen = schedulerEvents[m].time.length;
			var indexZeroTime = (schedulerEvents[m].time[0].startTime).format("HH:mm");
			if(indexZeroTime != "00:00"){
				var timings = schedulerEvents[m].time[timingsLen-1];
				if(schedulerEvents[m].time[0] != undefined){
					var endTime = moment(schedulerEvents[m].time[0].startTime).subtract(1, 'minutes');  //timings.endTime;		//Assumption - Timings will be sorted. So, just adding end time as start time of next timing
				}
				var intmode = parseInt(timings.mode);
				var mode = thermostatMode.properties[intmode].name;
				var temperature = timings.temperature;
				var timeTo = moment(endTime).format("HH:mm");
			   
				var firstCell = getThermostatModeIcon(mode, temperature);
				var secondCell = '  '+'00:00'+ '  -  ' +timeTo;
			   
				for (var j=0; j<2; j++){
					var td = document.createElement('TD');
					if(j==0){
						td.className = "table-tdo";
						td.innerHTML = firstCell;
					}
					else{
						td.className = "table-td";
						td.innerHTML = secondCell;
					}
					tr.appendChild(td);
				}
			}
				
			for (var i=0; i<schedulerEvents[m].time.length; i++){
				var tr = document.createElement('TR');
				tableBody.appendChild(tr);
		   
				var timings = schedulerEvents[m].time[i];
				var startTime = timings.startTime;
				if(schedulerEvents[m].time[i+1] != undefined){
					var endTime = moment(schedulerEvents[m].time[i+1].startTime).subtract(1, 'minutes');  //timings.endTime;		//Assumption - Timings will be sorted. So, just adding end time as start time of next timing
				}else{var endTime = moment(moment("23:59", "HH:mm").format('YYYY-MM-DD HH:mm')); }
				var intmode = parseInt(timings.mode);
				var mode = thermostatMode.properties[intmode].name;
				var temperature = timings.temperature;
				var timeFrom = moment(startTime).format("HH:mm");
				var timeTo = moment(endTime).format("HH:mm");
		   
				var firstCell = getThermostatModeIcon(mode, temperature);
				var secondCell = '  '+timeFrom + '  -  ' +timeTo;
		   
				for (var j=0; j<2; j++){
					var td = document.createElement('TD');
					if(j==0){
						td.className = "table-tdo";
						td.innerHTML = firstCell;
					}else{
						td.className = "table-td";
						td.innerHTML = secondCell;
						}
					tr.appendChild(td);
				}
			}
			myTableDiv.appendChild(tableTitle);
			myTableDiv.appendChild(table);
		}
	}
}*/

function addTimings(timeFrom, /*timeTo,*/ mode, temperatureToSet, indexId) {		//pass parameters here
	var iconDiv = '<img style="max-width:15px; max-height:20px; vertical-align:middle;" src="" alt="icon"/>';
	var degreeDiv = '<span>'+temperatureToSet+'</span><sup><i class="wi wi-fahrenheit"></i></sup>';
	var timeDiv = timeFrom; //+"  to  "+timeTo;		//'11:00 AM to 8:00 PM';
	var editDiv = '<i class="fa fa-pencil"></i>';
	var timingDiv = document.getElementById("time");
		var table = document.createElement('TABLE');
		table.className ="table"; 
		table.style.marginTop="15px";
		table.style.background="#E1ECFF";
		table.style.border="none";
		table.style.borderRadius = "7px";
		var tableBody = document.createElement('TBODY');
		table.appendChild(tableBody);
		
		var tr = document.createElement('TR');
		tableBody.appendChild(tr);
			var icon = document.createElement('TD');
			icon.className = "icon";
			icon.innerHTML = getThermostatModeIcon(mode, temperatureToSet);
			
			/*var degree = document.createElement('TD');
			degree.className = "degree";
			degree.innerHTML = degreeDiv;*/
			
			var time = document.createElement('TD');
			time.className = "time";
			time.innerHTML = timeDiv;
			
			var edit = document.createElement('TD');
			edit.className = "edit";
			if(indexId != undefined){
				edit.id = "editTiming-"+indexId;
			}else{editDiv = " ";}
			edit.innerHTML = editDiv;
			
			tr.appendChild(icon); 
			//tr.appendChild(degree); 
			tr.appendChild(time);
			tr.appendChild(edit);
		timingDiv.appendChild(table);
}

function getThermostatModeIcon(mode, temperature){
	var firstCellValue = null;
	var degreeUnit;
	if(temperatureUnit == 0){degreeUnit = '\"wi wi-fahrenheit\"';}
	else if(temperatureUnit == 1){degreeUnit = '\"wi wi-celsius\"';}
	switch(mode){
		case "Auto":
			firstCellValue = "<span class=\"inactiveModeSelection\" style=\"color:#000\">H</span><span style=\"font-size:15pt;color:#000;\"> "+temperature+"<sup><i class="+degreeUnit+"></i></sup></span>";
			return firstCellValue;
			break;
		case "Heat":
			firstCellValue = "<span class=\"inactiveModeSelection\" style=\"color:#F17C56\">G</span><span style=\"font-size:15pt;color:#F17C56;\"> "+temperature+"<sup><i class="+degreeUnit+"></sup></i></span>";
			return firstCellValue;
			break;
		case "Cool":
			firstCellValue = "<span class=\"inactiveModeSelection\" style=\"color:#1DA5D6\">E</span><span style=\"font-size:15pt;color:#1DA5D6;\"> "+temperature+"<sup><i class="+degreeUnit+"></sup></i></span>";
			return firstCellValue;
			break;
		case "Fan":
			firstCellValue = "<span class=\"inactiveModeSelection\" style=\"color:#308030\">B</span>";
			return firstCellValue;
			break;
		case "Off":
			firstCellValue = "<span class=\"inactiveModeSelection\" style=\"color:#A554D0\">D</span>";
			return firstCellValue;
			break;
		
	}
}
/*
function clearTiming(){
	$('#timeFrom').val("");
	//$('#timeTo').val("");
	$("#add-time").html("Add new time");
	$("#delete-time").css({"visibility":"hidden"});
	currentTimingType = manipulationType.ADD;
	modeToSet = null;
	$("#modeSelection .inactiveModeSelection").removeClass("activeModeSelection");
	$("#modeSelection .inactiveModeSelection").find(".modeDesc").css("visibility","hidden");
}*/
/*
function refreshScheduleWindow(){
	$('#schedule-name').val("");
	$('#startDate').val("");
	$('#endDate').val("");
	$('.week').prop("checked", true);
	$('#repeat').prop("checked", true);
	$("#repeat").trigger("change");
	repeatTracker = 127;
	timingsArray = [];
	scheduleTemperatureValue = 65;
	clearTiming();
	var timingDiv = document.getElementById("time");
	while( timingDiv.hasChildNodes() ){
		timingDiv.removeChild(timingDiv.lastChild);
	}
}*/
/*
function showAllSchedules(){
    var allSchedule = document.getElementById('allSchedule');
	while( allSchedule.hasChildNodes() ){
		allSchedule.removeChild(allSchedule.lastChild);
	}
	if(scheduleRunningState === false){
		var schedulerOffHtml = '<span>Turn scheduler off<span id="scheduleOff" style="float:right;">Activate <i class="fa fa-check-square"></i></span></span>';
		$('#schedulerOff').html(schedulerOffHtml);
		$('#schedulerOff').addClass("offActivated");
	}else if(scheduleRunningState === true){
		var schedulerOffHtml = '<span>Scheduler Off<span id="scheduleOff" style="float:right;">Activate <i style="color:#38c;" class="fa fa-square-o"></i></span></span>';
		$('#schedulerOff').html(schedulerOffHtml);
		$('#schedulerOff').removeClass("offActivated");
	}
	if(schedulerEvents.length !== 0){
		//allSchedule.appendChild(document.createTextNode("You have not created any schedule yet."));
		//allSchedule.style.marginTop="15px";

	//}else{
		var div = '<div data-role="collapsibleset" data-theme="a" data-content-theme="a"></div>';
		for (var m=0; m<schedulerEvents.length; m++){
			var scheduleTitle = schedulerEvents[m].title;
			var scheduleDuration = moment(schedulerEvents[m].startDate).format("MMM DD") +" - "+ moment(schedulerEvents[m].endDate).format("MMM DD");*/
			/*if(schedulerEvents[m].type == "Range"){
				scheduleDuration = moment(schedulerEvents[m].startDate).format("MMM DD") +" - "+ moment(schedulerEvents[m].endDate).format("MMM DD");
			}
			if(schedulerEvents[m].type == "Repeat"){
				scheduleDuration = parseRepeatWeekDays(schedulerEvents[m].days);			//"Mo Tu We Th Fr Sa Su";	//ToDo - get Repeating days here
				$('.week').prop("checked", false);
			}*/
		/*	var weekDaysDuration = parseRepeatWeekDays(schedulerEvents[m].days);
			if(schedulerEvents[m].id == parseInt(activeScheduleId)){
				var divInner = '<div id="activeSchedule" class="collapsibleDiv" data-role="collapsible"><h3>'+scheduleTitle+'<span id="activate-'+m+'" style="float:right;">Activate <i class="fa fa-check-square"></i></span></h3>';
			}else{
				var divInner = '<div class="collapsibleDiv" data-role="collapsible"><h3>'+scheduleTitle+'<span id="activate-'+m+'" style="float:right;">Activate <i class="fa fa-square-o"></i></span></h3>';
			}
			var p = '<p style="margin:0;"></p>';
			var controlGroup = '<div"></div>';
			var edit = '<div style="float:left;" class="editSchedule" id="editSchedule-'+m+'">Edit</div><div style="float:right; text-align:end;">'+scheduleDuration+'<div style="font-size:0.8em; text-align:end;">'+weekDaysDuration+'</div></div>';
			//var activate = '<div style="float:right;">Delete</div>'
			controlGroup = $(controlGroup).append(edit);
			//controlGroup = $(controlGroup).append(activate);
			
			var table = document.createElement('TABLE');
			table.className ="table"; 
			var tableBody = document.createElement('TBODY');
			table.appendChild(tableBody);
			
			//Adding extra 00:00 to 'whatever' information. 
			var tr = document.createElement('TR');
			tableBody.appendChild(tr);
			var timingsLen = schedulerEvents[m].time.length;
			var indexZeroTime = (schedulerEvents[m].time[0].startTime).format("HH:mm");
			if(indexZeroTime != "00:00"){
				var timings = schedulerEvents[m].time[timingsLen-1];
				if(schedulerEvents[m].time[0] != undefined){
					var endTime = moment(schedulerEvents[m].time[0].startTime).subtract(1, 'minutes');  //timings.endTime;		//Assumption - Timings will be sorted. So, just adding end time as start time of next timing
				}
				var intmode = parseInt(timings.mode);
				var mode = thermostatMode.properties[intmode].name;
				var temperature = timings.temperature;
				var timeTo = moment(endTime).format("HH:mm");
			   
				var firstCell = getThermostatModeIcon(mode, temperature);
				var secondCell = '  '+'00:00'+ '  -  ' +timeTo;
			   
				for (var j=0; j<2; j++){
					var td = document.createElement('TD');
					if(j==0){
						td.className = "table-tdo";
						td.innerHTML = firstCell;
					}
					else{
						td.className = "table-td";
						td.innerHTML = secondCell;
					}
					tr.appendChild(td);
				}
			}
			
			for (var i=0; i<schedulerEvents[m].time.length; i++){
				var tr = document.createElement('TR');
				tableBody.appendChild(tr);
			   
				var timings = schedulerEvents[m].time[i];
				var startTime = timings.startTime;
				if(schedulerEvents[m].time[i+1] != undefined){
					var endTime = moment(schedulerEvents[m].time[i+1].startTime).subtract(1, 'minutes');  //timings.endTime;		//Assumption - Timings will be sorted. So, just adding end time as start time of next timing
				}else{var endTime = moment(moment("23:59", "HH:mm").format('YYYY-MM-DD HH:mm')); }
				var intmode = parseInt(timings.mode);
				var mode = thermostatMode.properties[intmode].name;
				var temperature = timings.temperature;
			   
				var timeFrom = moment(startTime).format("HH:mm");
				var timeTo = moment(endTime).format("HH:mm");
			   
				var firstCell = getThermostatModeIcon(mode, temperature);
				var secondCell = '  '+timeFrom + '  -  ' +timeTo;
			   
				for (var j=0; j<2; j++){
					var td = document.createElement('TD');
					if(j==0){
						td.className = "table-tdo";
						td.innerHTML = firstCell;
					}
					else{
						td.className = "table-td";
						td.innerHTML = secondCell;
					}
					tr.appendChild(td);
				}
			}	   
			p = $(p).append(controlGroup);
			p = $(p).append(table);
			divInner = $(divInner).append(p);
			div = $(div).append(divInner);
		}
		$(div).appendTo('#allSchedule').collapsibleset().trigger("create");
	}
}*/
/*
function fillEditDetails(title, id, startDate, endDate, timings, index, days){
	refreshScheduleWindow();
	$('#schedule-name').val(title);
	//if(type == "Range"){
		$('#startDate').val(startDate);
		$('#endDate').val(endDate);
	//}
	//if(type == "Repeat"){
		$('#repeat').prop("checked", true);
		$("#repeat").trigger("change");
		repeatTracker = days;
		parseRepeatWeekDays(repeatTracker);
	//}
	timingsArray = timings;
	timings = (_.sortBy(timings, function(o) { return moment(o.startTime); }));
	timingsArray = (_.sortBy(timings, function(o) { return moment(o.startTime); }));
	refreshTimingDiv(timings);
}
*/

function refreshTimingDiv(timings){
	var timingDiv = document.getElementById('time');
	while( timingDiv.hasChildNodes() ){
		timingDiv.removeChild(timingDiv.lastChild);
	}
	if(timings.length != 0){
		var indexZeroTime = (timings[0].startTime).format("HH:mm");
		var endTime;
		if(indexZeroTime != "00:00"){
			var mode = thermostatMode.properties[parseInt(timings[timings.length-1].mode)].name;
			var temperatureToSet = timings[timings.length-1].temperature;
			if(timings[0].startTime != undefined){
				endTime = (moment(timings[0].startTime).subtract(1, 'minutes')).format("HH:mm");
			}
			addTimings("00:00 - "+endTime, mode, temperatureToSet);	//adding extra timing information
		}
		for(m=0; m<timings.length; m++){
			var timeFrom = (timings[m].startTime).format("HH:mm");
			//var timeTo = (timings[m].endTime).format("hh:mm A");
			if(timings[m+1]!= undefined){
				endTime = (moment(timings[m+1].startTime).subtract(1, 'minutes')).format("HH:mm");
			}else{endTime = "23:59";}
			var mode = thermostatMode.properties[parseInt(timings[m].mode)].name;
			var temperatureToSet = timings[m].temperature;
			addTimings(timeFrom+" - "+endTime, /*timeTo,*/ mode, temperatureToSet, m);
		}	
	}
}

function updateCurrentTemperatureUI(data){ //useless
	//var value = data.split('.');
	var phineas = data;//value[0];
	//var ferb = value[1];
	$("#temperatureValue").html(phineas);
	//$("#temperatureDecimalValue").html("."+ferb);
	temperatureSlider.setValue(phineas);
	incrementCounter = temperatureSlider.getValue() - (minTemperature + 1);
	updateGradient(incrementCounter);
}

function updateRunningSchedule(id){
	activeScheduleId = id;
	scheduleRunningState = true;
	//$('#scheduleRunning').html(id);
	//$('#runningSchedule').html(id);
}


function confirmDialog(text, title, callback) {
    var popupDialogId = 'popupDialog';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-position-to="origin" data-transition="pop" data-overlay-theme="b" data-theme="a" data-dismissible="false"> \
                        <div data-role="header" data-theme="a">\
						<h1 style="white-space: normal; margin:0; margin-top:0%; margin-bottom:0%;">' + title + '</h1>\
                        </div>\
                        <div role="main" class="ui-content">\
                            <h3 class="ui-title">' + text + '</h3>\
							<div style="margin-top:15px; text-align:center;">\
								<a href="#" style="margin: 0;margin-right: 15px;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a optionConfirm" data-rel="back">Yes</a>\
								<a href="#" style="margin: 0;margin-left: 5px;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a optionCancel" data-rel="back" data-transition="flow">No</a>\
							</div>\
						</div>\
                    </div>')
        .appendTo($.mobile.pageContainer);
    var popupDialogObj = $('#' + popupDialogId);
    popupDialogObj.trigger('create');
    popupDialogObj.popup({
        afterclose: function (event, ui) {
            popupDialogObj.find(".optionConfirm").first().off('vmouseup');
            var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
            $(event.target).remove();
            if (isConfirmed && callback) {
                callback();
            }
        }
    });
    popupDialogObj.popup('open');
    popupDialogObj.find(".optionConfirm").first().on('vmouseup', function () {
        popupDialogObj.attr('data-confirmed', 'yes');
    });
}

function alertPopup(text) {
    var popupDialogId = 'alertPopupDialog';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-transition="pop" data-overlay-theme="b" data-theme="a" data-dismissible="false"> \
                        <div style="border: none;"data-role="header" data-theme="a" id="dialogTitle">\
                        </div>\
						<div role="main" class="ui-content">\
                            <h3 class="ui-title">' + text + '</h3>\
                            <a href="#" style="margin:0 auto; display:table;" class="ui-btn ui-corner-all ui-shadow ui-btn-a optionCancel" data-rel="back" data-transition="flow">OK</a>\
                        </div>\
                    </div>')
        .appendTo($.mobile.pageContainer);
    var popupDialogObj = $('#' + popupDialogId);
    popupDialogObj.trigger('create');
	popupDialogObj.popup({
		afterclose: function (event, ui) {
            $(event.target).remove();
        },
		popupafteropen: function () {
			var center = ($(document).width() - $(popupDialogObj).width())/2;
			$(popupDialogObj).css({
					bottom: 50,
					left: center
			});  
		}
    });
    popupDialogObj.popup('open');
}

function verificationDialog(occurence, callFrom, callback) {
    var popupDialogId = 'verificationPopupDialog';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-history="false" data-position-to="origin" data-transition="pop" data-overlay-theme="b" data-theme="a" data-dismissible="false"> \
					<div style="padding:10px 20px;">\
						<h4 style="margin:0; margin-top: 10px;"">Enter password</h4>\
						<label for="un" class="ui-hidden-accessible">password:</label>\
						<input type="number" name="password" id="un" value="" placeholder="password" pattern="[0-9]*" maxlength="4" data-theme="a">\
						<label id="loader" style="font-size:3vw; color: red; display:none; text-align:center; margin-top:15px;"><i class="fa fa-spinner fa-2x spin"></i> Please wait</label>\
						<label id="message" style="font-size:3vw; color: red; text-align:right; margin-top:15px;"></label>\
						<div style="margin-top:20px; text-align:center;">\
							<a href="#" style="margin: 0;margin-right: 15px; font-size:12px; " class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionConfirm">Confirm</a>\
							<a href="#" style="margin: 0;margin-left: 5px; font-size:12px;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionCancel" data-transition="flow">Cancel</a>\
						</div>\
					</div>\
            </div>')
        .appendTo($.mobile.pageContainer);
    var popupDialogObj = $('#' + popupDialogId);
    popupDialogObj.trigger('create');
    popupDialogObj.popup({
        afterclose: function (event, ui) {
            popupDialogObj.find(".optionConfirm").first().off('click');
            var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
            $(event.target).remove();
            if (isConfirmed && callback) {
                callback();
            }
        }
    });
    popupDialogObj.popup('open');
	
	popupDialogObj.find("#un").first().bind('keypress', function (event) {
		if($(this).val().length >= 4) {
			$(this).val($(this).val().slice(0, 4));
			return false;
		}
	});
	popupDialogObj.find("#un").on('input', function (event) { 
		this.value = this.value.replace(/[^0-9]/g, '');
	});
	
    popupDialogObj.find(".optionConfirm").first().on('click', function () {
		var enteredpassword = popupDialogObj.find("#un").val();
                                                     
        if(enteredpassword != ""){
		popupDialogObj.find("#loader").show();
		if(callFrom == "factory"){
			doFactoryReset(enteredpassword, popupDialogObj)
		}else{
			//call ajax password verification here. get return data
			doPasswordVerification(enteredpassword, popupDialogObj);
		}
                                                     }else{
                                                     popupDialogObj.find("#message").html("Password cannot be blank.");
                                                     }
		
		/*if(enteredpassword == currentPassword && enteredpassword != ""){
			popupDialogObj.attr('data-confirmed', 'yes');
			popupDialogObj.popup('close');
			
		}else{
			popupDialogObj.find("#message").html("Wrong Password !");
		}*/
    });

	popupDialogObj.find(".optionCancel").first().on('click', function () {
		if(occurence == "before"){
			history.back();
		}else if(occurence == "after"){
			popupDialogObj.popup('close');
		}
		//popupDialogObj.popup('close');
    });
}

function passwordResetDialog(callback) {
    var popupDialogId = 'passwordResetDialog';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-history="false" data-position-to="origin" data-transition="pop" data-overlay-theme="b" data-theme="a" data-dismissible="false"> \
					<div style="padding:10px 20px;">\
						<h4 style="margin:0; margin-top: 10px;"">New password</h4>\
						<!--label for="newPassword" class="ui-hidden-accessible">Enter current password:</label>\
						<input type="text" name="newPassword" id="newPassword" value="" placeholder="Enter current password" data-theme="a"-->\
						<label for="confirmPassword" class="ui-hidden-accessible">Enter new password:</label>\
						<input type="number" name="confirmPassword" id="confirmPassword" value="" placeholder="Enter new password" pattern="[0-9]*" maxlength="4" data-theme="a">\
						<label id="notMatchMessage" style="font-size:1.5vw; color: red; text-align:right; margin-top:10px;"></label>\
						<div style="margin-top:15px; text-align:center;">\
							<a href="#" style="margin: 0;margin-right: 15px; font-size:12px; " class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionConfirm">Confirm</a>\
							<a href="#" style="margin: 0;margin-left: 5px; font-size:12px;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionCancel" data-rel="back" data-transition="flow">Cancel</a>\
						</div>\
					</div>\
            </div>')
        .appendTo($.mobile.pageContainer);
    var popupDialogObj = $('#' + popupDialogId);
    popupDialogObj.trigger('create');
    popupDialogObj.popup({
        afterclose: function (event, ui) {
            popupDialogObj.find(".optionConfirm").first().off('click');
			//var newpassword = popupDialogObj.find("#newPassword").val();
            var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
            $(event.target).remove();
            if (callback) {
                callback();
            }
        }
    });
    popupDialogObj.popup('open');
	
	popupDialogObj.find("#confirmPassword").first().bind('keypress', function (event) {
		if($(this).val().length >= 4) {
			$(this).val($(this).val().slice(0, 4));
			return false;
		}
	});
	popupDialogObj.find("#confirmPassword").on('input', function (event) { 
		this.value = this.value.replace(/[^0-9]/g, '');
	});
	
    popupDialogObj.find(".optionConfirm").first().on('click', function () {
		var confirmpassword = popupDialogObj.find("#confirmPassword").val();
		//var newpassword = popupDialogObj.find("#newPassword").val();
		if(confirmpassword != ""){
                 popupDialogObj.find("#notMatchMessage").html("Please wait ...");
                 doPinReset(confirmpassword, currentPassword, popupDialogObj);
		}
    });
}

function parseRepeatWeekDays(val){
	//Code for parsing schedule repeat data
	$('.week').prop("checked", false);
	var duration = "";
	if(val & 0x01){
		$('.week[data-day="SUN"]').prop("checked", true);
		duration += "Su";
	}
	if(val & 0x02){
		$('.week[data-day="MON"]').prop("checked", true);
		duration += " Mo";
	}
	if(val & 0x04){
		$('.week[data-day="TUE"]').prop("checked", true);
		duration += " Tu";
	}
	if(val & 0x08){
		$('.week[data-day="WED"]').prop("checked", true);
		duration += " We";
	}
	if(val & 0x10){
		$('.week[data-day="THU"]').prop("checked", true);
		duration += " Th";
	}
	if(val & 0x20){
		$('.week[data-day="FRI"]').prop("checked", true);
		duration += " Fr";
	}
	if(val & 0x40){
		$('.week[data-day="SAT"]').prop("checked", true);
		duration += " Sa";
	}	
	return duration;
}
/*
function saveSchedule(scheduleToBeSaved, id, startDate, endDate, timingsArray, getSelectedWeekdays){
	//Format Post Data
	//header: Schedule Name, scheduleId, Start Date,End Date, Days Range, Length of Timing Array
	//specification: Schedule Name,Length of Timing Array
	//timings: Array of Times [To be repeated until exhausted in chunks of 4]
	
	//Scheduler Name can't have length more than 20 letters
	
	//formatting data into hex
	var startYear = (parseInt(startDate.substring(0, 4))).toString(16);
	var startMonth = (parseInt(startDate.substring(4, 6))).toString(16);
	var startDay = (parseInt(startDate.substring(6))).toString(16);
	if(startDay.length == 1){startDay = "0"+startDay;}
	
	var startDate = startYear+""+startMonth+""+startDay;
	
	var endYear = (parseInt(endDate.substring(0, 4))).toString(16);
	var endMonth = (parseInt(endDate.substring(4, 6))).toString(16);
	var endDay = (parseInt(endDate.substring(6))).toString(16);
	if(endDay.length == 1){endDay = "0"+endDay;}
	
	var endDate = endYear+""+endMonth+""+endDay;
	
	var selectedWeekDays = (parseInt(getSelectedWeekdays)).toString(16);

	var header="";
	var dataToBeSent="";
	var count = 0;
	
	var postText = "";
	
	//if(type==scheduleType.properties[0].name){
		header = scheduleToBeSaved+","+id+","+startDate+","+endDate+","+selectedWeekDays+","+timingsArray.length; //Type 1 Range	//not anymore*/
	/*}else{
		header = scheduleToBeSaved+","+2+","+getSelectedWeekdays+","+timingsArray.length; //Type 2 Range
	}*/
/*
	postText = postText + '__SL_P_USS' + '=' + header;
	
	for(var i=timingsArray.length;i>0;i=(i-3))
	{
		if(timingsArray[count]!=undefined){
			var time = moment(timingsArray[count].startTime).format("HHmm");
			var hour = (parseInt(time.substring(0, 2))).toString(16);
			if(hour.length == 1){hour = "0"+hour;}
			var minute = (parseInt(time.substring(2))).toString(16);
			if(minute.length == 1){minute = "0"+minute;}
			
			if(timingsArray[count].mode == 0 || timingsArray[count].mode == 4){
				dataToBeSent = hour+""+minute+ "," + timingsArray[count].mode;
			}else{
				var temperature = timingsArray[count].temperature;
				temperature = (parseInt(temperature)).toString(16);
				dataToBeSent = hour+""+minute+ "," + timingsArray[count].mode + "," + temperature + "," + timingsArray[count].fan;
			}
		}
		else{
			break;
		}
		if(timingsArray[count+1]!=undefined){
			var time = moment(timingsArray[count+1].startTime).format("HHmm");
			var hour = (parseInt(time.substring(0, 2))).toString(16);
			if(hour.length == 1){hour = "0"+hour;}
			var minute = (parseInt(time.substring(2))).toString(16);
			if(minute.length == 1){minute = "0"+minute;}
			
			if(timingsArray[count+1].mode === 0 || timingsArray[count+1].mode === 4){
				dataToBeSent = dataToBeSent + "," +hour+""+minute+ "," + timingsArray[count+1].mode;
			}else{
				var temperature = timingsArray[count+1].temperature;
				temperature = (parseInt(temperature)).toString(16);
				dataToBeSent = dataToBeSent + "," + hour+""+minute+ "," + timingsArray[count+1].mode + "," + temperature + "," + timingsArray[count+1].fan;
			}
		}
		if(timingsArray[count+2]!=undefined){
			var time = moment(timingsArray[count+2].startTime).format("HHmm");
			var hour = (parseInt(time.substring(0, 2))).toString(16);
			if(hour.length == 1){hour = "0"+hour;}
			var minute = (parseInt(time.substring(2))).toString(16);
			if(minute.length == 1){minute = "0"+minute;}
			
			if(timingsArray[count+2].mode === 0 || timingsArray[count+2].mode === 4){
				dataToBeSent = dataToBeSent + "," + hour+""+minute+ "," + timingsArray[count+2].mode;
			}else{
				var temperature = timingsArray[count+2].temperature;
				temperature = (parseInt(temperature)).toString(16);
				dataToBeSent = dataToBeSent + "," + hour+""+minute+ "," + timingsArray[count+2].mode + "," + temperature + "," + timingsArray[count+2].fan;
			}
		}*/
		/*if(timingsArray[count+3]!=undefined){
			var time = moment(timingsArray[count+3].startTime).format("HHmm");
			var hour = (parseInt(time.substring(0, 2))).toString(16);
			if(hour.length == 1){hour = "0"+hour;}
			var minute = (parseInt(time.substring(2))).toString(16);
			if(minute.length == 1){minute = "0"+minute;}
			if(timingsArray[count+3].mode === 0 || timingsArray[count+3].mode === 4){
				dataToBeSent = dataToBeSent + "," + hour+""+minute+ "," + timingsArray[count+3].mode;
			}else{
				var temperature = timingsArray[count+3].temperature;
				temperature = (parseInt(temperature)).toString(16);
				dataToBeSent = dataToBeSent + "," + hour+""+minute+ "," + timingsArray[count+3].mode + "," + temperature + "," + timingsArray[count+3].fan;
			}
		}*/
	/*	count = count+3;
		postText = postText + '&' + '__SL_P_UTA' + '=' + dataToBeSent;
	}
			//alert(postText);
	$.ajax({
		url: 'http://'+ipAddress+'/Add_Schedule', //localhost/jcitestserver/test.php',',
		//dataType: 'application/text',
		method : 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: postText,
		success: function( data, textStatus, jQxhr ){
			//alert("Success: "+data + "Status: "+textStatus);
			repeatTracker = 127; //Resetting the global variable for repeat Tracking
			getAllSchedules();
			alertPopup("Schedule saved");
			//$.mobile.changePage( "#scheduler", {changeHash: false });
		},
		error: function( jqXhr, textStatus, errorThrown ){
			//alert("Error: "+errorThrown);
			alertPopup("Request Failed !");
			repeatTracker = 127; //Resetting the global variable for repeat Tracking
		}
	});
}*/


function doFactoryReset(Pin, popupDialogObj){
	var postText="__SL_P_UFR=";
	pin = window.btoa(Pin);
	pin = pin+","+pin;
	postText += pin;
	$.ajax({
		url: 'http://'+ipAddress+'/',
		dataType: 'application/text',
		method : 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: postText, 
		success: function( data, textStatus, jQxhr ){
			//alert("Success: "+data + "Status: "+textStatus);
			getPasswordMatchSuccess(popupDialogObj, Pin, "factory");
			
			//set back to AP mode.
			/*ipAddress = '192.168.1.1';
			$.jStorage.set(defaultIpKey, ipAddress);
			$.jStorage.set("Last Configured",defaultIpKey);
			lastUsedIpKey = $.jStorage.get("Last Configured");
			ipAddress = $.jStorage.get(lastUsedIpKey);*/
			
		},
		error: function( jqXhr, textStatus, errorThrown ){
			//alert("Error: "+errorThrown);
			popupDialogObj.find("#loader").hide();
			popupDialogObj.find("#message").html("Request failed.");
		}
	});
}

function doPasswordVerification(Pin, popupDialogObj){
	var pin = window.btoa(Pin);
	pin = pin+","+pin;
	$.ajax({
		url: 'http://'+ipAddress+'/',
		dataType: 'application/text',
		method : 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: {"__SL_P_USE":pin},
		success: function( data, textStatus, jQxhr ){			
			//on success get password match or mismatch
			getPasswordMatchSuccess(popupDialogObj, Pin, "verification");

		},
		error: function( jqXhr, textStatus, errorThrown ){
			//alert("Error: "+errorThrown);
			popupDialogObj.find("#loader").hide();
			popupDialogObj.find("#message").html("Request failed.");
		}
	});
}

function getPasswordMatchSuccess(popupDialogObj, Pin, type){
	$.ajax({
		url: 'http://'+ipAddress+'/Get_Pin_Status',
		method : 'GET',
		success: function( data, textStatus, jQxhr ){
			if(data == "Unknown Token"){
				//alert(data);
				popupDialogObj.find("#loader").hide();
				popupDialogObj.find("#message").html("Unknown Token. Try again.");
			}else{
				//alert(data);
				if(data == "0"){
					popupDialogObj.find("#loader").hide();
					popupDialogObj.attr('data-confirmed', 'yes');
					popupDialogObj.popup('close');
					currentPassword = Pin;
					if(type == "factory"){
						alert("Factory reset in progress. Going back to Ap mode. Connect to Thermostat's SSID.");
						ipAddress = '192.168.1.1';
						$.jStorage.set(defaultIpKey, ipAddress);
						$.jStorage.set("Last Configured",defaultIpKey);
						lastUsedIpKey = $.jStorage.get("Last Configured");
						ipAddress = $.jStorage.get(lastUsedIpKey);
					}
				}else {
					popupDialogObj.find("#loader").hide();
					popupDialogObj.find("#message").html("Wrong password");
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			//alert("Error: "+errorThrown);
			popupDialogObj.find("#loader").hide();
			popupDialogObj.find("#message").html("Can't verify the password.");
		},
		timeout: 3000
	});
}

function doPinReset(newPin, oldPin, popupDialogObj){
	var postText="";//__SL_P_UPI=";
	oldpin = window.btoa(oldPin);
	postText += oldpin;
	postText = postText+",";
	newpin = window.btoa(newPin);
	postText += newpin;
	$.ajax({
		url: 'http://'+ipAddress+'/',
		dataType: 'application/text',
		method : 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: {"__SL_P_UPI":postText},
		success: function( data, textStatus, jQxhr ){
			//alert("Success: "+data + "Status: "+textStatus);
			popupDialogObj.attr('data-confirmed', 'yes');
			popupDialogObj.popup('close');
			alert("Password changed successfully!");
		},
		error: function( jqXhr, textStatus, errorThrown ){
			//alert("Error: "+errorThrown);
			popupDialogObj.find("#notMatchMessage").html("Wrong Password");
			//alertPopup("Password is incorrect!");
		}
	});
}
/*
function deleteSchedule(scheduleToBeDeleted){
	$.ajax({
		url: 'http://'+ipAddress+'/Delete_Schedule',
		dataType: 'application/text',
		method : 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: {"__SL_P_UDS":scheduleToBeDeleted}, 
		success: function( data, textStatus, jQxhr ){
			//alert("Success: "+data + "Status: "+textStatus);
			refreshScheduleWindow();
			alertPopup("Schedule Deleted");
			$.mobile.changePage( "#scheduler", {changeHash: false });
			$('#allSchedule').empty();
			$('#activeScheduleTable').empty();
			getAllSchedules();
		},
		error: function( jqXhr, textStatus, errorThrown ){
			//alert("Error: "+errorThrown);
			alertPopup("Request failed !");
		}
	});
}*/

function setMode(modeValue){
	var modePassed;
	var valuePassed;
	var hexValuePassed;
	var hexModeValue = modeValue;
	if(modeValue == "0" || modeValue =="4"){
		modePassed = modeValue;
		valuePassed = "0";
	}else{
		var splitModeValue = modeValue.split(",");
		modePassed = splitModeValue[0];
		valuePassed = splitModeValue[1];
		hexValuePassed = parseInt(valuePassed).toString(16);
		hexModeValue = modePassed + ',' + hexValuePassed;
	}
	var request, timeout;
	var processing=false;
	timeout = setTimeout(function(){
	if (!processing){
		processing=true;
		
		request = $.ajax({
		url: 'http://'+ipAddress+'/Set_Mode',
		dataType: 'application/text',
		method : 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: {"__SL_P_USM":hexModeValue},
		success: function( data, textStatus, jQxhr ){
			//alert("Success: "+data + "Status: "+textStatus);
			if(modePassed == "5"){
				if(valuePassed == 1){
					//fanRunningStatus = "1";
					currentFanState = thermostatFanState.AUTO;
					$("#fanSpin").html("O");
					//$("#fanSpin").removeClass("autoFanMode");
					//$("#fanSpin").addClass("runningFanMode");
				}
				if(valuePassed == 0){
					//fanRunningStatus = "0";
					currentFanState = thermostatFanState.ON;
					$("#fanSpin").html("N");
					//$("#fanSpin").removeClass("autoFanMode");
					//$("#fanSpin").removeClass("runningFanMode");
				}
			}else{
				updateUI(modePassed, valuePassed);
			}
		},
		error: function( jqXhr, textStatus, errorThrown ){
			//alert("Error: "+errorThrown);
			userModeChanging = false;
		}
	});
	}
    },100);
}

function syncTime(){
	var now = moment().format("YYYY,MM,DD,HH,mm,ss,e");	//make appropriate format and pass it to the data.
	var hexLen = now.split(',');
	for(var i=0;i<hexLen.length;i++){
		hexLen[i] = parseInt(hexLen[i]).toString(16);
	}
	now = hexLen.join(',');
	$.ajax({
		url: 'http://'+ipAddress+'/Set_Time',
		dataType: 'application/text',
		method : 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: {"__SL_P_UTM":now},
		success: function( data, textStatus, jQxhr ){
			//alert("Success: "+data + "Status: "+textStatus);
			alertPopup("Time synced");
		},
		error: function( jqXhr, textStatus, errorThrown ){
			//alert("Error: "+errorThrown);
			alertPopup("Request failed!");
		}
	});
}

function setThermostatWifi(ssid, password){
	var wifidata = ssid + "," + password;
	$.ajax({
		url: 'http://'+ipAddress+'/Set_Time',
		dataType: 'application/text',
		method : 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: {"__SL_P_USW":wifidata},
		success: function( data, textStatus, jQxhr ){
			//alert("Success: "+data + "Status: "+textStatus);
			$.mobile.loading( "hide" );
			alertPopup("Router configuration saved");
		},
		error: function( jqXhr, textStatus, errorThrown ){
			//alert("Error: "+errorThrown);
			$.mobile.loading( "hide" );
			alertPopup("Request failed !");
		}
	});
}

function setTimezone(){
	var timezoneData = $('#timezone select option:selected').text();
	$.ajax({
		url: 'http://'+ipAddress+'/Set_TimeZone',
		dataType: 'application/text',
		method : 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: {"__SL_P_UTZ":timezoneData},
		success: function( data, textStatus, jQxhr ){
			//alert("Success: "+data + "Status: "+textStatus);
		},
		error: function( jqXhr, textStatus, errorThrown ){
			//alert("Error: "+errorThrown);
		}
	});
}

function setParameters(params){
	//alert("Sending Params: "+params);
	var parameters = params.split(',');
	var degreeChangeValue = parseInt(parameters[6]);
	$.ajax({
		url: 'http://'+ipAddress+'/Set_Parameters',
		dataType: 'application/text',
		method : 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: {"__SL_P_USP":params},
		success: function( data, textStatus, jQxhr ){
			//alert("Success: "+data + "Status: "+textStatus);
			alertPopup("Configuration saved");
			if(degreeChangeValue != temperatureUnit){
				//ToDo:- convert everything accordingly after 2 sec delay
				changeTemperatureUnit(parseInt(degreeChangeValue));
			}
		},
		error: function( jqXhr, textStatus, errorThrown ){
			//alert("Error: "+errorThrown);
			alertPopup("Request failed !");
		},
		timeout: 5000
	});
}

function setActiveSchedule(scheduleId){
	$.ajax({
		url: 'http://'+ipAddress+'/Active_Schedule',
		dataType: 'application/text',
		method : 'POST',
		contentType: 'application/x-www-form-urlencoded',
		data: {"__SL_P_USA":scheduleId},
		success: function( data, textStatus, jQxhr ){
			if(scheduleId == "0f"){
				scheduleRunningState = false;
				activeScheduleId = "f";
			}else{
				scheduleRunningState = true;
				activeScheduleId = scheduleId;
			}
			showActiveSchedule();
			showAllSchedules();
			showSchedules();
			scheduleListInit();
		},
		error: function( jqXhr, textStatus, errorThrown ){
			alertPopup("Request failed !");
			showActiveSchedule();
			showAllSchedules();
			showSchedules();
			scheduleListInit();
		}
	});
}
/*
function getAllSchedules(){
	$.ajax({
		url: 'http://'+ipAddress+'/Get_Schedules',
		method : 'GET',
		success: function( data, textStatus, jQxhr ){
			//alert(data);
			$("#refreshLoader").hide();
			if(data == "Unknown Token"){
				//alert(data);
			}else{
				var datum = data.trim();
				if(datum.length == 14){
					schedulerEvents.length = 0;
				}
				if(datum.length > 14){
					//parseAllSchedules(datum);
					nextEmptyId();
				}
				showSchedules();
				showAllSchedules();
				showActiveSchedule();
				scheduleListInit();
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			$("#refreshLoader").hide();
				showSchedules();
				showAllSchedules();
				showActiveSchedule();
				scheduleListInit();
			//alertPopup("Refresh failed !");
		},
		timeout: 8000
	});
}*/
/*
function parseAllSchedules(data){   //To parse in our object format
	//format
	//Note - schedules are separated by ':' (colon).
	//Schedule Name, Id, Start Date, End date, Week Days, Timings Length Count,
	//Timings - time, mode, setpointTemperature (if mode != 0 or 4), fanControl (if mode != 0 or 4)
	
	schedulerEvents.length = 0;
	arrayId = [];
	
	var schedules = data.split(":");
	totalScheduleCount = schedules.length;
	for(var i=0; i<schedules.length; i++){
		console.log(schedules[i]);
		var details = schedules[i].split(",");
		
		var title = details[0];
		var id = parseInt(details[1]);
		
		var startDate = details[2];
		var start_year = (parseInt((startDate.substring(0,3)), 16)).toString();
		var start_month = (parseInt((startDate.substring(3,4)), 16)).toString();
			if(start_month.length == 1){start_month = "0"+start_month;}
		var start_day = (parseInt((startDate.substring(4)), 16)).toString();
		startDate = start_year+""+start_month+""+start_day;
		console.log("Start Date  -- > "+startDate);
		
		var endDate = details[3];
		var end_year = (parseInt((endDate.substring(0,3)), 16)).toString();
		var end_month = (parseInt((endDate.substring(3,4)), 16)).toString();
			if(end_month.length == 1){end_month = "0"+end_month;}
		var end_day = (parseInt((endDate.substring(4)), 16)).toString();
		endDate = end_year+""+end_month+""+end_day;
		console.log("End Date  -- > "+endDate);
		
		
		var weekdays = details[4];
			weekdays = parseInt(weekdays, 16);
		console.log("Week Days  -- > "+weekdays);
		
		var timingsCount = details[5]; 
		
		var startIndex = title.length + 22;
		var timingsChar = schedules[i].substring(startIndex);
		console.log(timingsChar);
	
		//var Datum = "Winter,1,7df912,7df91e,7f,4,  0119,2,59,0,071e,4,0b1e,0,1438,2,4f,1  ";
	
		var arrayOfTimes = [];
		var indexCount = 0;
		for(var m=0; m<parseInt(timingsCount); m++){
			var time = timingsChar.substring(indexCount);
			var timeParts = time.split(",");
			var startTime = timeParts[0];
			console.log("start time before "+startTime);
				var hour = (parseInt((startTime.substring(0, 2)), 16)).toString();
					if(hour.length == 1){hour = "0"+hour;}
				var minute = (parseInt((startTime.substring(2)), 16)).toString();
					if(minute.length == 1){minute = "0"+minute;}
			startTime = hour+""+minute;
			//var endTime = timeParts[1];
			var mode = timeParts[1];
			var intMode = parseInt(timeParts[1]);*/
			//indexCount = indexCount + startTime.length + /*endTime.length +*/ mode.length + 2;
			//if(intMode == 0 || intMode == 4){
				//arrayOfTimes.push({startTime: moment(moment(startTime, "HH:mm").format('YYYY-MM-DD HH:mm')), /*endTime: moment(endTime, "hh:mm"),*/ mode: intMode});	//pushing to timing array to pass in scheduler events
			/*}else{
				var temperature = timeParts[2];
					temperature =(parseInt(temperature, 16)).toString();
				var fanControlValue = parseInt(timeParts[3]);
				indexCount = indexCount + temperature.length + 3;
				arrayOfTimes.push({startTime: moment(moment(startTime, "HH:mm").format('YYYY-MM-DD HH:mm')), mode: intMode, temperature: temperature, fan: fanControlValue});	//pushing to timing array to pass in scheduler events
			}
		}
		console.log(arrayOfTimes);*/
		//if(type === "1"){
		/*schedulerEvents.push({  startDate: moment(startDate, "YYYYMDD").format("YYYY-MM-DD"),
								endDate: moment(endDate, "YYYYMDD").format("YYYY-MM-DD"),
								id: id,
								days: weekdays,
								title: title,
								time: arrayOfTimes
							});			
		arrayId[id] = id;		
	}//End of for loop	
}//end of function*/

function nextEmptyId(){
	for(i=0; i<10; i++){
		if(arrayId[0] == undefined){
			nextScheduleId = 0;
			return;
		}else{
			if((arrayId[i+1]) == undefined && (i != 9)){
				nextScheduleId = i+1;
				return;
			}
		}
	}
	
}

function updateAllAtStart(values){
	/*Current Temp, Current Mode, Heat Set Point, Cool Set Point, Auto Set point, CurrentFanState
	Active Schedule, Cycle rate, min off time, min on time, cool dead band, heat dead band, 
	enable/disable 2 stage threshold, threshold temperature(if 2 stage is disabled, this field will not be there), temperatureUnit, (YYYY:MM:DD:HH:mm)*/
	var allValues = values.split(',');
	var setpointActive = false;
	var scheduleToSet;
	var count=0;
	var marginValue;
	var mode;
	
	if((allValues != null) || (allValues != undefined)){
		if(allValues[count] != undefined){ //Current Temperature
			var phineas = allValues[count];
			var negVal = null;
			if(parseInt(phineas) > 128){ //Negative Case
				negVal = parseInt(phineas)-256;
			}
			
			if(negVal != null){
				currentTemperature = negVal.toString();
			}else{
				currentTemperature = phineas;
			}
			
			$("#temperatureValue").html(currentTemperature);
			/*if(isUserInteracting == false){
				incrementCounter = currentTemperature - (minTemperature + 1);
				updateGradient(incrementCounter);
			}*/
			//$("#degreeO").html("O");
			$("#temperatureUnit").html(temperatureUnitSymbol);
		}
		count++;
		if(allValues[count] != undefined)
		{ //Current Mode
			mode = allValues[count];
			makeAllOff();
			if(userModeChanging == false){
			if(mode == "0"){
				currentThermostatMode = thermostatMode.OFF;
				marginValue = "90.53%";
				currentMode = "0";
				$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
				$("#iconPower").addClass("activeMode");
				$("nav ul li").not("#iconPower").removeClass("activeMode");
				$("#iconPower").find(".modeDesc").css("visibility","visible");
				$("nav ul li").not("#iconPower").find(".modeDesc").css("visibility","hidden");
				$("#fanSpin").css("visibility","hidden");
				offGradient();
			}
			if(mode == "1"){
				currentThermostatMode = thermostatMode.HEAT;
				currentHeatState = thermostatModeState.ON;
				//currentFanState = thermostatModeState.ON;
				marginValue = "24.99%";
				currentMode = "1";
				$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
				$("#iconSunny").addClass("activeMode");
				$("nav ul li").not("#iconSunny").removeClass("activeMode");
				$("#iconSunny").find(".modeDesc").css("visibility","visible");
				$("nav ul li").not("#iconSunny").find(".modeDesc").css("visibility","hidden");
				$("#fanSpin").css("visibility","visible");
				heatGradient();
			}
			if(mode == "2"){
				currentThermostatMode = thermostatMode.COOL;
				currentCoolState = thermostatModeState.ON;
				//currentFanState = thermostatModeState.ON;
				marginValue = "41.65%";
				currentMode = "2";
				$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
				$("#iconSnow").addClass("activeMode");
				$("nav ul li").not("#iconSnow").removeClass("activeMode");
				$("#iconSnow").find(".modeDesc").css("visibility","visible");
				$("nav ul li").not("#iconSnow").find(".modeDesc").css("visibility","hidden");
				$("#fanSpin").css("visibility","visible");
				coolGradient();
			}
			if(mode == "3"){
				currentThermostatMode = thermostatMode.AUTO;
				currentAutoState = thermostatModeState.ON;
				//currentFanState = thermostatModeState.ON;
				marginValue = "58.31%";
				currentMode = "3";
				$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
				$("#iconAuto").addClass("activeMode");
				$("nav ul li").not("#iconAuto").removeClass("activeMode");
				$("#iconAuto").find(".modeDesc").css("visibility","visible");
				$("nav ul li").not("#iconAuto").find(".modeDesc").css("visibility","hidden");
				$("#fanSpin").css("visibility","visible");
				//autoGradient();
				
				count++; //Incrementing for checking next value
				if(allValues[count] != undefined){
					var gradientVal = parseInt(allValues[count]);
					if(isUserInteracting == false){
						switch(gradientVal){
							case 0: //Auto
								autoGradient();
								break;
							case 1:
								heatGradient();
								break;
							case 2:
								coolGradient();
								break;
							default:
								autoGradient();
								break;
						}
					}
				}
			}
			if(mode == "4"){
				currentThermostatMode = thermostatMode.FAN;
				marginValue = "74.97%";
				currentMode = "4";
				$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
				$("#iconFan").addClass("activeMode");
				$("nav ul li").not("#iconFan").removeClass("activeMode");
				$("#iconFan").find(".modeDesc").css("visibility","visible");
				$("nav ul li").not("#iconFan").find(".modeDesc").css("visibility","hidden");
				$("#fanSpin").css("visibility","hidden");
				fanGradient();
			}
			//$(this).addClass("activeMode");
			//$(this).find(".modeDesc").css("visibility","visible");
			
			$('#currentModeIcon').html(thermostatMode.properties[currentThermostatMode].icon);
			$('#currentMode').html(thermostatMode.properties[currentThermostatMode].name);
			}
			count++;
		}
		
		if(allValues[count] != undefined){ //Heat Set Point
			initialHeatSetPoint = allValues[count];
			count++;
		}
		
		if(allValues[count] != undefined){ //Cool Set Point
			initialCoolSetPoint = allValues[count];
			count++;
		}
		
		if(allValues[count] != undefined){ //Auto Set Point
			initialAutoSetPoint = allValues[count];
			count++;
		}
		
		//Setting Values
		//fanOffStateReady = false;
		switch(mode){
			case "0":
				$("#upperTemperatureValue").hide(); //html('0'+'<sup style="font-size:15pt; letter-spacing: 3px;">o</sup>F');
				break;
			case "1":
				$("#upperTemperatureValue").show();
				if(isUserInteracting == false){
					$("#upperTemperatureValue").html(initialHeatSetPoint+''+temperatureUnitSymbol);
				}
				// if(currentTemperature >= initialHeatSetPoint){
					// fanOffStateReady = true;
					// $('#fanSpin').addClass("runningFanMode");
				// }else{$('#fanSpin').removeClass("runningFanMode");}
				if(isUserInteracting == false){
					temperatureSlider.setValue(initialHeatSetPoint*10);
				}
				break;
			case "2":
				$("#upperTemperatureValue").show();
				if(isUserInteracting == false){
					$("#upperTemperatureValue").html(initialCoolSetPoint+''+temperatureUnitSymbol);				
				}
				// if(currentTemperature <= initialCoolSetPoint){
					// fanOffStateReady = true;
					// $('#fanSpin').addClass("runningFanMode");
				// }else{$('#fanSpin').removeClass("runningFanMode");}
				if(isUserInteracting == false){
					temperatureSlider.setValue(initialCoolSetPoint*10);
				}
				break;
			case "3":
				$("#upperTemperatureValue").show();
				if(isUserInteracting == false){
					$("#upperTemperatureValue").html(initialAutoSetPoint+''+temperatureUnitSymbol);
				}
				// if(currentTemperature == initialAutoSetPoint){
					// fanOffStateReady = true;
					// $('#fanSpin').addClass("runningFanMode");
				// }else{$('#fanSpin').removeClass("runningFanMode");}
				if(isUserInteracting == false){
					temperatureSlider.setValue(initialAutoSetPoint*10);
				}
				break;
			case "4":
				$("#upperTemperatureValue").hide();
				//$("#upperTemperatureValue").html('0'+'<sup style="font-size:15pt; letter-spacing: 3px;">o</sup>F');
				break;
			default:
				break;
		}
		
		if(allValues[count] != undefined){		//Running status of fan
			fanRunningStatus = allValues[count];  //defined globally, values - 0 or 1
			if(fanRunningStatus == "0"){		//Handle fan status here, Update UI accordingly.
				//ToDo - update here
				currentFanState = thermostatFanState.ON;
				$("#fanSpin").html("N");	//change to off icon here
				//$("#fanSpin").removeClass("runningFanMode");
				//$("#fanSpin").removeClass("autoFanMode");
			}else if(fanRunningStatus == "1"){
				if(currentThermostatMode !== thermostatMode.FAN){ }
				currentFanState = thermostatFanState.AUTO;
				$("#fanSpin").html("O");
				//$("#fanSpin").removeClass("autoFanMode");
				//$("#fanSpin").addClass("runningFanMode");
			}
			count++;
		}

		if(allValues[count] != undefined){
			scheduleToSet = (allValues[count]).toString();
			if(scheduleToSet !== "F" || scheduleToSet !== "f") //Active Schedule is set
			{
				//Set Schedule
				scheduleRunningState = true;
				activeScheduleId = scheduleToSet;
				//updateRunningSchedule(scheduleToSet);
			}
			if(scheduleToSet == "f" || parseInt(scheduleToSet) == 15){
				scheduleToSet = "f";
				scheduleRunningState = false;
				activeScheduleId = "f";
				$('#scheduleRunning').html("");
				$('#runningSchedule').html("None");
			}
			count++;
		}
		
		var cyclerate = allValues[count];
		if(cyclerate != undefined){
			//Set Cyclerate
			initialCycleRate = cyclerate;
			count++;
		}
		
		var minimumOffTime = allValues[count] + " Seconds";
		if(minimumOffTime != undefined){
			//Set Min Off Time
			initialMinOffTime = minimumOffTime;
			count++;
		}
		
		var minimumOnTime = allValues[count] + " Seconds";
		if(minimumOnTime != undefined){
			//Set Min On Time
			initialMinOnTime = minimumOnTime;
			count++;
		}
		
		var coolDeadBand = allValues[count];
		if(coolDeadBand != undefined){
			//Set Cool Dead Band
			initialCoolDeadBand = coolDeadBand;
			count++;
		}
		
		var heatDeadBand = allValues[count];
		if(heatDeadBand != undefined){
			//Set Heat Dead Band
			initialHeatDeadBand = heatDeadBand;
			count++;
		}
		
		var overrideDuration = allValues[count];
		if(overrideDuration != undefined){
			//Set Heat Dead Band
			initialManualOverride = overrideDuration;
			count++;
		}
		
		var enableDisable2Stage = allValues[count];
		if(enableDisable2Stage != undefined){
			//Set Enable/Disable 2 stage
			if(enableDisable2Stage == '0'){
				//update 1st Dec.
				isSecondStageHeaterEnabled = 0;
				//$("#enableDisableSecondStage").removeAttr("checked");
				//$("#enableDisableSecondStage").checkboxradio("refresh");
				//$('#secondStageHeaterDiv').slideUp();
				$('#secondStageHeater').selectmenu();
				$("#secondStageHeater").prop('disabled', 'disabled');
				$('#secondStageHeater').selectmenu('refresh', true);
			}else{
				isSecondStageHeaterEnabled = 1;
				//$("#enableDisableSecondStage").attr("checked", "checked");
				//$("#enableDisableSecondStage").checkboxradio("refresh");
				//$('#secondStageHeaterDiv').slideDown();
				$('#secondStageHeater').selectmenu();
				$("#secondStageHeater").prop('disabled', false);
				$('#secondStageHeater').selectmenu('refresh', true);
				count++;
				var threshold = allValues[count] + " Seconds";
				if(enableDisable2Stage != undefined){
					//Set Threshold Temperature
					initial2StageThreshold = threshold;
				}
			}
			count++;
		}
		
		if(allValues[count] != undefined){ //temperatureUnit
			if(temperatureUnit == parseInt(allValues[count])){
				temperatureUnit = allValues[count];
			}else{
				temperatureUnit = allValues[count];
				changeTemperatureUnit(parseInt(temperatureUnit));
			}
			count++;
		}
		
		var thermostatTime = allValues[count];
		if(thermostatTime != undefined){
			//update main screen thermostat time here
			$("#weekdayTime").html(moment(thermostatTime, "YYYY:MM:DD:HH:mm").format("ddd - HH:mm"));
			$("#currentDate").html(moment(thermostatTime, "YYYY:MM:DD:HH:mm").format("MMMM D, YYYY"));
			count++;
		}
		
		if(allValues[count] != undefined){
			//update main screen manual override time here
			var override = parseInt(allValues[count]);
			if(override !== 0){
				$('#thermostatManualOverride').text("Manual Override Control Time Remaining : "+override+" min");
				$('#thermostatManualOverride').show();
			}else{
				$('#thermostatManualOverride').hide();
			}
		}else{
			$('#thermostatManualOverride').hide();
		}
	}
	
}

function onConnected() {
	$('.noWifi').css({"visibility":"hidden"});
	$('.wifi').css({"color":"white"});
	//$('#currentModeIcon').css({"visibility":"visible"});
	//$("nav ul li").on( "touchstart", modeNavigationControl);
	$("#nav-overlay").css("visibility","hidden");
	$("#nav-overlay").css("z-index","0");
	lastUsedIpKey = $.jStorage.get("Last Configured");
	$("#thermostatName").html(lastUsedIpKey);
	$("#upperTemperatureValue").show();
}

function onConnectionLost() {
	$('.noWifi').css({"visibility":"visible"});
	$('.wifi').css({"color":"grey"});
	$('#currentModeIcon').html("");
	disableAtStart();
	$('nav ul li').removeClass("activeMode");
	//$("nav ul li").find(".inactiveMode").css("opacity","0.5");
	//$("nav ul li").find("").css("opacity","0.5");
	$("nav ul li").find(".modeDesc").css("visibility","hidden");
	//$("nav ul li").off( "touchstart", modeNavigationControl);
	$("#nav-overlay").css("visibility","visible");
	$("#nav-overlay").css("z-index","100");
	
	$("#temperatureValue").html("-_-");
	//$("#degreeO").html("");
	$("#temperatureUnit").html("");
	$("#currentMode").html("");
	$("#fanSpin").html("");
	$("#thermostatName").html("Connection Lost !");
	$("#upperTemperatureValue").hide();
	$('#thermostatManualOverride').hide();
	
	//console.log("Not connected to Thermostat");
}

function updateUI(modePassed, valuePassed){	//not in use right now
	makeAllOff();
	isSliderActive = sliderState.INACTIVE;
	switch(modePassed){
		case "0":
			currentThermostatMode = thermostatMode.OFF;
			marginValue = "90.53%";
			currentMode = "0";
			$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
			$("#iconPower").addClass("activeMode");
			$("nav ul li").not("#iconPower").removeClass("activeMode");
			$("#iconPower").find(".modeDesc").css("visibility","visible");
			$("nav ul li").not("#iconPower").find(".modeDesc").css("visibility","hidden");
			$("#fanSpin").css("visibility","hidden");
			offGradient();
			
			$("#upperTemperatureValue").hide(); //html('0'+'<sup style="font-size:15pt; letter-spacing: 3px;">o</sup>F');
			break;
		case "1":
			currentThermostatMode = thermostatMode.HEAT;
			currentHeatState = thermostatModeState.ON;
			initialHeatSetPoint = valuePassed;
			marginValue = "24.99%";
			currentMode = "1";
			$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
			$("#iconSunny").addClass("activeMode");
			$("nav ul li").not("#iconSunny").removeClass("activeMode");
			$("#iconSunny").find(".modeDesc").css("visibility","visible");
			$("nav ul li").not("#iconSunny").find(".modeDesc").css("visibility","hidden");
			$("#fanSpin").css("visibility","visible");
			heatGradient();
			
			$("#upperTemperatureValue").show();
			if(isUserInteracting == false){
				$("#upperTemperatureValue").html(initialHeatSetPoint+''+temperatureUnitSymbol);
			}
			temperatureSlider.setValue(initialHeatSetPoint*10);
			break;
		case "2":
			currentThermostatMode = thermostatMode.COOL;
			currentCoolState = thermostatModeState.ON;
			//currentFanState = thermostatModeState.ON;
			initialCoolSetPoint = valuePassed;
			marginValue = "41.65%";
			currentMode = "2";
			$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
			$("#iconSnow").addClass("activeMode");
			$("nav ul li").not("#iconSnow").removeClass("activeMode");
			$("#iconSnow").find(".modeDesc").css("visibility","visible");
			$("nav ul li").not("#iconSnow").find(".modeDesc").css("visibility","hidden");
			$("#fanSpin").css("visibility","visible");
			coolGradient();
			$("#upperTemperatureValue").show();
			if(isUserInteracting == false){
				$("#upperTemperatureValue").html(initialCoolSetPoint+''+temperatureUnitSymbol);
			}
			temperatureSlider.setValue(initialCoolSetPoint*10);
			break;
		case "3":
			currentThermostatMode = thermostatMode.AUTO;
			currentAutoState = thermostatModeState.ON;
			//currentFanState = thermostatModeState.ON;
			initialAutoSetPoint = valuePassed;
			marginValue = "58.31%";
			currentMode = "3";
			$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
			$("#iconAuto").addClass("activeMode");
			$("nav ul li").not("#iconAuto").removeClass("activeMode");
			$("#iconAuto").find(".modeDesc").css("visibility","visible");
			$("nav ul li").not("#iconAuto").find(".modeDesc").css("visibility","hidden");
			$("#fanSpin").css("visibility","visible");
			//autoGradient();
			$("#upperTemperatureValue").show();
			if(isUserInteracting == false){
				$("#upperTemperatureValue").html(initialAutoSetPoint+''+temperatureUnitSymbol);
			}
			temperatureSlider.setValue(initialAutoSetPoint*10);
			break;
		case "4":
			currentThermostatMode = thermostatMode.FAN;
			marginValue = "74.97%";
			currentMode = "4";
			$(".triangle").animate({ 'margin-left': marginValue }, "fast");		
			$("#iconFan").addClass("activeMode");
			$("nav ul li").not("#iconFan").removeClass("activeMode");
			$("#iconFan").find(".modeDesc").css("visibility","visible");
			$("nav ul li").not("#iconFan").find(".modeDesc").css("visibility","hidden");
			$("#fanSpin").css("visibility","hidden");
			fanGradient();
			$("#upperTemperatureValue").hide();
			break;
		default:
			break;
	}
	$('#currentModeIcon').html(thermostatMode.properties[currentThermostatMode].icon);
	$('#currentMode').html(thermostatMode.properties[currentThermostatMode].name);
	userModeChanging = false;
}

function changeTemperatureUnit(value){
	if(value == 1){ //change to Celsius
		temperatureUnitSymbol = celsiusSymbol;
		$('#temperatureUnit').html(temperatureUnitSymbol);
		minTemperature = 16;
		maxTemperature = 30;
		currentTemperature = 23;
		temperatureSlider.option("min", minTemperature*10);
		temperatureSlider.option("max", maxTemperature*10);
		$("#slideToSet").prop({
		  min: 16,
		  max: 30,
		}).slider("refresh");
		scheduleTemperatureValue = 23;	//initializing random mid value for slider default value
	}
	if(value == 0){ //change to Fahrenheit
		temperatureUnitSymbol = FahrenheitSymbol;
		$('#temperatureUnit').html(temperatureUnitSymbol);
		minTemperature = 65;
		maxTemperature = 82;
		currentTemperature = 70;
		temperatureSlider.option("min", minTemperature*10);
		temperatureSlider.option("max", maxTemperature*10);
		$("#slideToSet").prop({
		  min: 62,
		  max: 85,
		}).slider("refresh");
		scheduleTemperatureValue = 73;
	}
}