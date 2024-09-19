import { useState, useEffect } from "react";
import Axios from 'axios';
import './AddData.css';

const AddData = ({ close, addInvoiceData, editData }) => {
    const [PayeeName, setPayeeName] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [Amount, setAmount] = useState(0);
    const [Payment, setPayment] = useState("online"); // Default to online payment
    const [AmountReceived, setAmountReceived] = useState(0); // For cash payment
    const [InvoiceNumber, setInvoiceNumber] = useState("");
    const [ListOfItem, setListOfItem] = useState([""]);
    const [ListOfQty, setListOfQty] = useState([1]);
    const [ListOfPrice, setListOfPrice] = useState([""]);
    const [TotalAmount, setTotalAmount] = useState(0);
    const [Discount, setDiscount] = useState(0);
    const [DiscountAmt, setDiscountAmt] = useState(0);
    const [Paymentmeth,setPaymentmeth]=useState();
    const [PhNo,setPhNo]=useState();
    useEffect(() => {
        if (editData) {
            setPayeeName(editData.PayeeName);
            setInvoiceDate(editData.date);
            setPayment(editData.payment);
            setAmountReceived(editData.AmountReceived || 0); // Handle cash amount
            setInvoiceNumber(editData.invoiceNumber);
            setListOfItem(editData.ListOfItem || [""]);
            setListOfQty(editData.ListOfQty || [1]);
            setListOfPrice(editData.ListOfPrice || [""]);
            setDiscount(editData.Discount || 0);
            setPaymentmeth(editData.Paymentmeth)
            setTotalAmount(editData.TotalAmount || 0);
            setDiscountAmt(editData.DiscountAmt || 0);
            setPhNo(editData.PhNo)
        } else {
            setPayeeName("");
            setInvoiceDate(new Date().toISOString().split('T')[0]);
            setPayment();
            setAmountReceived(0);
            setInvoiceNumber("");
            setListOfItem([""]);
            setListOfQty([1]);
            setListOfPrice([""]);
            setDiscount(0);
            setTotalAmount(0);
            setDiscountAmt(0);
            setPaymentmeth();
            setPhNo("");
        }
    }, [editData]);

    useEffect(() => {
        const calculatedTotal = ListOfQty.reduce(
            (total, qty, index) => total + (parseInt(qty, 10) * parseFloat(ListOfPrice[index] || 0)),
            0
        );
        const discountedTotal = calculatedTotal - (calculatedTotal * Discount / 100);
        setTotalAmount(calculatedTotal);
        setDiscountAmt(discountedTotal);
    }, [ListOfQty, ListOfPrice, Discount]);

    const handleAddItem = () => {
        setListOfItem([...ListOfItem, ""]);
        setListOfQty([...ListOfQty, 1]);
        setListOfPrice([...ListOfPrice, ""]);
    };

    const handleChange = (index, field, value) => {
        if (field === "item") {
            const newItems = [...ListOfItem];
            newItems[index] = value;
            setListOfItem(newItems);
        } else if (field === "qty") {
            const newQty = [...ListOfQty];
            newQty[index] = value;
            setListOfQty(newQty);
        } else if (field === "price") {
            const newPrices = [...ListOfPrice];
            newPrices[index] = value;
            setListOfPrice(newPrices);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newInvoiceData = {
                PayeeName,
                date: invoiceDate,
                payment: Payment,
                AmountReceived: Paymentmeth === "cash" ? AmountReceived : null,
                invoiceNumber: InvoiceNumber,
                Discount,
                DiscountAmt,
                Paymentmeth,
                PhNo,
                ListOfItem,
                ListOfQty: ListOfQty.map(qty => parseInt(qty, 10)),
                ListOfPrice: ListOfPrice.map(price => parseFloat(price, 10)),
                TotalAmount
            };
            console.log(PhNo)
            if (editData) {
                await Axios.put(`http://localhost:5000/api/invoice/${editData._id}`, newInvoiceData);
            } else {
                await Axios.post("http://localhost:5000/api/invoice", newInvoiceData);
            }
            addInvoiceData();
            close();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="modal">
            <div className="form">
                <div className='close' onClick={close}>&times;</div>
                <div className="title">{editData ? "Edit Invoice" : "Add Invoice"}</div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Payee Name:</label>
                        <input
                            type="text"
                            value={PayeeName}
                            onChange={(e) => setPayeeName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Phone Number</label>
                        <input
                            type="number"
                            value={PhNo||""}
                            onChange={(e) => setPhNo(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Date:</label>
                        <input
                            type="date"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Discount (%):</label>
                        <input 
                            type="number" 
                            value={Discount} 
                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} 
                        />
                    </div>
                    <div>
                        <label>Payment Method:</label>
                        <div>
                            <label>
                                <input 
                                    type="radio" 
                                    value="online" 
                                    checked={Paymentmeth === "online"} 
                                    onChange={() => setPaymentmeth("online")}
                                /> 
                                Online
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="cash" 
                                    checked={Paymentmeth === "cash"} 
                                    onChange={() => setPaymentmeth("cash")}
                                /> 
                                Cash
                            </label>
                        </div>
                    </div>

                    {Paymentmeth === "cash" && (
                        <>
                            <div>
                                <label>Amount Received:</label>
                                <input
                                    type="number"
                                    value={AmountReceived}
                                    onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </>
                    )}

                    {ListOfItem.map((item, index) => (
                        <div key={index}>
                            <label>Item {index + 1}:</label>
                            <input
                                type="text"
                                value={ListOfItem[index]}
                                onChange={(e) => handleChange(index, "item", e.target.value)}
                            />
                            <label>Quantity {index + 1}:</label>
                            <input
                                type="number"
                                value={ListOfQty[index]}
                                onChange={(e) => handleChange(index, "qty", e.target.value)}
                            />
                            <label>Price {index + 1}:</label>
                            <input
                                type="number"
                                value={ListOfPrice[index]}
                                onChange={(e) => handleChange(index, "price", e.target.value)}
                            />
                        </div>
                    ))}

                    <button type="button" onClick={handleAddItem}>Add More Items</button>
                    <div>Total Amount: {TotalAmount}</div>
                    <div>Discounted Amount: {DiscountAmt}</div>
                    {(Paymentmeth==="cash")&&(
                        <label>Balance to Return:{AmountReceived - DiscountAmt > 0 ? AmountReceived - DiscountAmt : 0}</label>
                    )}
                    <div className="footer">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={close}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddData;
