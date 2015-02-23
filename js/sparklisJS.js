/********************************************************           
 * spakrlisJS -- SemViz.    *   
 *                                                      *   
 * Author:  SemVizTeam                                  *   
 *                                                      *   
 * Purpose:  Demonstration of a request on Sparklis.    *   
 *                                                      *   
 * Usage:                                               *   
 *      Create a request and charts appear.       *   
 ********************************************************/ 

var absciss = [];
var ordonate = [];
var ordonate_second = [];
var ordonate_third = []
var graphe_title = [];
var currentChart = "";
var numGraphe = 0;

var graph_compte_mesure = 0;
var graph_absciss = [];
var graph_ordonate = [];
var graph_ordonate_second = [];
var graph_ordonate_third = [];
var finalTab = [];
var legend_absciss =[];
var lengend_ordonate ="";


var tlongitude = [];
var tlatitude = [];
var tgeographicName = [];
var longitude, latitude, geographicName;

//MO reacts to changes in a DOM. It detects when 'extension' appears.
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {

		for (var i = 0; i < mutation.addedNodes.length; i++){

			if (mutation.addedNodes[i].id == 'extension') { 
				lookOverDom();
				updatebyNumberResults();
				updatebyNumberResultsOrdonate();
				reloadChart();
			}
			if ($("#results").is(":hidden") ){
				$("#control-charts").hide();
			}

		}
	});
});

observer.observe(document, {
	childList: true,
	subtree: true,
	attributes: false,
	characterData: false,
});



function lookOverDom(){

	ordonate, ordonate_second, ordonate_third, finalTab = [];

	var tableToJSON = [];
	var headerTable = [];
	finalTab = [];

	//Get tableToJSON without the first colunm useless
	tableToJSON = $('table#extension').tableToJSON({ ignoreColumns: [0] });

	//Get header of tableToJSON
	var keysTable = tableToJSON.first();
	headerTable = Object.extended(keysTable).keys();
	var value;

	$("#control-charts").show();


	detectDimMetric(headerTable, tableToJSON);

	//Dimension selected  
	$('input:radio[name=dimensionRadioButton]').bind('change', function() {
		absciss = [];
		value = $(this).val();
		var abscissIndex = headerTable.findIndex(value);
		finalTab = generateData(tableToJSON);

		absciss = finalTab[abscissIndex];
		reloadChart();
	});

	//When an user selects interest in an addtional measure, add this to alsoInterested
	$('input:checkbox[name=measureRadioButton]').bind('change', function() {
		updatebyNumberResultsOrdonate();
		reloadChart();
	});

	visualizationMap(headerTable);
}

function visualizationMap(headerTable){
	
	tlongitude, tlatitude, tgeographicName = [];
	var tableToJSON = $('table#extension').tableToJSON({ ignoreColumns: [0]});

	longitude = headerTable.find(/long/);
	latitude = headerTable.find(/lat/);
	geographicName = headerTable.find(/place|country|town|city/);

	if(longitude && latitude && geographicName){
		tlongitude = lala(longitude, headerTable, tableToJSON);
		tlatitude = lala(latitude, headerTable, tableToJSON);
		tgeographicName = lala_name(geographicName, headerTable, tableToJSON);
	}	
}

function lala(name, headerTable, tableToJSON){
	var tab =[];
	var value = headerTable.findIndex(name);
	finalTab = generateData(tableToJSON);
	finalTab[value].forEach(function(a) {
		var parseOrdonates = parseFloat(a);
		tab.add(parseOrdonates);
	});
	return tab;
	
}
function lala_name(name, headerTable, tableToJSON){
	var tab =[];
	var value = headerTable.findIndex(name);
	finalTab = generateData(tableToJSON);
	tab = finalTab[value];
	return tab;
}


// Delete useless inputs
 function updateInput(headerTable) {         
     var allVals = [];
     $("input[name=dimensionRadioButton]:radio").each(function() {
		allVals.push($(this).val());
	});
	$("input[name=measureRadioButton]:checkbox").each(function() {
		allVals.push($(this).val());
	});

	for(var i= 0; i < allVals.length; i++)
	{
 		if(headerTable.findIndex(allVals[i]) < 0){
 			var nameSpace = allVals[i].remove("'")
			nameSpace = nameSpace.underscore();;

 			$('#'+nameSpace).remove();
 			$('#'+nameSpace+"1").remove();

 		}
	}
}

/*
 * Analyzing data to identify those dimensions of those metrics
 * array tableToJSON : results of table named "extension"
 * array headerTable : headers of tableToJSON
 */
