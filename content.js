$(document).ready(function(){

	/**
		STEP 1 :
			Add the div tag in the background where the time line will be added.
	**/
	var divVisual = "<div id='visualization'></div> <br /> <br />";

	$('#background').prepend(divVisual);
	
	 var container = document.getElementById('visualization');

	 /*
	 	items is the array of final experience which will be appended to the timeline.
	 */
	 var items = new vis.DataSet();
	 var overallIdIndex = 0;
	 
	 console.log("================MAIN=================");
	 $('[id^="experience"][id$="view"]').each( function(index, element) {
	 	
	 	/**
	 		STEP 2: 
	 				Get the designation of the person.
	 	**/
	 	var designation = ""
	 	if ( $('a[name="title"]', this).length > 0) {
	 	 	designation = $('a[name="title"]', this).text();	
	 	 	//console.log(designation);
	 	} 
	 	
	 	/*
		STEP 3:
				 Get the company/Organisation's name with which the person has been associated.
	 	*/
	 	var companyName = "";
	 	if ($('a[title="Find others who have worked at this company"]', this).length > 0) {
	 		companyName = $('a[title="Find others who have worked at this company"]', this).text();
	 		console.log(companyName);
	 	} else if ($('header h5 strong a', this).length > 0) {
	 		companyName = $('header h5 strong a', this).text();
	 		//console.log(companyName);
	 	}
	 	
	 	/*
		STEP 4:
				 Get the date range for which the person has been working with a company/organization.
				 Date range in linkedin is stored as in one of the following formats
				 August 2010 - Present
				 May 2013 – November 2014 (1 year 7 months)
				 Auguest 2010 - 2011
				 2010 - 2011
				 2010 - May 2013
				 HOW TO FIND START YEAR: So finding the start year was very easy. that is just find the index of "-" in the string and get the 4 chars left to "-".
				 HOW TO FIND END YEAR: To do that find two chars righ of "-". Compare it with
				 	a.) "Pr" for "Present"  
				 	b.) "20"/"19" if only year is present but not the month is present.
				 	c.)  This must be the case of End Date like November 2014 (1 year 7 months). In this case first search for "(" in the string
				 	and then get 4 chars to the left of "(". This will be the end year.
				 Next before adding dates in the timeline first check if the start year is equal to end year. If that is so add only the 
				 start year to get special UI effect if dot and line rather than a bar.

	 	*/
	 	var dateRawOutput = "";
	 	var startYear = "", endYear = "";
	 	if ($(".experience-date-locale", this).length > 0){
	 		//console.log("found date");
	 		dateRawOutput = $(".experience-date-locale", this).text();
	 		var indexVal=dateRawOutput.indexOf('–');

	 		startYear = dateRawOutput.substring(indexVal-5, indexVal-1);
	 		endString = dateRawOutput.substring(indexVal+1, indexVal+4);
	 		
	 		if (endString !== 'undefined') {
	 			if (endString === " Pr") {
	 				var x = new Date();
	 				endYear = String(x.getFullYear());
	 			} else if (endString == "20" || endString == "19") { //Only year is present
	 				endYear = dateRawOutput.substring(indexVal+1, indexVal+6);
	 			} else { //Month and Year must be present
	 				var braceIndex=dateRawOutput.indexOf('(');
	 				endYear = dateRawOutput.substring(braceIndex-1, braceIndex-5);
	 			}
	 		} 
	 	}
	 	console.log("designation:" + designation + " companyName:" + companyName + " Start: " + startYear + " End:" + endYear);
	 	if ((startYear === 'undefined' && endYear === 'undefined') || (startYear === 'NaN' && endYear === 'Nan') || (startYear.length == 0 && endYear.length == 0)) {
	 		console.log("Dates Invalid ! !");
	 	} else if (designation.length == 0 && companyName.length == 0) {
	 		console.log("Designation and company info is Invalid ! !");
	 	} else if (startYear == endYear) {
	 		items.add({id: ++overallIdIndex, content: designation + "-" + companyName , start: startYear});
	 		console.log("Added: " + overallIdIndex + ":" + designation + "-" + companyName +":" + "SD:" + startYear);
	 	} else {
	 		items.add({id: ++overallIdIndex, content: designation + "-" + companyName , start: startYear, end: endYear});
	 		console.log("Added: " + overallIdIndex + ":" + designation + "-" + companyName +":" + "SD:" + startYear + "ED:" + endYear) ;
	 	}
	 });
	 console.log("================MAIN END=================");

	  // Configuration for the Timeline
	  var options = {
	  	 timeAxis: {scale: 'year', step: 2},
	  	 
	  	 width:  '100%',
	     style: 'box',
	     margin :{
	     	item : {
	     		horizontal: 300
	     	}
	     }
	  };

	  // Create a Timeline
	  if (items.length > 0) {
	  	var timeline = new vis.Timeline(container, items, options);	
	  }
	  
});
