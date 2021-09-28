// required npm packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync')
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
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy', 'bakery', 'cannery', 'meat']


// routes
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/products', catchAsync(async (req, res) => {
        const { category } = req.query;
        if (category) {
            const products = await Product.find({ category });
            res.render('products/index', { products, category })
        } else {
            const products = await Product.find({});
            res.render('index', { products, category: 'All' })
        }
    }))

app.get('/products/new', (req, res) => {
    res.render('new', { categories })
})

app.post('/products', catchAsync(async (req, res) => {
    if(!req.body.product) throw new ExpressError('Invalid Campground Data', 400)
    const newProduct = await new Product(req.body);
    await newProduct.save();
    console.log(newProduct)
    res.redirect('products')
}))

app.get('/products/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    console.log(product);
    res.render('show', { product })
}))

app.get('products/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('edit', { product, categories })
}))

app.put('/products/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    res.redirect(`/products/${product._id}`)
}))

app.delete('/products/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
}))



// app.get('*', (req, res) => {
//     res.send('Oops! I do not know this route!')
// })

app.all('*',(req, res, next) => {
next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    if (!err.message) err.message = "oh no something went wrong"
    res.status(statusCode).render('error', {err});
})

// port
app.listen(3000, () => {
    console.log('Listening on Port 3000!')
})