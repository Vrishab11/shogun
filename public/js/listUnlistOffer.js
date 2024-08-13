const unlistbtn = document.querySelectorAll('.unlistbtn');
const listbtn = document.querySelectorAll('.listbtn');


function unlist(id) {
    fetch(`/admin/offers/listUnlist?id=${id}`)
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
                console.log("Error: Offer not unlisted.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

function list(id) {
    fetch(`/admin/offers/listUnlist?id=${id}`)
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
                console.log("Error: Offer not listed.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}



if (unlistbtn) {
    unlistbtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.offerid;
            Swal.fire({
                title: "Do you wish to unlist the offer",
                icon: "info",
                confirmButtonText: "Unlist Offer",
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
            const id = btn.dataset.offerid;
            Swal.fire({
                title: "Do you wish to list the offer",
                icon: "info",
                confirmButtonText: "List Offer",
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    list(id)
                }
              })
        });
    });
}