function detectDimMetric(headerTable, tableToJSON){

	//Radio Buttons
	var listDim = $('#dimensions');
	var listM = $('#metrics');
	var dimensionRadioButton = "dimensionRadioButton";
	var measureRadioButton = "measureRadioButton";
	var radio = "radio";
	var checkbox = "checkbox";

	// Create Radio Button : Dimension and Measure
	headerTable.forEach(function(a) {
		var i = 0;
		var j = 0;
		$("input[name=dimensionRadioButton]:radio").each(function() {
			if($(this).val() == a) i++;
		});
		$("input[name=measureRadioButton]:checkbox").each(function() {
			if($(this).val() == a) j++;
		});
		if(i == 0 && j == 0 )
		{  
			var abscissIndex = headerTable.findIndex(a);
			finalTab = generateData(tableToJSON);
			var text = finalTab[abscissIndex].first()

			//get contains the value between the parentheses 
			var regExp = /\(([^)]+)\)/;
			var matches = regExp.exec(text);
			var isAllNum = /\d+/g.test(text);

			//matches text contains numeric value
			var isNum = /\d+/g.test(matches);

			//matches text contains dd-mm-yyyy : date
			var withoutParentheses = text.replace(/ *\([^)]*\) */g, "");
			var isDate = (/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/g).test(withoutParentheses);

			//matches text contains latitude and longitude coordinates : geographic coordinates 
			var isGeoCoord = (/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g).test(withoutParentheses);


			if(matches && matches[1]!= "en" && matches[1]!= "fr" && matches[1]!= "string" && !isNum && !isDate && !isGeoCoord && isAllNum){
				addInput(listM, measureRadioButton, a, a, checkbox); 
			}else{  
				addInput(listDim, dimensionRadioButton, a, a, radio); 

			} 
		}
		updateInput(headerTable);
	});

}

/*
 * Running of Mutli Measures : 
 * array ordonate : 3 max
 * array tableToJSON : results of table named "extension"
 * array headerTable : headers of tableToJSON
 * string value : an header 
 */
function generateOrdonate(ordonate, value, tableToJSON, headerTable ){

	var ordonateesIndex = headerTable.findIndex(value);

	finalTab = generateData(tableToJSON);

	finalTab[ordonateesIndex].forEach(function(a) {
		var parseOrdonates = parseFloat(a);
		ordonate.add(parseOrdonates);
	});
}

/*
 * Measures related to Dimension
 * array tableToJSON : results of table named "extension"
 */
function generateData (tableToJSON){

	var keys =  Object.keys(tableToJSON[0]);

	var finalTab = keys.map(function(key) {
		return tableToJSON.map(function(n) {
			return n[key];
		});
	});

	return finalTab;
}

/*
 * Create RadioButton for Measure and Dimension
 * string lcontainer 	: container which contains inputs (Radio or Checkbox)
 * string name  : RadioButton attr. 
 * string value : RadioButton attr.
 * string text  : Label contains text associated to the RadioButton
 * sintrg type 	: "radio" or "checkbox"
 */ 
function addInput(lcontainer, name, value, text, type) {

	var container = $(lcontainer);
	var inputs = container.find('input');
	var nameSpace = value.remove("'")
	nameSpace = nameSpace.underscore();

	$('<input />', { type: type, name: name, value: value, id:nameSpace }).appendTo(container);
	$('<label />', { 'for': nameSpace, text: value, id:nameSpace+"1" }).appendTo(container);
}

//Reacts to changes dimensions in DOM
function updatebyNumberResults(){
	var tableToJSON = $('table#extension').tableToJSON({ ignoreColumns: [0] });
	var keysTable = tableToJSON.first();
	var headerTable = Object.extended(keysTable).keys();

	if($('input:radio[name=dimensionRadioButton]:checked')){
		absciss = [];

		value = $('input:radio[name=dimensionRadioButton]:checked').val();
		var abscissIndex = headerTable.findIndex(value);
		finalTab = generateData(tableToJSON);

		absciss = finalTab[abscissIndex];
		legend_absciss = finalTab[abscissIndex];	
	}
}

