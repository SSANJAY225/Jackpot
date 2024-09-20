import Nav from './Nav.jsx'
import { useState, useEffect } from "react";
import Axios  from 'axios';
import StockTableData from './StockTableData.jsx';
const Stock=()=>{
    const [StockApi,setStockApi]=useState([]);
    const [FilteredStockApi,setFilteredStockApi]=useState('')
    useEffect(() => {
        Axios.get('http://localhost:5000/api/stocks')
            .then((res) => setStockApi(res.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleEdit = (invoice) => {
        setEditData(invoice); // Set the invoice data for editing
        setShow(true); // Open the modal
    };
    return (<>
            <Nav/>
            <p>Stock</p>
            <div style={{ margin: '20px 0' }}>
                <input
                    type="text"
                    placeholder="Search by Item"
                    value={FilteredStockApi}
                    onChange={(e) => setFilteredStockApi(e.target.value)}
                    style={{ 
                        padding: '10px', 
                        width: '300px', 
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        marginRight: '10px'
                    }}
                />
            </div>
            <button>Add</button>
            <table id='customers'>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Dealer</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <StockTableData stock={StockApi}/> */}
                    {StockApi.length > 0 ? (
                        StockApi.slice().reverse().map((stock) => (
                            <StockTableData
                                key={stock._id}
                                stock={stock}
                                onEdit={handleEdit} // Pass handleEdit function
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No data available</td>
                        </tr>
                    )}
                </tbody>        
            </table>
        </>)
}

export default Stock;