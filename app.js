
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var io = require('socket.io');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app)
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = io.listen(server);
io.set('log level', 1);

  var euriborJSON = { 'series': [{'name': 'Positive', 
                               'values' : [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4] },
                              {'name': 'Neutral', 
                               'values' : [19.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4] }, 
                              {'name': 'Negative', 
                               'values' : [12.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4] }]
                  };

  var loansJSON = { 'series': [{'name': 'Loan1', 
                               'values' : [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4] } ]
                  };

  var cashflowsJSON = { 'series': [{'name': 'CashFlow1', 
                        'values' : [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4] } ] 
                  };
  
  var cummcashflowsJSON = { 'series': [{'name': 'CashFlow1', 
                            'values' : [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4] } ] 
                  };

io.sockets.on('connection', function (socket) {

  console.log('connected, sending loans and euribor to clients');

  socket.emit('loans', JSON.stringify(loansJSON));
  socket.emit('euribor', JSON.stringify(euriborJSON));
  // socket.emit('cashflows', JSON.stringify(cashflowsJSON));
  // socket.emit('cummcashflows', JSON.stringify(cummcashflowsJSON));

  socket.on('euriborChanged', function (data) {
    console.log('euriborChanged event received from client, data:' + JSON.stringify(data));
    recalculate(socket, data);
  });

});

function recalculate(p_socket, data) {
     console.log("Recalculate interest payments based on changed euribor and send back to the browser");

     // Recalculate.
     
     p_socket.emit('cashflows', JSON.stringify(cashflowsJSON));
     p_socket.emit('cummcashflows', JSON.stringify(cummcashflowsJSON));
 
}
