import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Invoice from './Invoice.js'; // Import the invoice schema with .js extension

const app = express();
const PORT = 5000;

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

    app.post('/api/invoice', async (req, res) => {
        try {
            const { PayeeName, date, Amount, payment,PhNo,Paymentmeth ,Discount,DiscountAmt,ListOfItem, ListOfQty, ListOfPrice, TotalAmount } = req.body;
            
            // Generate a unique invoice number (example: based on the current timestamp)
            const invoiceNumber = `${Date.now()}`;
            console.log(req.body)
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

app.post('/api/login', (req, res) => {
    const authToken = '123456789'; 
    res.cookie('authToken', authToken, { httpOnly: true, maxAge: 3600000 }); // 1 hour cookie
    res.json({ message: 'Logged in' });
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('authToken');
    res.json({ message: 'Logged out' });
});

app.get('/api/server-time', (req, res) => {
    res.json({ time: new Date() });
    });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
