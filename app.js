// required npm packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const { v4: uuid } = require('uuid');

// required models
const Product = require('./models/product');

// mongoose connection
mongoose.connect('mongodb://localhost:27017/market', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

// middlewares
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(methodOverride('_method'));

// seeding
const products = [
    {
        id: uuid(),
        product: 'milk',
        price: 3.99,
    },

    {
        id: uuid(),
        product: 'eggs',
        price: 4.99,
    }
]

// routes
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/products', (req, res) => {
    res.render('index', { products })
})

app.get('/products/new', (req, res) => {
    res.render('new')
})

app.post('/products', (req, res) => {
    const { product, price } = req.body;
    products.push({ product, price, id: uuid() })
    res.redirect('products')
})

app.get('products/:id/edit', (req, res) => {
    res.render('edit')
})

app.patch('/products/:id', (req, res) => {
    const { id } = req.params;
    const newProduct = req.body.product;
    const foundProduct = product.find(p => p.id === id);
    foundProduct.product = newProduct;
    res.redirect('/products')
})

app.get('*', (req, res) => {
    res.send('Oops! I do not know this route!')
})

// port
app.listen(3000, () => {
    console.log('Listening on Port 3000!')
})