 (function($) {
 	
    document.ontouchmove = function( e ) { e.preventDefault(); }

 	var dh = $(document).height(), dw = $(document).width();
 	$("#nw").resizable({
 		handles:"se",
 		resize: function( event, ui ) {

 			$("#handle").css({
 				top:ui.size.height + "px",
 				left:ui.size.width + "px"
 			});

 			$("#ne").height(ui.size.height);
 			$("#ne").width(dw - ui.size.width);

 			$("#sw").height(dh - ui.size.height);
 			$("#sw").width(ui.size.width);

 			$("#se").width(dw - ui.size.width - 1);
 			$("#se").height(dh - ui.size.height);

		   chart4.setSize(
		       $("#se").width()-20, 
		       $("#se").height()-20,
		       false
		    );


		    chart1.setSize(
		       $("#nw").width()-20, 
		       $("#nw").height()-20,
		       false
		    );

 		} 
 	});

 	$(window).on("orientationchange",function(){
 		$(".reset").removeAttr("style");
		chart1.setSize(
	       $("#nw").width()-20, 
	       $("#nw").height()-20,
	       false
	    );
        chart2.setSize(
           $("#ne").width()-20, 
           $("#ne").height()-20,
           false
        );
        chart3.setSize(
           $("#sw").width()-20, 
           $("#sw").height()-20,
           false
        );               
	    chart4.setSize(
	       $("#se").width()-20, 
	       $("#se").height()-20,
	       false
	    );

 	});


    chart1 = new Highcharts.Chart({
        chart: {
            renderTo: 'container1',

            type: 'area',
//            marginRight: 130,
//            marginBottom: 25,
            height:$("#nw").height()-20,
            width:$("#nw").width()-20
        },
        title: {
            text: 'Interest rate Exposure',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: Rabobank',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Euro'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                    this.x +': '+ this.y +'Â°C';
            }
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            },    
            series: {
                cursor: 'ns-resize',
                point: {
                    events: {
                        drop: function() {
                            $('#report').html(
                                this.category + ' was set to ' + Highcharts.numberFormat(this.y, 2)
                            );
                        }
                    }
                },
            stickyTracking: false
         }
        },
 //       legend: {
 //           layout: 'vertical',
 //           align: 'right',
 //           verticalAlign: 'top',
 //           x: -10,
 //           y: 100,
 //           borderWidth: 0
 //       },
        series: [{
            name: 'Loan1',
 //           data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
    	       draggableY: true,
        }, {
            name: 'Loan2',
 //           data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
    	       draggableY: true,
        }, {
            name: 'Loan3',
 //           data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0],
    	       draggableY: true,
        }, {
            name: 'Loan4',
 //           data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8],
    	       draggableY: true,
        }]
    });


    euriborIndex;

    chart2 = new Highcharts.Chart({
        chart: {
            renderTo: 'container2',
            events: {
                    
                redraw: function(event){

                    if( euriborIndex == undefined) {
                        euriborIndex = 0;
                    } else {
                        euriborChanged(euriborIndex);
                    }
                    
                    console.log("chart dragged");
                }
            },
            type: 'line',
            marginRight: 130,
            marginBottom: 75,
            height:$("#ne").height()-20,
            width:$("#ne").width()-20
        },
        title: {
            text: 'Expected EURIBOR Level',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: Rabobank',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Interest %'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                    this.x +': '+ this.y +'%';
            }
        },
        plotOptions: {
            series: {
                cursor: 'ne-resize',
                point: {
                    events: {
                        drop: function() {
                            $('#report').html(
                                this.category + ' was set to ' + Highcharts.numberFormat(this.y, 2)
                            );
                        }
                    }
                },
                events: { 
                    legendItemClick: function(event) { 
                        var seriesIndex = this.index;
                        var series = this.chart.series;
                        for (var i = 0; i < series.length; i++) {
                            if (series[i].index != seriesIndex) {
                                series[i].hide();
                            } else {
                                series[i].show();    
                            }
                        }
                        euriborChanged(seriesIndex);
                        return false;
                    }
                },                
                stickyTracking: false
            }
        },
       series: [{
            name: 'Positive',
 //           data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
               draggableY: true,
        }, {
            name: 'Neutral',
 //           data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
               draggableY: true,
        }, {
            name: 'Negative',
 //           data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8],
               draggableY: true,
        }]
    });


    chart3 = new Highcharts.Chart({
        chart: {
            renderTo: 'container3',
            type: 'area',
   //         marginRight: 130,
   //         marginBottom: 25,
            height:$("#sw").height()-20,
            width:$("#sw").width()-20
        },
        title: {
            text: 'Interest payments',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: Rabobank',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Euro'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                    this.x +': '+ this.y +'Â°C';
            }
        },
        plotOptions: {
            series: {
                cursor: 'ns-resize',
                point: {
                    events: {
                        drop: function() {
                            $('#report').html(
                                this.category + ' was set to ' + Highcharts.numberFormat(this.y, 2)
                            );
                        }
                    }
                },
                stickyTracking: false
            }
        },

        series: [{
            name: 'Payment1',
 //           data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
           draggableY: true,
        }, {
            name: 'Payment2',
 //           data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
           draggableY: true,
        }, {
            name: 'Payment3',
 //           data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0],
           draggableY: true,
        }, {
            name: 'Payment4',
 //           data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8],
           draggableY: true,
        }]
    });


    chart4 = new Highcharts.Chart({
        chart: {
            renderTo: 'container4',
            type: 'area',
           	height:$("#se").height()-20,
            width:$("#se").width()-20
        },
        title: {
            text: 'Cummulative Interest Payments'
        },
        subtitle: {
            text: 'Source: Rabobank'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Billions'
            },
            labels: {
                formatter: function() {
                    return this.value / 1000;
                }
            }
        },
        tooltip: {
            formatter: function() {
                return ''+
                    this.x +': '+ Highcharts.numberFormat(this.y, 0, ',') +' millions';
            }
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series: [{
            name: 'Cumm interest1'
//            data: [502, 635, 809, 947, 1402, 3634, 5268, 3323, 2322, 1212, 1232, 2222] 
        }, {
            name: 'Cumm interest2'
//           data: [106, 107, 111, 133, 221, 767, 1766, 1212, 2111, 1234, 998, 988]
        }, {
            name: 'Cumm interest3'
//            data: [163, 203, 276, 408, 547, 729, 628, 656, 767, 556, 555, 767]
        }, {
            name: 'Cumm ionterest4'
//            data: [18, 31, 54, 156, 339, 818, 1201, 1102, 1099, 888, 898, 333]
        }]
    });


})(jQuery);