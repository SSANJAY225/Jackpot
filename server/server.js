import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Invoice from './Invoice.js'; 
import Stock from './Stock.js'
import User from './User.js';

import bcrypt from 'bcrypt';

const app = express();
const PORT = 5000;
const router = express.Router();
const saltRounds = 10

// MongoDB connection
mongoose.connect('mongodb+srv://jackpot:jackpot@cluster0.84kv7m8.mongodb.net/jackpot?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors()); // Allow CORS for frontend

// Middleware to check authentication (using cookies)
const checkAuth = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(403).send('Unauthorized access');
    }
    // Assume some token validation logic here
    next();
};

// login
app.post('/api/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(Password, user.Password); // Add await here as well
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        res.status(200).json({ status: "success", message: "Login successful" });
    } catch (e) {
        res.status(500).json({ error: e.message });
        console.log(e);
    }
});

app.post('/api/change-password', async (req, res) => {
    try {
        const { Email, Password, newPassword } = req.body;

        // Find the user by email
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify the current password
        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        // Validate new password (optional: add your custom validations here)
        if (newPassword.length < 8) {
            return res.status(400).json({ error: "New password must be at least 8 characters long" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password
        user.Password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/invoicestock',async (req,res)=>{
    try{
        const {Item,Qty}=req.body
        if (!Item || !Qty) {
            return res.status(400).json({ message: 'Item name and quantity are required.' });
        }

        const stockItem = await Stock.findOne({ Item });

        if (!stockItem) {
            return res.status(404).json({ message: 'Item not found in stock.' });
        }
        if (stockItem.Qty < Qty) {
            return res.status(400).json({ message: 'Insufficient stock quantity.' });
        }
        stockItem.Qty -= Qty;
        await stockItem.save();
        console.log(stockItem)
        res.status(200).json({ message: `Stock updated successfully. ${Qty} units of ${Item} deducted.` });

    }catch(error){
        console.error('Error fetching invoice stock:', error);
    }
})

// invoice 
    app.post('/api/invoice', async (req, res) => {
        try {
            const { PayeeName, date, Amount, payment,PhNo,Paymentmeth ,Discount,DiscountAmt,ListOfItem, ListOfQty, ListOfPrice, TotalAmount } = req.body;
            
            const invoiceNumber = `${Date.now()}`;

            const newInvoice = new Invoice({
                PayeeName,
                date,
                Amount,
                payment,
                invoiceNumber, 
                DiscountAmt,
                PhNo,
                Paymentmeth,
                Discount, // Use the generated invoice number
                ListOfItem,
                ListOfQty,
                ListOfPrice,
                TotalAmount
            });
    
            const savedInvoice = await newInvoice.save();
            res.status(201).json(savedInvoice);
        } catch (error) {
            console.error('Error saving invoice:', error);
            res.status(500).send('Server error');
        }
});

app.put('/api/invoice/:id', async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInvoice) return res.status(404).send('Invoice not found');
        res.json(updatedInvoice);
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).send('Server error');
    }
});

app.get('/api/invoices',async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).send('Server error');
    }
});

    // Stock Apisssss
app.get('/api/stocks',async(req,res)=>{
    try{
        const stock=await Stock.find()
        res.json(stock)
    }catch(error){
        console.error('Error fetching invoices:', error);
        res.status(500).send('Server error');
    }
})
app.post('/api/AddStock',async(req,res)=>{
    try{
        const {Item,Qty,Date,Dealer,Mrp,Sp} = req.body;
        const newStock=new Stock ({
            Item:Item,
            Qty:Qty,
            Date,
            Dealer,
            Mrp,
            Sp

        })
        const savedStock = await newStock.save();
        res.status(201).json(savedStock);
    }catch(error){
        console.error('Error saving invoice:', error);
        res.status(500).send('Server error');
    }
})

app.put('/api/stocks/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the stock ID from the request parameters
        const updatedStock = req.body; // Get the updated stock data from the request body

        // Find the stock by ID and update it
        const stock = await Stock.findByIdAndUpdate(id, updatedStock, { new: true });
        
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        res.status(200).json(stock); // Respond with the updated stock data
    } catch (error) {
        console.error("Error updating stock:", error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/server-time', (req, res) => {
    res.json({ time: new Date() });
    });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
