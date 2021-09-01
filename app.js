const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

// routes
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/show', (req, res) => {
    res.render('show')
})

app.get('*', (req, res) => {
    res.send('Oops! I do not know this route!')
})

// port
app.listen(3000, () => {
    console.log('Listening on Port 3000!')
})