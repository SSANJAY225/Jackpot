import { useState, useEffect } from "react";
import Axios from 'axios';
import TableData from './TableData';
import Nav from './Nav.jsx';
import AddData from './AddData';
import './Invoice.css'; 

const Invoice = () => {
    const [ApiData, setApiData] = useState([]);
    const [show, setShow] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [fromDate, setFromDate] = useState(''); // State for "from" date
    const [toDate, setToDate] = useState(''); // State for "to" date
    const [totalDiscountAmount, setTotalDiscountAmount] = useState(0); // Initialize to 0
    const [totalOverall,settotalOverall]=useState(0)

    useEffect(() => {
        Axios.get('http://localhost:5000/api/invoices')
            .then((res) => setApiData(res.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleEdit = (invoice) => {
        setEditData(invoice); // Set the invoice data for editing
        setShow(true); // Open the modal
    };

    const addInvoiceData = () => {
        Axios.get('http://localhost:5000/api/invoices')
            .then((res) => setApiData(res.data))
            .catch((error) => console.error("Error fetching data:", error));
    };

    // Function to check if the invoice date is within the selected date range
    const isWithinDateRange = (invoiceDate) => {
        const invoiceDateObj = new Date(invoiceDate);
        const fromDateObj = fromDate ? new Date(fromDate) : null;
        const toDateObj = toDate ? new Date(toDate) : null;

        // Check if the invoice date falls within the from-to range
        if (fromDateObj && invoiceDateObj < fromDateObj) return false;
        if (toDateObj && invoiceDateObj > toDateObj) return false;
        return true;
    };

    const filteredInvoices = ApiData.filter(invoice => 
        (invoice.invoiceNumber && invoice.invoiceNumber.toString().includes(searchTerm)) &&
        (isWithinDateRange(invoice.date))
    );

    useEffect(() => {
        const total = filteredInvoices.reduce((total, invoice) => {
            return total + (invoice.DiscountAmt || 0); 
        }, 0);
        setTotalDiscountAmount(total);
    }, [filteredInvoices]); // Recalculate whenever filteredInvoices changes

    useEffect(() => {
        const totalOverall = filteredInvoices.reduce((totalOverall, invoice) => {
            return totalOverall + (invoice.TotalAmount || 0); 
        }, 0);
        settotalOverall(totalOverall);
    }, [filteredInvoices]);

    return (
        <>
            <Nav/>
            <div style={{ margin: '20px 0' }}>
                <input
                    type="text"
                    placeholder="Search by Payee Name or Invoice Number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                        padding: '10px', 
                        width: '300px', 
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        marginRight: '10px'
                    }}
                />

                <label style={{ marginLeft: '10px', marginRight: '5px' }}>From:</label>
                <input 
                    type="date" 
                    value={fromDate} 
                    onChange={(e) => setFromDate(e.target.value)}
                    style={{ padding: '5px', marginRight: '10px' }}
                />

                <label style={{ marginRight: '5px' }}>To:</label>
                <input 
                    type="date" 
                    value={toDate} 
                    onChange={(e) => setToDate(e.target.value)}
                    style={{ padding: '5px' }}
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <strong>Total Discount Amount: </strong> RS:{totalDiscountAmount.toFixed(2)}/-
                <strong>Total  Amount: </strong> RS:{totalOverall.toFixed(2)}/-
            </div>

            <table id='customers'>
                <thead>
                    <tr>
                        <th>Invoice Number</th>
                        <th>Payee Name</th>
                        <th>Phone Number</th>
                        <th>Date</th>
                        <th>Print</th>
                        <th>Details</th>
                        <th>Total Amount</th>
                        <th>Discount</th>
                        <th>Discount Amount</th>
                        <th>Payment Method</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInvoices.length > 0 ? (
                        filteredInvoices.slice().reverse().map((invoice) => (
                            <TableData
                                key={invoice._id}
                                detail={invoice}
                                onEdit={handleEdit} // Pass handleEdit function
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button onClick={() => { setEditData(null); setShow(true); }}>Add</button>
            
            {show && (
                <AddData 
                    close={() => setShow(false)} 
                    addInvoiceData={addInvoiceData} 
                    editData={editData} // Pass editData prop to AddData
                />
            )}
        </>
    );
};

export default Invoice;
