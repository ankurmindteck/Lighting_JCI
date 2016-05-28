//Global variables
//Settings

var minTemperature = 65;
var maxTemperature = 82;
var currentTemperature = 70;	//get initial temperature from thermostat
var temperatureCount = (maxTemperature-minTemperature)+1; //total no. of values from min to max
var temperatureSlider = null;	//slider variable to use as an object
var incrementCounter = currentTemperature - minTemperature;

var ipAddress = '192.168.1.1';
var lastUsedIpKey;
var defaultIpKey = "AP Mode"
var locale;		//not in use

var activeScheduleId = "f";	//get from Thermostat

var scheduleMaxLimit = 10;  //maximum limit of schedules
var timingsMaxLimit = 5;    //maximum limit of timings that can be added in one schedule
var nextScheduleId = 0;		//updating while parsing all schedules.
var totalScheduleCount = 0;
var maxLimitMessage = "Maximum schedule creation limit reached";

var thermostatMode = {   //thermostat modes
	OFF: 0, 
	HEAT: 1,
	COOL: 2, 
	AUTO: 3, 
	FAN: 4, 
	properties: {
	0: {name: "Off", icon: "D"},
    1: {name: "Heat", icon: "G"},
    2: {name: "Cool", icon: "E"},
    3: {name: "Auto", icon: ""},
	4: {name: "Fan", icon: "B"}
  }};
var currentThermostatMode = thermostatMode.AUTO;

var thermostatModeState = {OFF: 0, ON: 1};
var currentHeatState = thermostatModeState.OFF;
var currentCoolState = thermostatModeState.OFF;
var currentAutoState = thermostatModeState.OFF;

var thermostatFanState = {ON: 0, AUTO: 1};
var currentFanState = thermostatFanState.AUTO;

var scheduleRunningState = false;

var schedulerEvents = [];  //array of all schedules
/*	{ startDate: moment().format('YYYY-MM-') + '12', endDate: moment().format('YYYY-MM-') + '17', days: 62, id: 8, type: 'Range', title: 'My Schedule', time: [
								{ startTime: moment(moment().format('YYYY-MM-DD') + ' 06:30'), endTime: moment("6:30", "hh:mm"), mode: '3', temperature: '72' },	//multiday events
								{ startTime: moment(moment().format('YYYY-MM-DD') + ' 12:30'), endTime: moment(moment().format('YYYY-MM-') + '12 21:30'), mode: '2', temperature: '55' }
								]},	//Range type multi-day events
	{ startDate: moment().format('YYYY-MM-') + '02', endDate: moment().format('YYYY-MM-') + '28', days: 11, id: 9, type: 'Repeat', title: 'Andy\'s Schedule june', time: [
								{ startTime: moment(moment().format('YYYY-MM-DD') + ' 00:30'), endTime: moment(moment().format('YYYY-MM-') + '12 05:30'), mode: '1', temperature: '80' },	//multiday events
								{ startTime: moment(moment().format('YYYY-MM-DD') + ' 08:30'), endTime: moment(moment().format('YYYY-MM-') + '12 10:30'), mode: '4'},	//multiday events
								{ startTime: moment(moment().format('YYYY-MM-DD') + ' 15:30'), endTime: moment(moment().format('YYYY-MM-') + '12 10:30'), mode: '0'}	//multiday events
								]},	//Repeat type events						
];*/

var calendar; //calendar, initialized in scheduler.js. used to set Events on update.

var repeatTracker=127;   //var that tracks scheduler repeat days. Its in binary. 0 means none, 127 means - all days are selected

var sliderState = {INACTIVE: 0, ACTIVE: 1};
var isSliderActive = sliderState.INACTIVE;

var userModeChanging = false;


//Variables for initial setup of Thermostat - settings parameters
var initialCycleRate;
var initialMinOffTime;
var initialMinOnTime;
var initialCoolDeadBand;
var initialHeatDeadBand;
var initial2StageThreshold;
var isSecondStageHeaterEnabled;	//Updated on 1st Dec.
var initialManualOverride = 30;  //manual override duration. range : 5-30, steps: 5

var initialHeatSetPoint = 0;
var initialCoolSetPoint = 0;
var initialAutoSetPoint = 0;

var temperatureUnit = 0;  // 0 - Fahrenheit, 1 - Celsius

var fanRunningStatus;

var exchangeDegreesFarhenheit;
var sessionInfo = {};

//Variables for weather
var userLatitude;
var userLongitude;
var appid = '10854226fcb8d50e3fc899cdb08749d6';
var currentWeatherIconClass = "wi-na";
var prevWeatherIconClass = "wi-day-rain";
var nextWeatherIconClass = "wi-day-cloudy";

var celsiusSymbol = '&#8451;';
var FahrenheitSymbol = '&#8457;';
var percentageSymbol = '&#37';
var lightingUnitSymbol = percentageSymbol;
var temperatureUnitSymbol = FahrenheitSymbol; //default

var currentPassword;

var connectionStatus = true;
