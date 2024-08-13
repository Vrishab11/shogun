const invoicebtn = document.getElementById('invoicebtn')

async function createInvoice(oid)
{
    try {
        const res = await fetch(`/generateInvoice?id=${oid}`)
        const data = await res.json()
        if(data.pdfData)
        {
            niceInvoice(data.pdfData,"Shogun_invoice.pdf")
        }
        else{

        }
    } catch (error) {
        window.location.href = '/login'
        console.log(error.message)
    }
}

invoicebtn.addEventListener('click',()=>{
    const orderid = invoicebtn.dataset.orderid
    createInvoice(orderid)
})