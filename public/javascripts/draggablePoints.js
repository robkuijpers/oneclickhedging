//     /**
// * Experimental Draggable points plugin
// * Revised 2012-02-08
// *
// * On Saving this jsbin, remember to update http://jsfiddle.net/highcharts/AyUbx/
// */
// var hasTouch = 'ontouchstart' in window,
//     START = 'mousedown',
//     MOVE = 'mousemove',
//     END = 'mouseup';

// if (hasTouch) {
//     START = 'touchstart';
//     MOVE = 'touchmove';
//     END = 'touchend';
// }

// function normalizeEvent(e) {
//     var props = ['clientX', 'clientY', 'pageX', 'pageY'],
//         i, l, n;
    
//     if (['touchstart', 'touchmove', 'touchend'].indexOf(e.type) > -1) {
//         for (i = 0, l = props.length; i < l; i++) {
//             n = props[i];
//             e[n] = e.originalEvent.targetTouches[0][n];
//         }
//     }
    
//     return e;
// }



// (function(Highcharts) {
//     var addEvent = Highcharts.addEvent,
//         each = Highcharts.each;
    
//     /**
//      * Filter by dragMin and dragMax
//      */
//     function filterRange(newY, series) {
//         var options = series.options,
//             dragMin = options.dragMin,
//             dragMax = options.dragMax;
        
//         if (newY < dragMin) {
//             newY = dragMin;
//         } else if (newY > dragMax) {
//             newY = dragMax;
//         }
//         return newY;
//     }
    

//     Highcharts.Chart.prototype.callbacks.push(function (chart) {        
        
//         var container = chart.container,
//             dragPoint,
//             dragY,
//             dragPlotY,
//             dragPoint1,
//             dragPlotY1;
        
//         // my code:
//         var dragPointSeries;
//         var dragSeries;
        
//         chart.redraw(); // kill animation (why was this again?)
        
//         addEvent(container, START, function(e) {
//             e = normalizeEvent(e);
//             var hoverPoint = chart.hoverPoint;
//             if (hoverPoint && hoverPoint.series.options.draggable) {
//                 dragSeries = false;
//                 dragPoint = hoverPoint;
//                 dragY = e.pageY;
//                 dragPlotY = dragPoint.plotY + (chart.plotHeight - (dragPoint.yBottom || chart.plotHeight));
//             }
//         });    
                
//         addEvent(container, MOVE, function(e) {
//             e = normalizeEvent(e);
//             if (dragPoint) {
//                 if (dragSeries) {
//                     var deltaY = dragY - e.pageY,
//                         newPlotY = chart.plotHeight - dragPlotY + deltaY,
//                         newY = dragPoint.series.yAxis.translate(newPlotY, true),
//                         series = dragPoint.series;
                    
//                     // my code:
//                     for (var i = 0; i < dragPoint.series.points.length; i++) {
//                         var deltaYtmp = dragY - e.pageY,
//                             newPlotYtemp = chart.plotHeight - dragPointSeries[1][i] + deltaYtmp,
//                             newYtmp = dragPointSeries[0][i].series.yAxis.translate(newPlotYtemp, true);
                            
//                             newYtmp = filterRange(newYtmp, series);
//                             dragPointSeries[0][i].update(newYtmp, false);
//                             chart.tooltip.refresh(dragPointSeries[0][i]);
//                     }                        
//                     // end of my code                                            
                    
//                     if (series.stackKey) {
//                         chart.redraw();
//                     } else {
//                         series.redraw();
//                     }    
//                 }else{
//                     var deltaY = dragY - e.pageY,
//                         newPlotY = chart.plotHeight - dragPlotY + deltaY,
//                         newY = dragPoint.series.yAxis.translate(newPlotY, true),
//                         series = dragPoint.series;
//                     newY = filterRange(newY, series);                
//                     dragPoint.update(newY, false);                
//                     chart.tooltip.refresh(dragPoint);
                    
//                     if (series.stackKey) {
//                         chart.redraw();
//                     } else {
//                         series.redraw();
//                     }        
//                 }
//             }
//         });
        
//         function drop(e) {
//             e = normalizeEvent(e);
//             if (dragPoint) {
//                 var deltaY = dragY - e.pageY,
//                     newPlotY = chart.plotHeight - dragPlotY + deltaY,
//                     series = dragPoint.series,
//                     newY = series.yAxis.translate(newPlotY, true);                            
                    