//Reacts to changes metrics in DOM
function updatebyNumberResultsOrdonate(){

	var tableToJSON = $('table#extension').tableToJSON({ ignoreColumns: [0] });
	var keysTable = tableToJSON.first();
	var headerTable = Object.extended(keysTable).keys();

	var alsoInterested = [];
	ordonate = [];
	ordonate_second = [];
	ordonate_third = [];
	$('input:checkbox[name=measureRadioButton]').each(function(index, value) {
		if (this.checked) {
			/*get name of measure associated with checkbox*/
			value = $(this).val();
			alsoInterested.add(value);
		}
	});

	finalTab = generateData(tableToJSON);

	legend_ordonate =[];

	switch (alsoInterested.length) {
	case 1:
		generateOrdonate(ordonate, alsoInterested[0], tableToJSON, headerTable);

		legend_ordonate.add(alsoInterested[0]);
		break;
	case 2:
		generateOrdonate(ordonate, alsoInterested[0], tableToJSON, headerTable);
		generateOrdonate(ordonate_second, alsoInterested[1], tableToJSON, headerTable);

		legend_ordonate.insert([alsoInterested[0], alsoInterested[1]]);
		break;
	case 3:
		generateOrdonate(ordonate, alsoInterested[0], tableToJSON, headerTable);
		generateOrdonate(ordonate_second, alsoInterested[1], tableToJSON, headerTable);
		generateOrdonate(ordonate_third, alsoInterested[2], tableToJSON, headerTable);

		legend_ordonate = alsoInterested;
		break;

	default:
		break;
	}
}

function addChart() {
	numGraphe++;
	var aera = document.getElementById("charts");
	//create object to insert as a list object
	var chart = $('<li class="chart" id="chart' + numGraphe + '">').appendTo(aera); 
	// close button
	$('<div class="close"><img id="delete-current-focus" height="16" title="Click on this red cross to delete the current focus" alt="Delete" src="icon-delete.png"></div>').appendTo(chart); 
	$('<div class="modify">Modify</div>').appendTo(chart); 
	
	//clone the current graph ino the list div 
	var current = $('#graphe').clone();
	current[0].id = current[0].id + numGraphe;
	current.appendTo(chart);
	
	//add function in order to delete the list object
	$('.close').click(function() {
		$(this).closest('li').remove();
		//Delete too the chartClicked
		if($('#currentChartClicked')){
			if($(this).closest('li')[0].children[1].id == $('#currentChartClicked')[0].children[1].id) {
				$('#currentChartClicked')[0].innerHTML = "";
			}
		}
	});


	$('.chart').click(function() {
		$('li').removeClass('selected');
		$(this).addClass('selected');
		var aera2 = document.getElementById('chartClicked');
		aera2.innerHTML = "";
		var name = $(this)[0].children[1].id;
		var chart2 = $('<div id="currentChartClicked" name="' + name + '">').appendTo(aera2);		
		var current2 = $('#' + name).clone().appendTo(chart2);
	});
	$('.modify').click(function() {
		Alert.warning('Not available yet !', 'Chart', {displayDuration: 0});
	});
}



google.load('visualization', '1', {
	packages : [ 'corechart', 'map', 'table' ]
});


//absciss = [ 'France', 'Allemagne', 'Espagne', 'Italie', 'Angleterre' ];
//ordonate = [ 65000000, 82000000, 45000000, 34000000, 6E6 ];
//graphe_title = [ 'Country', 'Population' ]

function in_array(string, array){
	var result = false;
	for(i=0; i<array.length; i++){
		if(array[i] == string){
			result = true;
		}
	}
	return result;
}

//function aggregator count, counting the number of times an item is present in the table
function aggreg_count() {
	graph_ordonate= [];
	graph_absciss = [];
	var increm =0;
	if(!absciss){
		Alert.info('Choose at least a metric and  dimension choice is mandatory.', 'Chart modeling');
	} else {
	for (var i = 0; i < absciss.length; i++) {
		if (!in_array(absciss[i],graph_absciss)){
			graph_ordonate [increm] = 1;
			graph_absciss.add(absciss[i]);
			for (var y=0; y < absciss.length; y++) {
				if (i!=y) {
					if (absciss[i]==absciss[y]){
						graph_ordonate [increm] = graph_ordonate[increm]+1;
					}
				}
			}
			increm = increm +1;
		}
	}
}

}

