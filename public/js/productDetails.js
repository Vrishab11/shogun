const addToCart = document.getElementById('addToCart')
const qty = document.getElementById('qty')

function addCart(proid,qty)
{  
    fetch(`/addToCart?id=${proid}&qty=${qty}`)
    .then(res =>{
        return res.json()    
    })
    .then(data =>{
        if(data.usererr)
        {   
            Swal.fire({
                title: data.usererr,
                icon: "info",
                confirmButtonText: "Login",
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    const currentUrl = encodeURIComponent(window.location.href);
                    window.location.href = `/login?redirect=${currentUrl}`;
                }
              })
        }
        else if(data.data )
        {
            Swal.fire({
                title: data.data,
                icon: "success",
                confirmButtonText:"OK"
                })
                .then(res=>{
                    if(res.isConfirmed)
                    {
                        window.location.reload()
                    }
            })
        }
        else if(data.err){
            Swal.fire({
                title: data.err,
                icon: "error",
                confirmButtonText:"OK"
                })
                .then(res=>{
                    if(res.isConfirmed)
                    {
                        window.location.reload()
                    }
                })  
        }
        else if(data.stockerr)
        {
            Swal.fire({
                title: data.stockerr,
                icon: "info"
                })
        }
    })
}

addToCart.addEventListener('click',function(){
    let proid = this.dataset.productid
    let quantity = qty.value
    addCart(proid,quantity)
})