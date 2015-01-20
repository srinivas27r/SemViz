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

var abscisse = [];
var ordonne = [];
var graphe_title = [];


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


//position();
 console.log('table has appeared.');
 $("#control-charts").show();

  
var tableToJSON = $('table#extension').tableToJSON({
        ignoreColumns: [0]
  });

//Get columns name
var keysTable = tableToJSON.first();
var headerTable = Object.extended(keysTable).keys()


tableToJSON.forEach(function(a) {

    var keys =  Object.keys(tableToJSON[0]);
    ordonne = [];
    var finalTab = keys.map(function(key) {
        return tableToJSON.map(function(n) {
            return n[key];
        });
    });
    abscisse = finalTab[0];

    finalTab[1].forEach(function(a) {
        var b = parseFloat(a);
        ordonne.add(b);
    });
});



//console.log(ordonne);

//JSON.stringify(table)
 

 // var myTableArray = [];

  // $("table#extension tr").each(function(){
  //       var arrayOfThisRow = [];
  //       var tableData = $(this).find('td');
  //       var tableDataHeader = $(this).find('th');

  //       if (tableDataHeader.length > 0) {
  //         tableDataHeader.each(function() { arrayOfThisRow.push($(this).text()); });
  //         myTableArray.push(arrayOfThisRow);
  //       }
  //       if (tableData.length > 0) {
  //         tableData.each(function() { arrayOfThisRow.push($(this).text()); });
  //         myTableArray.push(arrayOfThisRow);
  //       }
  // });
}
function position(){

    //var $content = $(".content").hide();
    // var $content = $(".content");

    // $(".toggle").on("click", function(e) {
    //     $(this).toggleClass("expanded");
    //     $content.slideToggle();
    //     if (document.getElementById('titreG').innerHTML == 'Ajouter un graphique') 
    //     {
    //         document.getElementById('titreG').innerHTML = 'Annuler';
    //     } else if (document.getElementById('titreG').innerHTML == 'Annuler') 
    //     {
    //         document.getElementById('titreG').innerHTML = 'Ajouter un graphique';
    //     }
    //  });

};

function addChart() {
    var aera = document.getElementById("charts");
    var chart = $('<li>').text("last chart added").appendTo(aera);
    $('li').click(function() {
        $(this).remove();
    });
}

google.load('visualization', '1', {
    packages : [ 'corechart' ]
});

// abscisse = [ 'France', 'Allemagne', 'Espagne', 'Italie', 'Angleterre' ];
// ordonne = [ 65000000, 82000000, 45000000, 34000000, 6E6 ];
// graphe_title = [ 'Country', 'Population' ]

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
    for (var i = 0; i < abscisse.length; i++) {
        data_point.addRows([ [ abscisse[i], ordonne[i] ] ])
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
    for (var i = 0; i < abscisse.length; i++) {
        data_graph.addRows([ [ abscisse[i], ordonne[i] ] ])
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
    for (var i = 0; i < abscisse.length; i++) {
        data_pie.addRows([ [ abscisse[i], ordonne[i] ] ])
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
    for (var i = 0; i < abscisse.length; i++) {
        data_bar.addRows([ [ abscisse[i], ordonne[i] ] ])
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
    for (var i = 0; i < abscisse.length; i++) {
        data_bar.addRows([ [ abscisse[i], ordonne[i] ] ])
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
    for (var i = 0; i < abscisse.length; i++) {
        data_line.addRows([ [ abscisse[i], ordonne[i] ] ])
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