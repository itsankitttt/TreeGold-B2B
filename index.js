const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://itsankitsinghh:DA4aJlVemtvVpFwa@cluster0.xk8pd4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema and model for orders
const orderSchema = new mongoose.Schema({
    name: String,
    phoneNo: String,
    email: String,
    address: String,
    businessDescription: String,
    products: [String],
});

const Order = mongoose.model('Order', orderSchema);

// Serve static files from the public directory
const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));

// Render the form page
app.get('/order', (req, res) => {
    res.render('form');
});

// Handle form submission
app.post('/submit-order', async (req, res) => {
    try {
        const orderData = req.body;
        const order = new Order(orderData);
        await order.save();
        res.redirect('/orders'); // Redirect to the orders page
    } catch (error) {
        res.status(500).json({ message: 'Error submitting order', error });
    }
});

// Render the orders page with all submitted orders
// Render the orders page with all submitted orders
// Render the orders page with all submitted orders
app.get('/orders', (req, res) => {
    const filePath = path.join(__dirname,"public", 'orders.html');
    res.sendFile(filePath);
});


// New endpoint to serve orders data as JSON
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find(); // Fetch all orders from the database
        res.json(orders); // Respond with the list of orders as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});

// Start the server
app.listen(8000, () => {
    console.log("Server started on port 8000");
});
