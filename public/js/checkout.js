const proceedbtn  = document.getElementById('proceedbtn')


proceedbtn.addEventListener('click',(e)=>{
    const ordertotal = document.getElementById('ordertotal').innerHTML
    const radio = document.querySelectorAll('.addressradio')
    const isChecked = Array.from(radio).some(el => el.checked)
    const coupon = document.getElementById('couponSelect');

    const totalamount = parseInt(ordertotal)
    let addid;
    for (let i = 0; i < radio.length; i++) {
      if (radio[i].checked) {
        addid = radio[i];
        break;
      }
    }
    if(!isChecked)
    {
        e.preventDefault()
        Swal.fire({
            title:"Select your Address.",
            icon:"info"
        })
    }
    else{
        document.cookie = `addressid=${addid.value}`
        document.cookie = `totalamount=${totalamount}`
        document.cookie = `coupondata=${coupon.value}`
    }

})




function selectCoupon(value) {
  const couponInput = document.getElementById('coupCode');
  if (value) {
      couponInput.value = value;
      couponInput.style.display = 'block';
  } else {
      couponInput.value = '';
      couponInput.style.display = 'none';
  }
}

function applyCoupon(cartId) {
    const couponSelect = document.getElementById('couponSelect');
    const couponCode = couponSelect.value; 
    const totalAmount = document.getElementById('ordtotal').innerHTML; 

    if (!couponCode) {
        Swal.fire({
            title: "Please select a coupon first!",
            icon: "info"
        });
        return;
    }

    fetch(`/applyCoupon`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ totalAmount: parseInt(totalAmount), couponCode: couponCode }) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: "Coupon applied successfully!",
                icon: "success"
            });

            document.getElementById('ordertotal').innerText = `${data.newTotal}`;
            document.getElementById('discount-value').innerText = `${data.discount}`;
        } else {
            Swal.fire({
                title: "Failed to apply coupon. Try again.",
                icon: "error"
            });
        }
    })
    .catch(error => {
        console.error('Error applying coupon:', error);
        Swal.fire({
            title: "Error applying coupon.",
            icon: "error"
        });
    });
}




function removeCoup() {
    document.getElementById('coupCode').value = '';
    document.getElementById('coupCode').style.display = 'none';
    
    fetch(`/removeCoupon`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartId: '<%= user.cart._id %>' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Coupon Removed!',
                text: 'Coupon removed successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            document.getElementById('ordertotal').innerText = `Rs. ${data.originalTotal}`;
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to remove coupon.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error removing coupon:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Error removing coupon.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
  }
  
