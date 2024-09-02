const addtocartbtn = document.querySelectorAll('.addtocartbtn')
const removebtn = document.querySelectorAll('.removebtn')

async function addToCart(proid,qty){
    try {
        const res = await fetch(`/addToCart?id=${proid}&qty=${qty}`)
        const data = await res.json()
        if(data.data)
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
        else if(data.stockerr)
        {
            Swal.fire({
                title: "Out Of Stock",
                icon: "error"
                })
        }
        else if(data.err){
            Swal.fire({
                title: data.err,
                icon: "warning",
                confirmButtonText:"OK"
                })
                .then(res=>{
                    if(res.isConfirmed)
                    {
                        window.location.reload()
                    }
                })  
        }
    } catch (error) {
        console.log(error.message)
    }
}

async function removeWishlist(proid){
    try {
      const res = await fetch(`/wishlist/remove?productid=${proid}`)
      const data = await res.json()
      if(data.success){
        return true
      }
      else{
        return false
      }
    } catch (error) {
      window.location.href = '/login'
      console.log(error.message)
    }
  }

addtocartbtn.forEach(el=>{
    el.addEventListener('click',()=>{
        const proid = el.dataset.proid
        console.log(proid)
        removeWishlist(proid)
        addToCart(proid,1)
    })
})

removebtn.forEach(el=>{
    el.addEventListener('click',()=>{
        const proid = el.dataset.proid
        console.log(proid)
        const removed = removeWishlist(proid)
        if(removed){
            window.location.reload()
        }
    })
})