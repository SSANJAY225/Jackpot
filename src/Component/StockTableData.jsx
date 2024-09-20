const StockTableData=(props)=>{
    const {stock}=props
    // console.log(stock)
    // if (!stock) {
    //     return (
    //         <tr>
    //             <td colSpan="12">No data available</td>
    //         </tr>
    //     );
    // }

    return(<>
        <tr>
                <td>{stock.Item}</td>
                <td>{stock.Qty}</td>
                <td>{stock.Dealer}</td>
                <td><button onClick={() => onEdit(detail)}>Details</button></td>
            </tr>
    </>)
}

export default StockTableData