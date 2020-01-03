const http = require('http');
const express = require('express');
const app = express();

app.get("/", (request, response) => {
  var ts = Date.now();
  var date_ob = new Date(ts);
  var date = date_ob.getDate();
  var month = date_ob.getMonth() + 1;
  var year = date_ob.getFullYear();
  var hours = date_ob.getHours() + 1;
  var minutes = date_ob.getMinutes();
  if(minutes < 10) minutes = `0` + minutes;
  var seconds = date_ob.getSeconds();
  if(seconds < 10) seconds = `0` + seconds;
  console.log(`${date}.${month}.${year} ${hours}:${minutes}:${seconds}Uhr Ping erhalten`);
  response.sendStatus(200);
});

app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
