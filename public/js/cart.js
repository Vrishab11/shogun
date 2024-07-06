const quantity = document.querySelectorAll('.qty')
const decbtn = document.querySelectorAll('.decbtn')
const incbtn = document.querySelectorAll('.incbtn')
const rembtn = document.querySelectorAll('.itemrem')
const clearcart = document.getElementById('clearcart')



async function incQty(qty,proid){
    try{
    const res = await fetch(`/cart/qtyinc?qty=${qty}&proid=${proid}`)
    const data = await res.json()
        if(data.data)
        {
            return true
        }
        else if(data.stockerr){
            Swal.fire({
                title: data.stockerr,
                icon: "info"
                })
            return false
        }
        else{
            return false
        }
    }
    catch(err)
    {
        window.location.href = '/login'
    }
}

async function decQty(qty,proid){
    try{
    const res = await fetch(`/cart/qtydec?qty=${qty}&proid=${proid}`)
    const data = await res.json()
    
        if(data.data)
        {
            return true
        }
        else if(data.stockerr){
            Swal.fire({
                title: data.stockerr,
                icon: "info"
                })
                return false
        }
        else{
            return false
        }
    }
    catch(err)
    {
        console.log(err.message)
        window.location.href = '/login'
    }
}



async function delCart(proid)
{
    try{
    const res = await fetch(`/cart/deletecart?proid=${proid}`)
    const data = await res.json()
    if(data.data)
    {
        return val = Swal.fire({
            title: data.data,
            icon: "info",
            confirmButtonText:"OK"
            })
            .then(res=>{
                if(res.isConfirmed)
                {
                    return true
                }
            })
    }
    else{
        return false
    }
    }
    catch(err)
    {
        window.location.href = '/login'
    }
}

async function clearCart(){
    try{
    const res = await fetch(`/cart/clearcart`)
    const data = await res.json()
        if(data.data)
        {
            return val = Swal.fire({
                title: data.data,
                icon: "info",
                confirmButtonText:"OK"
                })
                .then(res=>{
                    if(res.isConfirmed)
                    {   
                        window.location.reload()
                        return true
                    }
                })
        }
        else{
            return false
        }
    }
    catch(err)
    {
        window.location.href = '/login'
    }
}


decbtn.forEach(e=>{
    e.addEventListener('click',()=>{
        const pid = e.dataset.proid
        const qtyview = document.getElementById(`qty_${pid}`).value
        const qtyrate = parseInt(qtyview)
        if(qtyrate > 1)
        {
            decQty(qtyrate-1,pid)
                .then(dec=>{
                    console.log(dec)
                    if(dec)
                    {
                        window.location.reload()
                    }
                    else{
                        console.log("Error in decrement")
                    }
                    console.log(qtyrate)
                })
                .catch(err=>{
                    console.log(err.message)
                })
        }
        else{
            delCart(pid)
                .then(del=>{
                    if(del)
                    {     
                        window.location.reload()   
                    }
                    else{
                        console.log("error in deletion")
                    }
                })
                .catch(err=>{
                    console.log(err.message)
                })


        }
    })
})



incbtn.forEach(e=>{
    e.addEventListener('click',()=>{
        const pid = e.dataset.proid
        const qtyview = document.getElementById(`qty_${pid}`).value
       const qtydat =  parseInt(qtyview)
       if(qtydat > 0)
       {
        incQty(qtydat+1,pid)
                .then(inc=>{
                console.log(inc)
                if(inc)
                {
                window.location.reload()
                }
                else{
                    console.log("error in increment")
                }
                 console.log(qtydat)
                })
                .catch(err=>{
                    console,log(err.message)
                })
                
       }
    })
})



rembtn.forEach(e=>{
    e.addEventListener('click',()=>{
        const pid = e.dataset.rem
        delCart(pid)
                .then(del=>{
                    if(del)
                    {     
                        window.location.reload()   
                    }
                    else{
                        console.log("error in deletion")
                    }
                })
                .catch(err=>{
                    console.log(err.message)
                })
    })
})

clearcart.addEventListener('click',()=>{
    clearCart()
})