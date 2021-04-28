const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const mysql = require('mysql');
const bodyParser= require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.set('view engine', 'html');
nunjucks.configure('views3', {
    express: app,
})

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'homepage'
})
connection.connect();

app.get('/', (req, res) => {
    res.render('index.html')
})

app.get('/list', (req, res) => {
    connection.query(`select idx, subject, date_format(today, '%y-%m-%d') as today, hit from board`, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.render('list.html', {
                list: results
            })
        }

    })
})

app.post('list',(req,res)=>{
    res.redirect('list');
    let idx = req.body.idx;
    connection.query(`delete from board where idx = '${idx}'`, 
    (error, results)=>{
        if(error){
            console.log(error);
        }else{
            console.log(results);
        }
    })
})

app.get('/view', (req, res) => {

    idx =req.query.id
    
    connection.query("select * from board", (error, results)=>{
        if(error){
            console.log(error)
        }else{
            res.render('view.html',{
                list1:results,
                idx1:idx
            })
        }
    })
})

app.get('/write', (req, res) => {
    res.render('write.html')
})

app.post('/write', (req,res)=>{
    console.log(req.body);
    res.redirect('/list');

    let subject = req.body.board_subject;
    let name = req.body.board_name;
    let content = req.body.board_content;

    connection.query(`insert into board(subject, board_name, content, hit) 
            values('${subject}', '${name}', '${content}',0)`, (error, results)=>{
        if(error){
            console.log(error);
        }else{
            console.log(results)
        }        
    })
})

app.get('/modify', (req, res) => {
    connection.query("select * from board",(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('modify.html',{
                list2:results,
                idx2: (req.query.id)-1
            })
        }
    })
})

app.post('/modify', (req,res)=>{
    res.redirect('/list');
    let idx2 = req.body.idx2;
    let msubject = req.body.board_subject;
    let mname = req.body.board_name;
    let mcontent = req.body.board_content;

    connection.query(`update board set subject = '${msubject}', board_name='${mname}',
    content='${mcontent}', where idx ='${idx2}'`,(error,results)=>{
        if(error){
            console.log(error);
        }else{
            console.log(results);
        }
    })
})


app.listen(3000, () => {
    console.log('server start port:3000');
})