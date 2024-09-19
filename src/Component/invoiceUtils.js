export const calculateTotalAmount = (quantities, prices) => {
    if (quantities.length !== prices.length) {
        throw new Error("Quantities and prices arrays must have the same length.");
    }
    return quantities.reduce((total, qty, index) => {
        return total + (qty * prices[index]);
    }, 0);
};

export const validateInvoiceData = (invoiceData) => {
    const { PayeeName, Date, Amount, ListOfItem, ListOfQty, ListOfPrice } = invoiceData;
    if (!PayeeName || !Date || !Amount || ListOfItem.length === 0 || ListOfQty.length === 0 || ListOfPrice.length === 0) {
        return false;
    }
    return true;
};

export const formatDate = (date) => {
    const dateObj = new Date(date);
    return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
};
