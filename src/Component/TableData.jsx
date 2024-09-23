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
        const printWindow = window.open('', '', 'width=58','height');
        const { ListOfItem, ListOfPrice, ListOfQty } = invoice;
        
        // Sum of ListOfQty
        const totalQty = ListOfQty.reduce((total, qty) => total + qty, 0);
        
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
                    @media print {
        @page {
            size: 58mm auto;
            margin: 0;
            orientation: portrait;
        }

        body {
            margin: 0; /* Ensure there's no margin for the body */
            padding: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        table, th, td {
            border: 1px solid black;
        }

        th, td {
            padding: 5px;
            text-align: left;
        }
    }
                </style>
            </head>
            <body>
                <h6>Jackpot T-shirt</h6>
                <p>Invoice Number: ${invoice.invoiceNumber}</p>
                <p>Payee Name: ${invoice.PayeeName}</p>
                <p>Phone Number: ${invoice.PhNo}</p>
                <p>Payment Method: ${invoice.Paymentmeth}<p/>
                <p>Date: ${invoice.date}</p>
                <p>Discounted: ${invoice.Discount}% </p>
                <p>Total Quantity: ${totalQty}</p>
                <p>Items</p>
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
                <p>Total Amount: ${invoice.TotalAmount}</p>
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
                <td><button className='buttondet' onClick={() => handlePrint(detail)}>Print</button></td>
                <td><button className='buttondet' onClick={() => onEdit(detail)}>Details</button></td>
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
