const unlistbtn = document.querySelectorAll('.unlistbtn');
const listbtn = document.querySelectorAll('.listbtn');

function unlist(id) {
    fetch(`/admin/category/listUnlist?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.unlist) {
                window.location.reload();
                console.log(data.unlist)
            } else {
                console.log("Error: Category not unlisted.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

function list(id) {
    fetch(`/admin/category/listUnlist?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.list) {
                window.location.reload();
                console.log(data.list)
            } else {
                console.log("Error: Category not listed.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}



if (unlistbtn) {
    unlistbtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.uid;
            Swal.fire({
                title: "Are you sure you want to unlist this category?",
                icon: "info",
                confirmButtonText: "Unlist Category",
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
            const id = btn.dataset.uid;
            Swal.fire({
                title: "Are you sure you want to list this category?",
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
