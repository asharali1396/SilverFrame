var express = require('express');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
//var logger = require('morgan');
var routes = require('./API/Config/Routes');
var statusCodeMap = require('./API/Config/StatusCodeMap');
var tokenization = require('./custom_modules/tokenization');
var app = express();
var logger = require('./custom_modules/logger');
//app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
var apiRoutes = Object.keys(routes);

app.post("/api/user/login", function (req, res, next) {
  try {
    logger.logInfo("/api/user/login");
    let message = {}
    var api = require('./API/BusinessLogic/logintoken');
    api.input(req, message);
    api.process(message).then(() => {
      let response = {
        responseBody: {},
      };
      api.output(response, message);
      res.status(statusCodeMap[response.status] ? statusCodeMap[response.status] : 500)
      res.send(response.responseBody);

    });
  }
  catch (ex) {
    logger.logInfo(ex);
    res.status(500);
    res.send({
      errorMessage: "Internal Server Error Occured."
    });
  }

});
app.post("/api/client/login", function (req, res, next) {
  try {
    logger.logInfo("/api/client/login");
    let message = {}
    var api = require('./API/BusinessLogic/loginclienttoken');
    api.input(req, message);
    api.process(message);
    let response = {
      responseBody: {},
    };
    api.output(response, message);
    res.status(statusCodeMap[response.status] ? statusCodeMap[response.status] : 500)
    res.send(response.responseBody);
  }
  catch (ex) {
    logger.logInfo(ex);
    res.status(500);
    res.send({
      errorMessage: "Internal Server Error Occured."
    });
  }
});

for (i = 0; i < apiRoutes.length; i++) {
  if (routes[apiRoutes[i]].allowedMethod.includes('GET')) {
    app.get(apiRoutes[i], function (req, res, next) {
      logger.logInfo(req.route.path);
      var token = req.get('Authorization')
      var userId = tokenization.verifyLoginToken(token);
      if (userId) {
        let message = {}
        message.API_USER_ID = userId != 'client' ? userId : undefined;
        var api = require('./API/BusinessLogic/' + routes[req.route.path].controller);
        api.input(req, message);
        api.process(message);
        let response = {
          responseBody: {},
        };
        api.output(response, message);
        res.status(statusCodeMap[response.status] ? statusCodeMap[response.status] : 500)
        res.send(response.responseBody);
      }
      else {
        res.status(401);

        res.send({
          errorMessage: "Invalid token provided."
        });
      }

    });
  }
  else if (routes[apiRoutes[i]].allowedMethod.includes('POST')) {
    app.post(apiRoutes[i], function (req, res, next) {
      try {
        logger.logInfo(req.route.path);
        var token = req.get('Authorization')
        var userId = tokenization.verifyLoginToken(token);
        if (userId) {
          let message = {}
          message.API_USER_ID = userId != 'client' ? userId : undefined;
          var api = require('./API/BusinessLogic/' + routes[req.route.Route.path].controller);
          api.input(req, message);
          api.process(message);
          let response = {
            responseBody: {},
          };
          api.output(response, message);
          res.status(statusCodeMap[response.status] ? statusCodeMap[response.status] : 500)
          res.send(response.responseBody);
        }
        else {
          res.status(401);
          res.send({
            errorMessage: "Invalid token provided."
          });
        }
      }
      catch (ex) {
        logger.logInfo(ex);
        res.status(500);
        res.send({
          errorMessage: "Internal Server Error Occured."
        });
      }


    });
  }
  else if (routes[apiRoutes[i]].allowedMethod.includes('PUT')) {

    app.put(apiRoutes[i], function (req, res, next) {
      try {
        logger.logInfo(req.route.path);
        var token = req.get('Authorization')
        var userId = tokenization.verifyLoginToken(token);
        if (userId) {
          let message = {}
          message.API_USER_ID = userId != 'client' ? userId : undefined;
          var api = require('./API/BusinessLogic/' + routes[req.route.Route.path].controller);
          api.input(req, message);
          api.process(message);
          let response = {
            responseBody: {},
          };
          api.output(response, message);
          res.status(statusCodeMap[response.status] ? statusCodeMap[response.status] : 500)
          res.send(response.responseBody);
        }
        else {
          res.status(401);
          res.send({
            errorMessage: "Invalid token provided."
          });
        }
      }
      catch (ex) {
        logger.logInfo(ex);
        res.status(500);
        res.send({
          errorMessage: "Internal Server Error Occured."
        });
      }
    });
  }
}

module.exports = app;
