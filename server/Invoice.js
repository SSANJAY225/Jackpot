import mongoose from 'mongoose';

const { Schema } = mongoose;

const invoiceSchema = new Schema({
    PayeeName: String,
    date: String,
    payment: Boolean,
    invoiceNumber: {type:String,required:true,unique:true},
    Discount:{type:Number,required:true},
    DiscountAmt:{type:Number,required:true},
    Paymentmeth:{type:String,required:true},
    PhNo:{type:String,required:true},
    ListOfItem: [String],
    ListOfQty: [Number],
    ListOfPrice: [Number],
    TotalAmount: Number
});

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

export default Invoice;