//                     // my code:
//                     //moveConsecutiveDots(dragPlotY, deltaY);    
//                     // end of my code                
                    
//                 newY = filterRange(newY, series);
//                 dragPoint.firePointEvent('drop');
//                 dragPoint.update(newY);                
//                 dragPoint = dragY = undefined;
//             }
//         }
//         function moveConsecutiveDots(dragPlotY, deltaY) {
//             for (var i = dragPoint.x + 1; i < dragPoint.series.points.length; i++) {                
//                 var    point = dragPoint.series.points[i];            
//                 var newPlotY = chart.plotHeight - dragPointSeries.points[i].plotY + deltaY ;
//                 var newY = point.series.yAxis.translate(newPlotY, true);
//                 newY = filterRange(newY, dragPoint.series);                
//                 point.update(newY, false);                                
//             }
//         }
//         addEvent(document, END, drop);
//         addEvent(container, 'mouseleave', drop);
//     });
    
//     /**
//      * Extend the column chart tracker by visualizing the tracker object for small points
//      */
//     var colProto = Highcharts.seriesTypes.column.prototype,
//         baseDrawTracker = colProto.drawTracker;
    
//     colProto.drawTracker = function() {
//         var series = this;
//         baseDrawTracker.apply(series);
        
//         each(series.points, function(point) {
//             point.tracker.attr(point.shapeArgs.height < 3 ? {
//                 'stroke': 'black',
//                 'stroke-width': 2,
//                 'dashstyle': 'shortdot'
//             } : {
//                 'stroke-width': 0
//             });
//         });
//     };
    
// })(Highcharts);



/**
 * Experimental Draggablepoints plugin
 * Revised 2012-11-22
 */
