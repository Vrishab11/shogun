const proceedbtn  = document.getElementById('proceedbtn')
const ordertotal = document.getElementById('ordertotal')



proceedbtn.addEventListener('click',(e)=>{
    const radio = document.querySelectorAll('.addressradio')
    const isChecked = Array.from(radio).some(el => el.checked)
    

    const totalamount = parseInt(ordertotal.innerHTML.split('.')[1])
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
    }

})


const applybtn = document.getElementById('apply')
const cancelbtn = document.getElementById('cancel')

applybtn