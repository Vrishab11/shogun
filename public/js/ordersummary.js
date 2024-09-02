const invoicebtn = document.getElementById('invoicebtn');

async function createInvoice(oid) {
    try {
        const res = await fetch(`/generateInvoice?id=${oid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/pdf' 
            }
        });

        if (res.ok) {
            const blob = await res.blob();

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `shogun_invoice-${oid}}.pdf`;
            document.body.appendChild(a);

            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            console.error('Failed to generate invoice');
        }
    } catch (error) {
        window.location.href = '/login';  
        console.log(error.message);
    }
}

invoicebtn.addEventListener('click', () => {
    const orderid = invoicebtn.dataset.orderid;
    createInvoice(orderid);
});
