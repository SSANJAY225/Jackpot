import Nav from './Nav.jsx';
import { useState, useEffect } from "react";
import Axios from 'axios';
import StockTableData from './StockTableData.jsx';
import './Stock.css'; 

const Stock = () => {
    const [StockApi, setStockApi] = useState([]);
    const [FilteredStockApi, setFilteredStockApi] = useState(''); // Stores the search input
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [newItem, setNewItem] = useState(''); // Stores the new stock item input
    const [newQty, setNewQty] = useState(''); // Stores the new stock quantity input
    const [newDealer, setNewDealer] = useState(''); // Stores the new stock dealer input
    const [newMrp, setNewMrp] = useState(''); // Stores the new stock MRP input
    const [newSp, setNewSp] = useState(''); // Stores the new selling price (SP)
    const [newDate, setNewDate] = useState(''); // Stores the new date
    const [isEditMode, setIsEditMode] = useState(false); // Flag for edit mode
    const [editStockId, setEditStockId] = useState(''); // Stores the ID of the stock being edited

    const [fromDate, setFromDate] = useState(''); // Stores the "From" date filter
    const [toDate, setToDate] = useState(''); // Stores the "To" date filter

    useEffect(() => {
        fetchStockData();
    }, []);

    const fetchStockData = () => {
        Axios.get('http://localhost:5000/api/stocks')
            .then((res) => setStockApi(res.data))
            .catch((error) => console.error("Error fetching data:", error));
    };

    // Filter the stock based on the search term and date range
    const filteredStock = StockApi.filter(stock => {
        const stockDate = new Date(stock.Date); // Convert stock date to a Date object
        const from = fromDate ? new Date(fromDate) : null; // Convert "From" date to Date object
        const to = toDate ? new Date(toDate) : null; // Convert "To" date to Date object

        // Check if the stock item matches the search term
        const matchesSearchTerm = stock.Item.toLowerCase().includes(FilteredStockApi.toLowerCase());

        // Check if the stock date is within the specified date range
        const withinDateRange = (!from || stockDate >= from) && (!to || stockDate <= to);

        return matchesSearchTerm && withinDateRange;
    });

    const handleAddStock = () => {
        const newStock = {
            Item: newItem,
            Qty: newQty,
            Dealer: newDealer,
            Mrp: newMrp,
            Sp: newSp,
            Date: newDate,
        };

        Axios.post(' http://localhost:5000/api/AddStock', newStock)
            .then((res) => {
                fetchStockData(); // Refresh the stock data after adding
                setShowModal(false); // Close the modal after submission
            })
            .catch((error) => console.error("Error adding stock:", error));
    };

    const handleEditClick = (stock) => {
        // Set the current stock details to the state
        setNewItem(stock.Item);
        setNewQty(stock.Qty);
        setNewDealer(stock.Dealer);
        setNewMrp(stock.Mrp);
        setNewSp(stock.Sp);
        setNewDate(stock.Date);
        setEditStockId(stock._id);
        setIsEditMode(true);
        setShowModal(true); // Show modal for editing
    };

    const handleUpdateStock = () => {
        const updatedStock = {
            Item: newItem,
            Qty: newQty,
            Dealer: newDealer,
            Mrp: newMrp,
            Sp: newSp,
            Date: newDate,
        };

        Axios.put(` http://localhost:5000/api/stocks/${editStockId}`, updatedStock)
            .then((res) => {
                fetchStockData(); // Refresh the stock data after updating
                setShowModal(false); // Close the modal after submission
                setIsEditMode(false); // Reset edit mode
            })
            .catch((error) => console.error("Error updating stock:", error));
    };

    return (
        <>
        <div className="page-container">
            <Nav />
            <div style={{ margin: '20px 0' }}>
                {/* Search by Item */}
                <input
                    type="text"
                    placeholder="Search by Item"
                    value={FilteredStockApi}
                    onChange={(e) => setFilteredStockApi(e.target.value)}
                    style={{ 
                        padding: '10px', 
                        width: '98.5%', 
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    
                    }}
                />

                {/* Date Filters */}
                <div className="date_label" style={{marginTop: '20px'}}>
                <label style={{ marginLeft: '966px', marginRight: '5px' }}>From :</label>
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    placeholder="From Date"
                    style={{ marginRight: '10px' }}
                />
                <label style={{ marginRight: '5px' }}>To:</label>
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    placeholder="To Date"
                    style={{ marginRight: '10px' }}
                />
                </div>
            </div>

            <button onClick={() => {
                setIsEditMode(false); // Reset edit mode for adding new stock
                setShowModal(true);
            }} className="redButton" >Add</button>

            <table id='customers'>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Dealer</th>
                        <th>Date</th>
                        <th>Mrp</th>
                        <th>Sp</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Use filteredStock to display filtered results */}
                    {filteredStock.length > 0 ? (
                        filteredStock.slice().reverse().map((stock) => (
                            <StockTableData
                                key={stock._id}
                                stock={stock}
                                onEdit={() => handleEditClick(stock)} // Pass the stock to edit
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal for adding/editing stock */}
            {showModal && (
    <div className="modal">
        <div className="modal-content">
            {/* Close button with "X" */}
            {/* <div className='flase-X'>
            <button className="modal-close-button" onClick={() => setShowModal(false)}>X</button>
            </div> */}
            <h2>{isEditMode ? "Edit Stock" : "Add New Stock"}</h2>
            {/* Line below heading */}
            <hr />
            <label>Item Name</label>
            <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Enter item name"
            />
            <label>Quantity</label>
            <input
                type="number"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                placeholder="Enter quantity"
            />
            <label>Dealer</label>
            <input
                type="text"
                value={newDealer}
                onChange={(e) => setNewDealer(e.target.value)}
                placeholder="Enter dealer name"
            />
            <label>MRP</label>
            <input
                type="number"
                value={newMrp}
                onChange={(e) => setNewMrp(e.target.value)}
                placeholder="Enter MRP"
            />
            <label>Selling Price</label>
            <input
                type="number"
                value={newSp}
                onChange={(e) => setNewSp(e.target.value)}
                placeholder="Enter selling price"
            />
            <label>Date</label>
            <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
            />
            
            {/* Line before buttons */}
            <hr />

            <div className="modal-buttons">
                {/* Update button in blue */}
                <div className='button-01'>
                <button className="update-button" onClick={isEditMode ? handleUpdateStock : handleAddStock}>
                    {isEditMode ? "Update Stock" : "Add Stock"}
                </button>
                </div>
                {/* Cancel button in red */}
                <div className=''>
                <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    </div>
)}

<style jsx>{`
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000; /* Ensure modal is above other content */
    }
    .modal-content {
        background: #fefefe;
        padding: 30px;
        border-radius: 8px;
        width: 420px; /* Adjust width for a more elegant look */
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        text-align: left;
        position: relative; /* Make position relative for "X" button */
        border: 2px solid #ccc; /* Added border to modal */
    }
    .close-button {
        position: absolute;
        top: 10px;
        right: 15px;
        background: transparent;
        border: none;
        font-size: 18px;
        cursor: pointer;
    }
    .modal-content h2 {
        margin-bottom: 20px;
        font-family: 'Arial', sans-serif;
        color: #333;
        text-align: left;
    }
    .modal-content hr {
        margin-bottom: 20px;
        border: 0;
        border-top: 1px solid #ccc;
    }
    .modal-content label {
        display: block;
        margin: 10px 0 5px;
        font-weight: bold;
        color: #555;
    }
    .modal-content input {
        margin-bottom: 15px;
        padding: 10px;
        width: 95%;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
    }
    .modal-buttons {
        display: flex;
        justify-content: space-between;
    }
    .update-button {
        padding: 10px 15px;
        font-size: 14px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #27a9e3; /* Blue background for update button */
        color: white;
        transition: background-color 0.3s;
    }
    .cancel-button {
        padding: 10px 15px;
        font-size: 14px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #6c757d;/* Red background for cancel button */
        color: white;
    }
`}


        </style>
            </div>
        </>
    );
}

export default Stock;