//function aggregator sum, if there are two (or more) same item in the array, it add their measure
function aggreg_somme() {
	graph_ordonate= [];
	graph_ordonate_second= [];
	graph_ordonate_third= [];
	graph_absciss = [];
	var increm =0;
	for (var i = 0; i < absciss.length; i++) {
		if (!in_array(absciss[i],graph_absciss)){
			switch (graph_compte_mesure) {
			case 1:
				graph_ordonate [increm] = ordonate[i];
				break;
			case 2:
				graph_ordonate [increm] = ordonate[i];
				graph_ordonate_second [increm]= ordonate_second[i];
				break;
			case 3:
				graph_ordonate [increm] = ordonate[i];
				graph_ordonate_second [increm]= ordonate_second[i];
				graph_ordonate_third [increm]= ordonate_third[i];
				break;
			default:
				graph_ordonate [increm] = ordonate[i];
			}
			graph_absciss.add(absciss[i]);
			for (var y=0; y < absciss.length; y++) {
				if (i!=y) {
					if (absciss[i]==absciss[y]){
						switch (graph_compte_mesure) {
						case 1:
							graph_ordonate [increm] = graph_ordonate[increm]+ordonate[y];
							break;
						case 2:
							graph_ordonate [increm] = graph_ordonate[increm]+ordonate[y];
							graph_ordonate_second [increm]= graph_ordonate_second [increm]+ordonate_second[y];
							break;
						case 3:
							graph_ordonate [increm] = graph_ordonate[increm]+ordonate[y];
							graph_ordonate_second [increm]= graph_ordonate_second [increm]+ordonate_second[y];
							graph_ordonate_third [increm]= graph_ordonate_third [increm]+ordonate_third[y];
							break;
						default:
							graph_ordonate [increm] = graph_ordonate[increm]+ordonate[y];
						}
					}
				}
			}
			increm = increm+ 1;
		}
	}
}

//function aggregator average, if there are two (or more) same item in the array, it makes an average of their measure
function aggreg_moyenne() {
	graph_ordonate= [];
	graph_ordonate_second= [];
	graph_ordonate_third= [];
	graph_absciss = [];
	var increm = 0;
	for (var i = 0; i < absciss.length; i++) {
		if (!in_array(absciss[i],graph_absciss)){
			switch (graph_compte_mesure) {
			case 1:
				graph_ordonate [increm] = ordonate[i];
				break;
			case 2:
				graph_ordonate [increm] = ordonate[i];
				graph_ordonate_second [increm] = ordonate_second[i];
				break;
			case 3:
				graph_ordonate [increm] = ordonate[i];
				graph_ordonate_second [increm] = ordonate_second[i];
				graph_ordonate_third [increm] = ordonate_third[i];

				break;
			default:
				graph_ordonate [increm] = ordonate[i];
			}
			graph_absciss.add(absciss[i]);
			var count = 1;
			for (var y=0; y < absciss.length; y++) {
				if (i!=y) {
					if (absciss[i]==absciss[y]){
						switch (graph_compte_mesure) {
						case 1:
							graph_ordonate [increm] = graph_ordonate[increm]+ordonate[y];
							break;
						case 2:
							graph_ordonate [increm] = graph_ordonate[increm]+ordonate[y];
							graph_ordonate_second [increm] = graph_ordonate_second [increm] +ordonate_second[y];
							break;
						case 3:
							graph_ordonate [increm] = graph_ordonate[increm]+ordonate[y];
							graph_ordonate_second [increm] = graph_ordonate_second [increm] +ordonate_second[y];
							graph_ordonate_third [increm] = graph_ordonate_third [increm] + ordonate_third[y];
							break;
						default:
							graph_ordonate [increm] = graph_ordonate[increm]+ordonate[y];
						}
						count++;
					}
				}
			}
			switch (graph_compte_mesure) {
			case 1:
				graph_ordonate [increm] = graph_ordonate [increm]/count;
				break;
			case 2:
				graph_ordonate [increm] = graph_ordonate [increm]/count;
				graph_ordonate_second [increm] = graph_ordonate_second [increm]/count;
				break;
			case 3:
				graph_ordonate [increm] = graph_ordonate [increm]/count;
				graph_ordonate_second [increm] = graph_ordonate_second [increm]/count;
				graph_ordonate_third [increm] = graph_ordonate_third [increm]/count;
				break;
			default:
				graph_ordonate [increm] = graph_ordonate [increm]/count;
			}
			increm = increm+1;
		}
	}
}

//function agregator no-one, it's just a function when the user doesn't want the aggregator system
function aggreg_aucun() {
	graph_absciss = absciss;
	switch (graph_compte_mesure) {
	case 1:
		graph_ordonate= ordonate;
		break;
	case 2:
		graph_ordonate= ordonate;
		graph_ordonate_second = ordonate_second;
		break;
	case 3:
		graph_ordonate= ordonate;
		graph_ordonate_second = ordonate_second;
		graph_ordonate_third = ordonate_third;
		break;
	default:
		aggreg_count();
	}
}

