require('dotenv').config();
const express = require('express'); 
const app = express();  
const mysql = require('mysql');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const port = process.env.SERVER_PORT||3000;
 

app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
nunjucks.configure('views', {
    express:app,
    autoescape:true,
});
 

let connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'homepage',
});
 

connection.connect();
 

app.get('/', (req,res)=>{
    res.render('index.html')
})
 

app.get('/list',(req,res)=>{
    connection.query("select idx, subject, board_name, content, hit, date_format(today, '%Y-%m-%d') as today from board", (error, results)=>{
        if(error){
            console.log(error)
        }else{
            console.log(results)
            res.render('./list.html',{
                list:results,
            })
        }
    })
})
 

app.get('/write',(req,res)=>{
 

    res.render('board_write.html');

 

})
 

app.get('/view',(req,res)=>{

    idx = req.query.id
    console.log(idx)
 

    connection.query(`select * from board`, (error, results)=>{
        if(error){
            console.log(error)
        }else{
            res.render('board_view.html', {
              list1 : results,
              idx : idx,
            })
        }
    })
})
 

app.get('/modify',(req,res)=>{
 

    console.log(idx)
    connection.query("select * from board ", (error, results)=>{
        if(error){
            console.log(error)
        }else{
            res.render('board_modify.html', {
                list : results,
                idx : (req.query.id)-1,
            })
        }
    })
})
 


app.post('/list',(req,res)=>{
    console.log(req.body);
    res.redirect('/list');
    let idx = req.body.idx;
    connection.query(`delete from board where idx = ${idx}`,
    (error, results)=>{
        if(error){
            console.log(error)
        }else{
            console.log(results)
        }
    })
})
 
app.post('/write',(req,res)=>{
    console.log(req.body);
    res.redirect('/list');
 

    let board_subject = req.body.board_subject;
    let board_name = req.body.board_name;
    let board_content = req.body.board_content;
    
    connection.query(`insert into board (subject, board_name, content, hit) values ('${board_subject}', '${board_name}', '${board_content}', 0)`,
    (error, results)=>{
        if(error){
            console.log(error)
        }else{
            console.log(results)
        }
    })
})

 

app.post('/modify',(req,res)=>{
 
    res.redirect('/list');
 
    let mboard_subject = req.body.mboard_subject;
    let mboard_name = req.body.mboard_name;
    let mboard_content = req.body.mboard_content;
 

    connection.query(`update board set subject = '${mboard_subject}', board_name = '${mboard_name}', content = '${mboard_content}' where idx = '${idx}'`,
    (error, results)=>{
        if(error){
            console.log(error)
        }else{
            console.log(results)
        }
    })
})
 

app.listen(port,()=>{
    console.log(`server start port : ${port}`)
}) 