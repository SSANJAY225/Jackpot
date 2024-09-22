import mongoose from "mongoose";

const { Schema } = mongoose;

const StockSchema = new Schema({
    Item:{type:String,unique:true},
    Qty:Number,
    Dealer:String,
    Mrp:Number,
    Sp:Number,
    Date:String
})

const Stock = mongoose.models.Stock || mongoose.model('Stock', StockSchema);

export default Stock;