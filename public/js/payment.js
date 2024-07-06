const placeorder = document.getElementById("placeorder")



async function orderPlace(paymethod) {
    try {
      console.log("Orderplaced")
      const res = await fetch(`/placeorder?paymethod=${paymethod}`)
      const data = await res.json()
      console.log(data)
      if(data.cod)
      {
          window.location.href = `/ordered?id=${data.cod}`
      }
      else if(data.razorpay)
      {
          razorOrderAPI(data.razorpay.id,data.razorpay.amount,data.razorpay.userdata,data.razorpay.orderId)
      }
      else if(data.wallet)
      {
          window.location.href = `/ordered?id=${data.wallet}`
      }
      else if(data.walleterr){
          Swal.fire({
              title:data.walleterr,
              
          })
      }
    } catch (error) {
      window.location.href = '/login'
       console.log("Hello"+error);
    }
  }
  
  placeorder.addEventListener("click", (e) => {
    const payradio = document.querySelectorAll(".payradio");
    const isChecked = Array.from(payradio).some((el) => el.checked);
    const checkprodet = document.querySelector(".checkprodet");
  
    if (!isChecked) {
      e.preventDefault();
      Swal.fire({
        title: "Select any Payment Option.",
        icon: "info",
      });
    } else if (!checkprodet) {
      e.preventDefault();
      Swal.fire({
        title: "No Products Available.",
        icon: "error",
      });
    } else {
      let paymethodvalue;
      payradio.forEach((element) => {
        if (element.checked) {
          paymethodvalue = element.value;
        }
      });
      console.log(paymethodvalue)
      if (paymethodvalue !== undefined) {
          orderPlace(paymethodvalue);
      }
    }
  });