function submit(btn) {
	currentChart = btn;
	var xhr;
	try { // Essayer IE
		xhr = new ActiveXObject('Msxml2.XMLHTTP');
	}
	// Echec, utiliser l'objet standard 
	catch (e) {
		try {
			xhr = new ActiveXObject('Microsoft.XMLHTTP');
		} catch (e2) {
			try {
				xhr = new XMLHttpRequest();
			} catch (e3) {
				xhr = false;
			}
		}
	}

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200)
				document.ajax.dyn = "Received:" + xhr.responseText;
			else
				document.ajax.dyn = "Error code " + xhr.status;
		}
	};

	// compte le nombre de mesure selectionne
	// cas ou une seule mesure est selectionne
	if (ordonate_third.length==0 && ordonate_second.length==0 && ordonate.length!=0) {
		graph_compte_mesure = 1;
	}
	//cas ou deux mesures sont selectionne
	else if (ordonate_third.length==0 && ordonate_second.length!=0) {
		graph_compte_mesure = 2;
	}
	// cas ou trois mesures sont selectionne
	else if (ordonate_third.length != 0) {
		graph_compte_mesure = 3;
	}
	else {
		graph_compte_mesure = 0;
	}

	// choix de l'aggregation
	var aggreg = document.getElementById("aggregator").value;
	switch (aggreg) {
	case 'Somme':
		aggreg_somme();
		break;
	case 'Compte':
		aggreg_count();
		break;
	case 'Moyenne':
		aggreg_moyenne();
		break;
	case 'Aucun':
		if (graph_compte_mesure==0) {
			aggreg_count();
		}
		else {
			aggreg_aucun();
		}

		break;
	default:
		aggreg_aucun();
	}
	// choix du type de graphique
	switch (btn) {
	case 'line':
		google.setOnLoadCallback(drawLineChart());
		break;
	case 'pie':
		google.setOnLoadCallback(drawPieChart());
		break;
	case 'map':
		google.setOnLoadCallback(drawMapChart());
		break;
	case 'histo_vertical':
		google.setOnLoadCallback(drawBarChart_vertical());
		break;
	case 'histo_horizontal':
		google.setOnLoadCallback(drawBarChart_horizontal());
		break;
	case 'point':
		google.setOnLoadCallback(drawPointChart());
		break;
	default:
		Alert.error('Review Settings', 'Chart', {displayDuration: 0});
	}
	graph_compte_mesure = 0;
}


// Define a custom chart
function optionsChart(){

	var options = {
			title : $('#chartTitle').val(),
			titleTextStyle : {
				color: $('#colorTitle').val(),
				fontName: $('#fontName').val(),
				fontSize: $('#fontSizeTitle').val(),
				bold: $('#boldTitle').is(':checked'),
				italic: $('#italicTitle').is(':checked')
			},
			legend: {
				textStyle : {
					color: $('#colorTitleLegend').val(),
					fontName: $('#fontName').val(),
					fontSize: $('#fontSizeTitleLegend').val(),
					bold: $('#boldTitleLegend').is(':checked'),
					italic: $('#italicTitleLegend').is(':checked')
				}
			},
			width : 1000,
			height : 563,
			backgroundColor: $('#backgroundColorChart').val(),
			hAxis : {
				title : graphe_title[0]
			},
			vAxis : {
				title : graphe_title[1]
			}
	};

	return options;
}


//function to compare two array
function compareArray(a1, a2)
{
	if (a1.length != a2.length) {
		return false;
	} else {
		for (var a = 0; a < a1.length; ++a) {
			if (a1[a] != a2[a]) {
				return false;
			}
		}
	}
	return true;
}

//Map
function drawMapChart() {
	// corespondance des tableau
	var don =  [];
	if((compareArray(tlongitude,graph_ordonate)||compareArray(tlongitude,graph_ordonate_second)) && (compareArray(tlatitude,graph_ordonate)||compareArray(tlatitude,graph_ordonate_second))){// cas troisième mesure
		don = graph_ordonate_third;
	}
	else if((compareArray(tlongitude,graph_ordonate)||compareArray(tlongitude,graph_ordonate_third)) &&(compareArray(tlatitude,graph_ordonate)||compareArray(tlatitude,graph_ordonate_third))){// cas deuxième mesure
		don = graph_ordonate_second;
	}
	else {// cas premier mesure
		don = graph_ordonate;
	}
	
	var data_graph = new google.visualization.DataTable();
	data_graph.addColumn('number', 'LATITUDE', 'Latitude');
	data_graph.addColumn('number', 'LONGITUDE', 'Longitude');
	data_graph.addColumn('number', 'VALUE', 'Value');
	for (var i = 0; i < tlatitude.length; i++) {
		data_graph.addRows([ [ tlatitude[i], tlongitude[i], don[i] ] ]);
	}
	  // here the option of our representation
	  var options_graph = optionsChart();
	
	    var chart_graph = new google.visualization.GeoChart(document.getElementById('graphe'));
	    chart_graph.draw(data_graph, options_graph);

}

