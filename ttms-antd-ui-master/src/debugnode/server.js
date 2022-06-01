const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const multiparty = require("multiparty");
const formidable = require("formidable");

let server = express();

server.use('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header("Access-Control-Expose-Headers", "token");
    res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    next();
})

server.post("/img", function (req, res) {
    /* 生成multiparty对象，并配置上传目标路径 */
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log(files);
        console.log(fields);
        res.send({
            status: 0,
            msg: "OK",
        });
        res.end();
    })
    
  })
 

server.listen(80);