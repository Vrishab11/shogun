const cancelorderbtn = document.querySelectorAll('.cancelorderbtn')
const returnbtn = document.querySelectorAll('.returnbtn')
const retrypaymentbtn = document.querySelectorAll('.retrypayment')

async function cancelOrder(oid,pid)
{
    try
    {const res = await fetch(`/orders/cancel?oid=${oid}&pid=${pid}`)
    const data = await res.json()
    if(data.data)
    {
        Swal.fire({
            title:data.data,
            icon:"success",
            confirmButtonText:"OK"
        })
        .then(res=>{
            if(res.isConfirmed)
            {
                window.location.reload()
            }
        })
    }
    else if(data.err)
    {

    }}
    catch(err)
    {
        window.location.href = '/login'
    }
}

cancelorderbtn.forEach(el=>{
    el.addEventListener('click',()=>{
        let orderId = el.dataset.orderid
        let proid = el.dataset.proid
        console.log(orderId,proid)
        Swal.fire({
            title:"Are you Sure??",
            icon:"info",
            showDenyButton:true,
            confirmButtonText:"OK",
            denyButtonText:"Cancel"
        }).then(res=>{
            if(res.isConfirmed)
            {
                cancelOrder(orderId,proid)
            }
            else if(res.isDenied){
                window.location.reload()
            }
        })
    })
})

async function returnOrder(orderid,productid){
    try {
        const res = await fetch(`/orders/return?oid=${orderid}&pid=${productid}`)
        const data = await res.json()
        if(data.success){
            Swal.fire({
                title:data.success,
                icon:"success",
                confirmButtonText:"OK"
            })
            .then(res=>{
                if(res.isConfirmed)
                {
                    window.location.reload()
                }
            })
        }
        else{
            console.log(data)
        }
    } catch (error) {
        console.log(error.message)
    }
}

returnbtn.forEach(el=>{
    el.addEventListener('click',()=>{
        let orderId = el.dataset.orderid
        let proid = el.dataset.proid
        console.log(orderId,proid)
        Swal.fire({
            title:"Are you Sure??",
            icon:"info",
            showDenyButton:true,
            confirmButtonText:"OK",
            denyButtonText:"Cancel"
        }).then(res=>{
            if(res.isConfirmed)
            {
                returnOrder(orderId,proid)
            }
            else if(res.isDenied){
                // window.location.reload()
            }
        })
    })
})



async function verifyPayment(paymentdetails,orderIdDB){
    try {
        const res = await fetch('/verifyPayment',{
            method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                razorPayId:paymentdetails.razorpay_payment_id,
                razorOrderId:paymentdetails.razorpay_order_id,
                razorSignature:paymentdetails.razorpay_signature,
                realOrderID:orderIdDB
            })
            }
        )
        const data = await res.json()
        if(data.success)
        {
            window.location.href = `/ordered?id=${data.success}`
        }else{
            Swal.fire({
                title:"Payment Failed!!",
                icon:"error",
                confirmButtonText:"OK",
                
            }).then(res=>{
              if(res.isConfirmed)
              {
                  window.location.href="/orders"
              }
            })
        }
    } catch (error) {
        console.log(error.message)
    }
  }
  
  async function razorOrderAPI(orderid,amount,userdata,orderIdDB)
{
  try {
      var options = {
          "key": "rzp_test_yqR9NnL6SGejbg", 
          "amount": parseInt(amount), 
          "currency": "INR",
          "name": "SHOGUN",
          "description": "Test Transaction",
          "image": "/public/images/logo.png",
          "order_id": orderid, 
          "handler": function (response){
              verifyPayment(response,orderIdDB)
          },
          "prefill": {
              "name": userdata.firstname +" "+ userdata.lastname,
              "email": userdata.email,
              "contact": userdata.mobile
          },
          "notes": {
              "address": "Razorpay Corporate Office"
          },
          "theme": {
              "color": "#fc4f4f"
          }
        };
      let rzp1 = new Razorpay(options);
      rzp1.open()
      rzp1.on('payment.failed', function (response){
          console.log("gdfgdgdgd",response)
          Swal.fire({
              title: "PAYMENT FAILED!",
              text: "Try using Other Options",
              imageUrl: "/public/images/paymentfailed.webp",
              imageWidth: 200,
              imageHeight: 200,
              imageAlt: "Custom image",
              confirmButtonText:"OK",
              showDenyButton:true,
              denyButtonText:"Cancel"
            })
            .then(res=>{
              if(res.isConfirmed)
              {
                  window.location.href = '/orders'
              }
              if(res.isDenied)
              {
                  cancelOrder(orderIdDB)
              }
            })
      })
  } catch (error) {
      console.log("ERRR",error)
  }
}


retrypaymentbtn.forEach(el=>{
    el.addEventListener('click',()=>{
        const id = el.dataset.id
        const amount = el.dataset.amount
        const userdata = el.dataset.udata
        const orderId = el.dataset.orderid
        console.log(id,amount,userdata,orderId)
        razorOrderAPI(orderId,amount,userdata,id)
    })
})