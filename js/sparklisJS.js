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
var graphe_title = [];

var graph_absciss = [];
var graph_ordonate = [];

//MO reacts to changes in a DOM. It detects when 'extension' appears.
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {

        for (var i = 0; i < mutation.addedNodes.length; i++){

            if (mutation.addedNodes[i].id == 'extension') { 
                lookOverDom();
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

    //Radio Buttons
    var listDim = $('#dimensionRadio');
    var listM = $('#measureRadio');
    var dimensionRadioButton = "dimensionRadioButton";
    var measureRadioButton = "measureRadioButton";

    //Get tableToJSON without the first colunm useless
    var tableToJSON = $('table#extension').tableToJSON({ ignoreColumns: [0] });

    //Get header of tableToJSON
    var keysTable = tableToJSON.first();
    var headerTable = Object.extended(keysTable).keys()
    var value;
    var finalTab = [];

    $("#control-charts").show();

    // Create Radio Button : Dimension and Measure
    headerTable.forEach(function(a) {
        var i = 0;

        $("input[name=dimensionRadioButton]:radio").each(function() {
            if($(this).val() == a) i++;
        });

        if(i == 0)
        {  
            var abscissIndex = headerTable.findIndex(a);
            finalTab = generateData(tableToJSON);
            var text = finalTab[abscissIndex].first()

            //matches text contains the value between the parentheses
            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(text);
            
            if(matches && matches != "en" && matches != "fr" && matches != "string") {
                listM.append(makeRadioButton(measureRadioButton, a, a));  
            }else{            
                listDim.append(makeRadioButton(dimensionRadioButton, a, a));
            } 
        }
    });

    //Dimension selected  
    $('input:radio[name=dimensionRadioButton]').click(function() {
        value = $(this).val();
        var abscissIndex = headerTable.findIndex(value);
        finalTab = generateData(tableToJSON);

        absciss = finalTab[abscissIndex];

    });

    //Measure selected  
    $('input:radio[name=measureRadioButton]').click(function() {
        value = $(this).val();
        var ordonateesIndex = headerTable.findIndex(value);

        finalTab = generateData(tableToJSON);

        finalTab[ordonateesIndex].forEach(function(a) {
            var parseOrdonates = parseFloat(a);
            ordonate.add(parseOrdonates);
        });
    });
}

/*
* Measures related to Dimension
* array tableToJSON : results of table named "extension"
*/
function generateData (tableToJSON){

    var keys =  Object.keys(tableToJSON[0]);
    ordonate = [];

    var finalTab = keys.map(function(key) {
        return tableToJSON.map(function(n) {
            return n[key];
        });
    });

    return finalTab;
}

/*
* Create RadioButton for Measure and Dimension
* string name  : RadioButton attr. 
* string value : RadioButton attr.
* string text  : Label contains text associated to the RadioButton
*/ 
function makeRadioButton(name, value, text) {

    var label = document.createElement("label");
    var radio = document.createElement("input");
    radio.type = "radio";
    radio.name = name;
    radio.value = value;

    label.appendChild(radio);

    label.appendChild(document.createTextNode(text));
    return label;
}

function addChart() {
    var aera = document.getElementById("charts");
    var chart = $('<li class="chart">').text("last chart added").appendTo(aera);
    $('li.chart').click(function() {
        $(this).remove();
    });
}

function deleteChart(){
	 $(this).remove();
}

google.load('visualization', '1', {
    packages : [ 'corechart' ]
});

// absciss = [ 'France', 'Allemagne', 'Espagne', 'Italie', 'Angleterre' ];
// ordonate = [ 65000000, 82000000, 45000000, 34000000, 6E6 ];
// graphe_title = [ 'Country', 'Population' ]

function in_array(string, array){
    var result = false;
    for(i=0; i<array.length; i++){
        if(array[i] == string){
            result = true;
        }
    }
    return result;
}

function aggreg_count() {
	graph_ordonate= [];
	graph_absciss = [];
	var increm =0;
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

function aggreg_somme() {
	graph_ordonate= [];
	graph_absciss = [];
	var increm =0;
	for (var i = 0; i < absciss.length; i++) {
		if (!in_array(absciss[i],graph_absciss)){
			graph_ordonate [increm] = ordonate[i];
			graph_absciss.add(absciss[i]);
	        for (var y=0; y < absciss.length; y++) {
	        	if (i!=y) {
	        		if (absciss[i]==absciss[y]){
	        			graph_ordonate [increm] = graph_ordonate[increm]+ordonate[y];
	        		}
	        	}
	        }
	        increm = increm+ 1;
		}
    }
}

function aggreg_moyenne() {
	graph_ordonate= [];
	graph_absciss = [];
	var increm = 0;
	for (var i = 0; i < absciss.length; i++) {
		if (!in_array(absciss[i],graph_absciss)){
			graph_ordonate [increm] = ordonate[i];
			graph_absciss.add(absciss[i]);
			var count = 1;
	        for (var y=0; y < absciss.length; y++) {
	        	if (i!=y) {
	        		if (absciss[i]==absciss[y]){
	        			graph_ordonate [increm] = graph_ordonate[increm]+ordonate[y];
	        			count++;
	        		}
	        	}
	        }
	        graph_ordonate [increm] = graph_ordonate [increm]/count;
	        increm = increm+1;
		}
    }
}

function aggreg_aucun() {
	graph_ordonate= ordonate;
	graph_absciss = absciss;
}

function submit(bout) {
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
    	aggreg_aucun();
        break;
    default:
    	alert('TEST =' + document.getElementById("aggregator").value);
    }
    // choix du type de graphique
    switch (bout) {
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
        alert('revoir les parametres');
    }
}

function drawPointChart() {
    var data_point = new google.visualization.DataTable();
    data_point.addColumn('string', 'X');
    data_point.addColumn('number', 'People');

    //here we insert the data from our two table
    for (var i = 0; i < graph_absciss.length; i++) {
        data_point.addRows([ [ graph_absciss[i], graph_ordonate[i] ] ])
    }
    // here the option of our representation
    var options_point = {
        title : 'ici un titre',
        width : 1000,
        height : 563,

    };

    var chart_point = new google.visualization.ScatterChart(document
            .getElementById('graphe'));
    chart_point.draw(data_point, options_point);
}

function drawMapChart() {
    var data_graph = new google.visualization.DataTable();
    data_graph.addColumn('string', 'X');
    data_graph.addColumn('number', 'People');

    //here we insert the data from our two table
    for (var i = 0; i < graph_absciss.length; i++) {
        data_graph.addRows([ [ graph_absciss[i], graph_ordonate[i] ] ])
    }
    // here the option of our representation
    var options_graph = {
        title : 'ici un titre',
        width : 1000,
        height : 563,

    };

    var chart_graph = new google.visualization.GeoChart(document
            .getElementById('graphe'));
    chart_graph.draw(data_graph, options_graph);

}

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

    var chart_pie = new google.visualization.PieChart(document
            .getElementById('graphe'));
    chart_pie.draw(data_pie, options);
  
}

function drawBarChart_vertical() {
    var data_bar = new google.visualization.DataTable();
    data_bar.addColumn('string', 'X');
    data_bar.addColumn('number', 'People');

    //here we insert the data from our two table
    for (var i = 0; i < graph_absciss.length; i++) {
        data_bar.addRows([ [ graph_absciss[i], graph_ordonate[i] ] ])
    }
    // here the option of our representation
    var options_bar = {
        title : 'ici un titre',
        width : 1000,
        height : 563,
        hAxis : {
            title : graphe_title[0]
        },
        vAxis : {
            title : graphe_title[1]
        }
    };
    // we choose the area where we want to put our charts
    var chart_column = new google.visualization.ColumnChart(document
            .getElementById('graphe'));
    chart_column.draw(data_bar, options_bar);
}

function drawBarChart_horizontal() {
    var data_bar = new google.visualization.DataTable();
    data_bar.addColumn('string', 'X');
    data_bar.addColumn('number', 'People');

    //here we insert the data from our two table
    for (var i = 0; i < graph_absciss.length; i++) {
        data_bar.addRows([ [ graph_absciss[i], graph_ordonate[i] ] ])
    }
    var options_bar = {
        title : 'ici un titre',
        width : 1000,
        height : 563,
        hAxis : {
            title : graphe_title[0]
        },
        vAxis : {
            title : graphe_title[1]
        }
    };

    var chart_bar = new google.visualization.BarChart(document
            .getElementById('graphe'));
    chart_bar.draw(data_bar, options_bar);
}

function drawLineChart() {
    var data_line = new google.visualization.DataTable();
    data_line.addColumn('string', 'X');
    data_line.addColumn('number', 'People');

    //here we insert the data from our two table
    for (var i = 0; i < graph_absciss.length; i++) {
        data_line.addRows([ [ graph_absciss[i], graph_ordonate[i] ] ])
    }
    // here the option of our representation
    var options_line = {
        width : 1000,
        height : 563,
        hAxis : {
            title : graphe_title[0]
        },
        vAxis : {
            title : graphe_title[1]
        }
    };
    // we choose the area where we want to put our charts
    var chart_line = new google.visualization.LineChart(document
            .getElementById('graphe'));
    chart_line.draw(data_line, options_line);
}