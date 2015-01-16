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

    var abscisse = [ 'France', 'Allemagne', 'Espagne', 'Italie', 'Angleterre' ];
    var ordonne = [ 65000000, 82000000, 45000000, 34000000, 6E6 ];
    var graphe_title = [ 'Country', 'Population' ]

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