//Column chart
function drawBarChart_vertical() {
	var data_for_googleChart = insertData();

	var options_bar = optionsChart();

	// add chart into div #graph
	var chart_column = new google.visualization.ColumnChart($('#graphe')[0]);
	chart_column.draw(data_for_googleChart, options_bar);
}

//Bar chart
function drawBarChart_horizontal() {
	var data_for_googleChart = insertData();

	var options_bar = optionsChart();

	//Add chart into div #graph
	var chart_bar = new google.visualization.BarChart($('#graphe')[0]);
	chart_bar.draw(data_for_googleChart, options_bar);
}

//Line Chart
function drawLineChart() {
	var data_for_googleChart = insertData();

	var options_line =  optionsChart();

	//Add chart into div #graph
	var chart_line = new google.visualization.LineChart($('#graphe')[0]);
	chart_line.draw(data_for_googleChart, options_line);
}

//Pie chart
function drawPieChart() {
	var data_pie = new google.visualization.DataTable();
	data_pie.addColumn('string', 'X');
	data_pie.addColumn('number', 'People');

	//here we insert the data from our two table
	for (var i = 0; i < graph_absciss.length; i++) {
		data_pie.addRows([ [ graph_absciss[i], graph_ordonate[i] ] ])
	}
	// here the option of our representation
	var options = {
			title : 'ici un titre',
			width : 1000,
			height : 563,
			is3D : true
	};

	var chart_pie = new google.visualization.PieChart($('#graphe')[0]);
	chart_pie.draw(data_pie, options);
}

//Add  data series to one of charts 
function insertData() {
	var tables = new google.visualization.DataTable();
	if (document.getElementById("aggregator").value == 'Compte') {

		//Add data series of 2 metrics
		tables.addColumn('string', legend_absciss);
		tables.addColumn('number', 'number of occurences');
		for (var i = 0; i < graph_absciss.length; i++) {
			tables.addRows([ [ graph_absciss[i], graph_ordonate[i] ] ])
		}
	}
	else {
		switch (graph_compte_mesure) {
		case 1:
		//Add data series of a metric
			tables.addColumn('string', legend_absciss);
			tables.addColumn('number', legend_ordonate[0]);
			for (var i = 0; i < graph_absciss.length; i++) {
				tables.addRows([ [ graph_absciss[i], graph_ordonate[i] ] ])
			}
			break;
		case 2:
		//Add data series of 2 metrics
			tables.addColumn('string', legend_absciss);
			tables.addColumn('number', legend_ordonate[0]);
			tables.addColumn('number', legend_ordonate[1]);
			for (var i = 0; i < graph_absciss.length; i++) {
				tables.addRows([ [ graph_absciss[i], graph_ordonate[i], graph_ordonate_second[i] ] ])
			}
			break;
		case 3:
		//Add data series of 3 metrics
			tables.addColumn('string', legend_absciss);
			tables.addColumn('number', legend_ordonate[0]);
			tables.addColumn('number', legend_ordonate[1]);
			tables.addColumn('number', legend_ordonate[2]);
			for (var i = 0; i < graph_absciss.length; i++) {
				tables.addRows([ [ graph_absciss[i], graph_ordonate[i], graph_ordonate_second [i], graph_ordonate_third [i] ] ])
			}
			break;
		default:
		//Add data series without metrics
			tables.addColumn('string', legend_absciss);
			tables.addColumn('number', 'number of occurences');
			for (var i = 0; i < graph_absciss.length; i++) {
				tables.addRows([ [ graph_absciss[i], graph_ordonate[i] ] ])
			}
		}
	}
	return tables;
}
$( "#personnaliser" ).bind( "click submit", function() {
	reloadChart();
});
$( "#aggregator" ).bind( "click submit", function() {
	reloadChart();
});

function reloadChart() {
	//Reload chart if a chart type was selected
	if(currentChart!=""){
		submit(currentChart);
	}
}
