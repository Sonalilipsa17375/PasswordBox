const express = require("express")
const app = express()
const mysql = require("mysql");
const cors = require('cors');
const PORT = 3001;

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
    allowedHeaders: ['Content-Type'],
};

const {encrypt,decrypt} = require("./EncrHandle")

app.use(cors(corsOptions));

app.use(express.json());

const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'password',
    database:'passwordmanager'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.post('/addpassword',(req,res)=>{
    const {password,title} = req.body;
    const hashpwd = encrypt(password);

    db.query("INSERT INTO passwords (password,title,iv) VALUES (?,?,?)",[hashpwd.password,title,hashpwd.iv],(err,result)=>{
        if(err)console.log(err);
        else{
            res.send("Success");
        }
    })
});

app.get('/showpasswords',(req,res)=>{
    db.query('SELECT * FROM passwords ;',(err,result)=>{
        if(err)console.log(err);
        else{
             res.send(result);
        }
    });
});

app.post('/decryptpwd',(req,res)=>{
    res.send(decrypt(req.body))
})

app.listen(PORT,()=>{
    console.log("Server started !")
})