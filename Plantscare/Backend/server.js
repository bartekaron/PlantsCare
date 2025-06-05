const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'plantscare_monogrammod'
});


// Endpoints

// Plants CRUD 
app.get('/api/plants', (req, res) => {
    pool.query('SELECT * FROM plants', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
})

app.get('/api/plants/:id', (req, res) => {
    const plantId = req.params.id;
    pool.query('SELECT * FROM plants WHERE id = ?', [plantId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Plant not found' });
        }
        res.json(results[0]);
    });
})

app.post('/api/plants', (req, res) => {
    const newPlant = req.body;
    pool.query('INSERT INTO plants SET ?', newPlant, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(201).json({ id: results.insertId, ...newPlant });
    });
});

app.patch('/api/plants/:id', (req, res) => {
    const plantId = req.params.id;
    const updatedPlant = req.body;
    pool.query('UPDATE plants SET ? WHERE id = ?', [updatedPlant, plantId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Plant not found' });
        }
        res.json({ id: plantId, ...updatedPlant });
    });
});

app.delete('/api/plants/:id', (req, res) => {
    const plantId = req.params.id;
    pool.query('DELETE FROM plants WHERE id = ?', [plantId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Plant not found' });
        }
        res.status(204).send();
    });
});


// Watering log

app.get('/api/plants/:id/waterings', (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM watering_logs WHERE plant_id = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
})

app.post('/api/waterings', (req, res) => {
    const newWatering = req.body;
    pool.query('INSERT INTO watering_logs SET ?', newWatering, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(201).json({ id: results.insertId, ...newWatering });
    });
});

app.delete('/api/waterings/:id', (req, res) => {
    const wateringId = req.params.id;
    pool.query('DELETE FROM watering_logs WHERE id = ?', [wateringId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Watering log not found' });
        }
        res.status(204).send();
    });
});

// Statistics
app.get('/api/plant/stats', (req, res) => {
    pool.query('SELECT * FROM statistics', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})