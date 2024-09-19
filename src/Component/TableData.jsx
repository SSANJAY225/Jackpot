import { useRef } from 'react';

const TableData = (props) => {
    const { detail, onEdit } = props;
    const printRef = useRef(null);  // Reference to the print section

    if (!detail) {
        return (
            <tr>
                <td colSpan="12">No data available</td>
            </tr>
        );
    }

    const handleEdit = (invoice) => {
        console.log('Edit clicked for:', invoice);
        setEditData(invoice);
        setShowAddData(true);
    };

    const handlePrint = (invoice) => {
        const printWindow = window.open('', '', 'width=300');
        const { ListOfItem, ListOfPrice, ListOfQty } = invoice;
        const itemCount = Math.min(ListOfItem?.length || 0, ListOfPrice?.length || 0, ListOfQty?.length || 0);
        const itemRows = Array.from({ length: itemCount }).map((_, index) => `
            <tr>
                <td>${ListOfItem[index]}</td>
                <td>${ListOfQty[index]}</td>
                <td>${ListOfPrice[index]}</td>
            </tr>
        `).join('');
    
        // Write the content into the new window
        printWindow.document.write(`
            <html>
            <head>
                <title>Invoice Print</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    table, th, td {
                        border: 1px solid black;
                    }
                    th, td {
                        padding: 10px;
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <h2>Invoice Number: ${invoice.invoiceNumber}</h2>
                <p>Payee Name: ${invoice.PayeeName}</p>
                <p>Phone Number: ${invoice.PhNo}</p>
                <p>Payment Method: ${invoice.Paymentmeth}<p/>
                <p>Date: ${invoice.date}</p>
                <p>Payment Status: ${invoice.payment ? "Paid" : "Yet to pay"}</p>
                <p>Total Amount: ${invoice.TotalAmount}</p>
                <p>Discounted ${invoice.Discount}</p>
    
                <h3>Items</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows}
                    </tbody>
                </table>
            </body>
            </html>
        `);
    
        // Print the content
        printWindow.document.close(); // Close the document to signal it's ready for printing
        printWindow.focus();          // Ensure the window is focused
        printWindow.print();          // Trigger the print
        printWindow.close();          // Close the window after printing
    };
    
    

    return (
        <>
            <tr>
                <td>{detail.invoiceNumber}</td>
                <td>{detail.PayeeName}</td>
                <td>{detail.PhNo}</td>
                <td>{detail.date}</td>
                <td>{detail.payment ? "Paid" : "Yet to pay"}</td>
                <td><button onClick={() => handlePrint(detail)}>Print</button></td>
                <td><button onClick={() => onEdit(detail)}>Details</button></td>
                <td>{detail.TotalAmount}</td>
                <td>{detail.Discount}</td>
                <td>{detail.DiscountAmt}</td>
                <td>{detail.Paymentmeth}</td>
            </tr>
            {/* Move the hidden print area outside the table */}
            <div ref={printRef} style={{ display: 'none' }}></div>
        </>
    );
}

export default TableData;
