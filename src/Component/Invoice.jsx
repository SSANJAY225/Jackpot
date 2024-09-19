import { useState, useEffect } from "react";
import Axios from 'axios';
import TableData from './TableData';
import Nav from './Nav.jsx'
import AddData from './AddData';
import './Invoice.css'; 

const Invoice = () => {
    const [ApiData, setApiData] = useState([]);
    const [show, setShow] = useState(false);
    const [editData, setEditData] = useState(null);

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

    return (
        <>
            <Nav/>
            <table id='customers'>
                <thead>
                    <tr>
                        <th>Invoice Number</th>
                        <th>Payee Name</th>
                        <th>Phone Number</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Print</th>
                        <th>Details</th>
                        <th>Total Amount</th>
                        <th>Discount</th>
                        <th>Discount Amount</th>
                        <th>Payment Method</th>
                    </tr>
                </thead>
                <tbody>
                    {ApiData.length > 0 ? (
                        ApiData.slice().reverse().map((invoice) => (
                            <TableData
                                key={invoice._id}
                                detail={invoice}
                                onEdit={handleEdit} // Pass handleEdit function
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No data available</td>
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