(function(Highcharts) {
    var addEvent = Highcharts.addEvent,
        each = Highcharts.each;
    
    /**
     * Filter by dragMin and dragMax
     */
    function filterRange(newY, series) {
        var options = series.options,
            dragMin = options.dragMinY,
            dragMax = options.dragMaxY;
        
        if (newY < dragMin) {
            newY = dragMin;
        } else if (newY > dragMax) {
            newY = dragMax;
        }
        return newY;
    }
    
    Highcharts.Chart.prototype.callbacks.push(function (chart) {        
        
        var container = chart.container,
            dragPoint,
            dragX,
            dragY,
            dragPlotX,
            dragPlotY;
        
        chart.redraw(); // kill animation (why was this again?)
        
        addEvent(container, 'mousedown', function(e) {
            var hoverPoint = chart.hoverPoint,
                options;
            
            if (hoverPoint) {
                options = hoverPoint.series.options;
                if (options.draggableX) {
                    dragPoint = hoverPoint;
                    
                    dragX = e.pageX;
                    dragPlotX = dragPoint.plotX;
                }
                
                if (options.draggableY) {
                    dragPoint = hoverPoint;
                    
                    dragY = e.pageY;
                    dragPlotY = dragPoint.plotY + (chart.plotHeight - (dragPoint.yBottom || chart.plotHeight));
                }
                
                // Disable zooming when dragging
                if (dragPoint) {
                    chart.mouseIsDown = false;
                }
            }
        });

        addEvent(document, 'touchstart', function(e) {
            var e = chart.tracker.normalizeMouseEvent(e);
            var hoverPoint = chart.hoverPoint,
                options;
            
            if (hoverPoint) {
                options = hoverPoint.series.options;
                if (options.draggableX) {
                    dragPoint = hoverPoint;

                    dragX = e.chartX;

                    dragPlotX = dragPoint.plotX;
                }             
                if (options.draggableY) {
                    dragPoint = hoverPoint;
                    dragY = e.chartY;
                    //dragY = e.touches[0].pageY;
                    dragPlotY = dragPoint.plotY + (chart.plotHeight - (dragPoint.yBottom || chart.plotHeight));
                }
                
                // Disable zooming when dragging
                if (dragPoint) {
                    chart.mouseIsDown = false;
                }
            }
        });
        
        addEvent(container, 'mousemove', function(e) {
            if (dragPoint) {
                var deltaY = dragY - e.pageY,
                    deltaX = dragX - e.pageX,
                    newPlotX = dragPlotX - deltaX - dragPoint.series.xAxis.minPixelPadding,
                    newPlotY = chart.plotHeight - dragPlotY + deltaY,
                    newX = dragX === undefined ? 
                        dragPoint.x :                        
                        dragPoint.series.xAxis.translate(newPlotX, true),
                    newY = dragY === undefined ?
                        dragPoint.y :                        
                        dragPoint.series.yAxis.translate(newPlotY, true),
                    series = dragPoint.series;
                
                newY = filterRange(newY, series);

                dragPoint.update([newX, newY], false);
                chart.tooltip.refresh(dragPoint);
                if (series.stackKey) {
                    chart.redraw();
                } else {
                    series.redraw();
                }
            }
        });

        addEvent(container, 'touchmove', function(e) {
            var e = chart.tracker.normalizeMouseEvent(e);
            if (dragPoint) {

                var deltaY = dragY - e.chartY,
                    deltaX = dragX - e.chartX;
                console.log(deltaX)
                var newPlotX = dragPlotX - deltaX - dragPoint.series.xAxis.minPixelPadding,
                    newPlotY = chart.plotHeight - dragPlotY + deltaY,
                    newX = dragX === undefined ? 
                        dragPoint.x :                        
                        dragPoint.series.xAxis.translate(newPlotX, true),
                    newY = dragY === undefined ?
                        dragPoint.y :                        
                        dragPoint.series.yAxis.translate(newPlotY, true),
                    series = dragPoint.series;
                newY = filterRange(newY, series);
                dragPoint.update([newX, newY], false);
                chart.tooltip.refresh(dragPoint);
                if (series.stackKey) {
                    chart.redraw();
                } else {
                    series.redraw();
                }
            }
        });
        
        function drop(e) {
            if (dragPoint) {
                var deltaX = dragX - e.pageX,
                    deltaY = dragY - e.pageY,
                    newPlotX = dragPlotX - deltaX - dragPoint.series.xAxis.minPixelPadding,
                    newPlotY = chart.plotHeight - dragPlotY + deltaY,
                    series = dragPoint.series,
                    newX = dragX === undefined ? 
                        dragPoint.x :                        
                        dragPoint.series.xAxis.translate(newPlotX, true),
                    newY = dragY === undefined ?
                        dragPoint.y :                        
                        dragPoint.series.yAxis.translate(newPlotY, true);           
                
                newY = filterRange(newY, series);
                dragPoint.firePointEvent('drop');
                dragPoint.update([newX, newY]);
                
                dragPoint = dragX = dragY = undefined;
            }
        }

        function dropTouch(e) {
            var e = chart.tracker.normalizeMouseEvent(e);
            if (dragPoint) {
                var deltaX = dragX - e.chartX,
                    deltaY = dragY - e.chartY,
                    newPlotX = dragPlotX - deltaX - dragPoint.series.xAxis.minPixelPadding,
                    newPlotY = chart.plotHeight - dragPlotY + deltaY,
                    series = dragPoint.series,
                    newX = dragX === undefined ? 
                        dragPoint.x :                        
                        dragPoint.series.xAxis.translate(newPlotX, true),
                    newY = dragY === undefined ?
                        dragPoint.y :                        
                        dragPoint.series.yAxis.translate(newPlotY, true);           
                
                newY = filterRange(newY, series);
                dragPoint.firePointEvent('drop');
                dragPoint.update([newX, newY]);
                
                dragPoint = dragX = dragY = undefined;
            }
        }

        addEvent(document, 'mouseup', drop);
        addEvent(document, 'touchend', dropTouch);
        addEvent(container, 'mouseleave', drop);
    });
    
    /**
     * Extend the column chart tracker by visualizing the tracker object for small points
     */
    var colProto = Highcharts.seriesTypes.column.prototype,
        baseDrawTracker = colProto.drawTracker;
    
    colProto.drawTracker = function() {
        var series = this;
        baseDrawTracker.apply(series);
        
        each(series.points, function(point) {
            point.tracker.attr(point.shapeArgs.height < 3 ? {
                'stroke': 'black',
                'stroke-width': 2,
                'dashstyle': 'shortdot'
            } : {
                'stroke-width': 0
            });
        });
    };
    
})(Highcharts);
