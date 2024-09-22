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
    const [totalOverall, setTotalOverall] = useState(0);
    const [ItemPerPage, setItemPerPage] = useState(10); // Default to 5 items per page
    const [currentPage, setCurrentPage] = useState(1); // Track the current page

    useEffect(() => {
        Axios.get('https://jackpot-backend-r3dc.onrender.com/api/invoices')
            .then((res) => setApiData(res.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleEdit = (invoice) => {
        setEditData(invoice); // Set the invoice data for editing
        setShow(true); // Open the modal
    };

    const addInvoiceData = () => {
        Axios.get('https://jackpot-backend-r3dc.onrender.com/api/invoices')
            .then((res) => setApiData(res.data))
            .catch((error) => console.error("Error fetching data:", error));
    };

    const isWithinDateRange = (invoiceDate) => {
        const invoiceDateObj = new Date(invoiceDate);
        const fromDateObj = fromDate ? new Date(fromDate) : null;
        const toDateObj = toDate ? new Date(toDate) : null;

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
    }, [filteredInvoices]);

    useEffect(() => {
        const totalOverall = filteredInvoices.reduce((totalOverall, invoice) => {
            return totalOverall + (invoice.TotalAmount || 0); 
        }, 0);
        setTotalOverall(totalOverall);
    }, [filteredInvoices]);

    // Pagination logic
    const indexOfLastItem = currentPage * ItemPerPage;
    const indexOfFirstItem = indexOfLastItem - ItemPerPage;
    const currentInvoices = filteredInvoices.slice().reverse().slice(indexOfFirstItem, indexOfLastItem); // Reverse to show latest first

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredInvoices.length / ItemPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

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
                <strong>Total Amount: </strong> RS:{totalOverall.toFixed(2)}/-
            </div>
            
            <div>
                <label>Items Per Page: </label>
                <input
                    type="number"
                    value={ItemPerPage}
                    onChange={(e) => setItemPerPage(Number(e.target.value))} // Ensure value is a number
                    style={{ padding: '5px', width: '60px' }}
                />
            </div>

            {show && (
                <AddData 
                    close={() => setShow(false)} 
                    addInvoiceData={addInvoiceData} 
                    editData={editData} // Pass editData prop to AddData
                />
            )}

            <button onClick={() => { setEditData(null); setShow(true); }}>Add</button>

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
                    {currentInvoices.length > 0 ? (
                        currentInvoices.map((invoice) => (
                            <TableData
                                key={invoice._id}
                                detail={invoice}
                                onEdit={handleEdit}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>        

            {/* Pagination Controls */}
            <div style={{ marginTop: '20px' }}>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span style={{ margin: '0 10px' }}>Page {currentPage}</span>
                <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === Math.ceil(filteredInvoices.length / ItemPerPage)}
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default Invoice;
