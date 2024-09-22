const StockTableData = ({ stock, onEdit }) => {
    return (
        <tr>
            {/* <td>{Item}</td> */}
            <td>{stock.Item}</td>
            <td>{stock.Qty}</td>
            <td>{stock.Dealer}</td>
            <td>{stock.Date}</td>
            <td>{stock.Mrp}</td>
            <td>{stock.Sp}</td>
            <td>
                {/* Call the onEdit function with the stock details */}
                <button onClick={() => onEdit(stock)}>Details</button>
            </td>
        </tr>
    );
};

export default StockTableData;
