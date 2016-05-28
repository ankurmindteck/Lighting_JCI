var clndr = {};

if(!window.console) {
  window.console = {
    log: function(whatever) {
      // sad face.
    }
  }
}


$( function() {
  calendar = $('#calendarDiv').clndr({
    events: schedulerEvents,
    multiDayEvents: {
      startDate: 'startDate',
      endDate: 'endDate',
      singleDay: 'date'
    },
    clickEvents: {
      click: function(target) {
        console.log(target);		
		alert(target.events[0].title);
      }
    }
  });
  
});


/* 
//dynamic creation of upcoming schedules
function showSchedules() {
		
    var myTableDiv = document.getElementById('upTable');
	for (var m=0; m<3; m++){
		
		var table = document.createElement('TABLE');
		table.className ="table"; 
		var tableBody = document.createElement('TBODY');
		table.appendChild(tableBody);
		
		var tableTitle = document.createElement('TABLE');
		tableTitle.className ="table";
		tableTitle.style.marginTop="15px";
		var tableTitleBody = document.createElement('TBODY');
		tableTitle.appendChild(tableTitleBody);
		var trTitle = document.createElement('TR');
		tableTitleBody.appendChild(trTitle);
			var th = document.createElement('TH');
			th.className = "table-th title";
			var the = document.createElement('TH');
			the.className = "table-th duration";
			th.appendChild(document.createTextNode("Title"));
			the.appendChild(document.createTextNode("Duration"));
			trTitle.appendChild(th); 
			trTitle.appendChild(the); 

			  
		for (var i=0; i<3; i++){
		   var tr = document.createElement('TR');
		   tableBody.appendChild(tr);
				for (var j=0; j<2; j++){
					var td = document.createElement('TD');
					if(j==0)
						td.className = "table-tdo";
					else
						td.className = "table-td";
					td.appendChild(document.createTextNode("Cell " + i + "," + j));
					tr.appendChild(td);
				}
		}
		myTableDiv.appendChild(tableTitle);
		myTableDiv.appendChild(table);
	}
}*/



