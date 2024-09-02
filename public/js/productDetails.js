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


async function addWishlist(proid){
    try {
      const res = await fetch(`/wishlist/add?productid=${proid}`)
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

const wishaddbtn = document.querySelectorAll('.wishicon3')
const wishiconsolid1  = document.querySelectorAll('.wishiconsolid3')

wishaddbtn.forEach(el=>{
    el.addEventListener('click',()=>{
        let proid = el.dataset.proid
        console.log(proid)
        const added =  addWishlist(proid)
        if(added){
          window.location.reload()
          }
    })
})

wishiconsolid1.forEach(el=>{
    el.addEventListener('click',()=>{
        let proid = el.dataset.proid
        console.log(proid)
        const removed =  removeWishlist(proid)
        if(removed){
          window.location.reload()
          }
    })
})