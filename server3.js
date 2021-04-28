const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'homepage'
})
connection.connect();


app.set('view engine', 'html');
nunjucks.configure('views2', {
    express: app,
})

app.get('/', (req, res) => {
    res.render('index.html');
})

app.get('/list', (req, res) => {
    connection.query(`select idx, subject, board_name,date_format(today,'%Y-%m-%d')as today from board`, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            res.render('list.html',{
                list:results
            });            
        }
        
    })
  
})
app.get('/write', (req, res) => {
    res.render('write.html');
})
app.get('/view', (req, res) => {
    res.render('view.html');
})
app.get('/modify', (req, res) => {
    res.render('modify.html');
})


app.listen(3000, () => {
    console.log('server start port:3000');
})

