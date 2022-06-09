var express = require("express")
var app = express()
const PORT = 3000;
var formidable = require('formidable');

app.post("/upload", function (req, res) {
    let form = formidable({});
    form.keepExtensions = true
    form.uploadDir = __dirname + '/photos/'       // folder do zapisu zdjęcia
    form.multiples = true
    form.parse(req, function (err, fields, files) {

        console.log("----- przesłane pola z formularza ------");

        console.log(fields);

        console.log("----- przesłane formularzem pliki ------");

        console.log(files);

        res.send("file sent")
        //res.send("plik przesłany!")

    });


})



app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})