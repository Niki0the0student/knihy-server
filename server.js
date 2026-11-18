const express = require('express');
const mysql = require('mysql2');

const app = express ();

app.use(express.static('public'));
app.use(express.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'knihy_db'
});

    db.connect(err =>{
        if(err) throw err;
        console.log('DB pripojena');
    
    });

app.get('/', (req, res)=>{
    res.redirect('/knihy.html');
});

app.get('/api/knihy', (req,res)=>{
    db.query('SELECT * FROM knihy', (error,vysledok)=>{
        if(error) return res.status(500).send('Chyba Sql');
        res.json(vysledok);
    });
});

app.post('/api/knihy', (req, res)=>{
    const { autor, nazov, cena, rok } = req.body;
    if (!autor || !nazov || !cena || !rok)
        return res.status(400).send('Neplatne udaje');
    const sql = 'INSERT INTO knihy (autor, nazov, cena, rok) VALUES (?, ?, ?, ?)';
    db.query(sql, [autor, nazov, cena, rok], (error)=>{
        if(error) return res.status(500).send('Chyba Sql');
        res.send('Kniha pridana');
    });
});

app.delete('/api/knihy/:id', (req, res)=>{
    db.query('DELETE FROM knihy WHERE id = ?', [req.params.id], (error, vysledok)=>{
        if(error) return res.status(500).send('Chyba Sql');
        if(!vysledok.affectedRows) return res.sendStatus(404);
        res.send('Kniha zmazana');
    });
});

app.put('/api/knihy/:id', (req, res)=>{
    const { pole, hodnota } = req.body;
    const povolene = ['autor', 'nazov', 'cena', 'rok'];
    if(!povolene.includes(pole) || !hodnota)
        return res.status(400).send('Neplatne udaje');
    const sql = `UPDATE knihy SET ${pole} = ? WHERE id = ?`;
    db.query(sql, [hodnota, req.params.id], (error, vysledok)=>{
        if(error) return res.status(500).send('Chyba SQL');
        if(!vysledok.affectedRows) return res.sendStatus(404);
        res.send('Kniha upravena');
    });
});

app.listen(3000, ()=>{
    console.log('Server beží na http://localhost:3000');
});