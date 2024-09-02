const unlistbtn = document.querySelectorAll('.unlistbtn');
const listbtn = document.querySelectorAll('.listbtn');


function unlist(id) {
    fetch(`/admin/coupons/listUnlist?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.unlisted) {
                Swal.fire({
                    title: data.unlisted,
                    icon: "success",
                    confirmButtonText:"OK"
                    })
                    .then(res=>{
                        if(res.isConfirmed)
                        {
                            window.location.reload()
                        }
                })
            } else {
                console.log("Error: Coupon not unlisted.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

function list(id) {
    fetch(`/admin/coupons/listUnlist?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.listed) {
                if (data && data.listed) {
                    Swal.fire({
                        title: data.listed,
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
            } else {
                console.log("Error: Coupon not listed.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}



if (unlistbtn) {
    unlistbtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.couponid;
            Swal.fire({
                title: "Do you wish to unlist the coupon",
                icon: "info",
                confirmButtonText: "Unlist Coupon",
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    unlist(id)
                }
            })
        });
    });
}

if (listbtn) {
    listbtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.couponid;
            Swal.fire({
                title: "Do you wish to list the coupon",
                icon: "info",
                confirmButtonText: "List Coupon",
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    list(id)
                }
            })
        });
    });
}
