const blockbtns = document.querySelectorAll('.blockbtn');
const unblockbtns = document.querySelectorAll('.unblockbtn');

function block(id) {
    fetch(`/admin/viewUsers/blockUnblockUser?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.blocked) {
                window.location.reload();
                console.log(data.blocked)
            } else {
                console.log("Error: User not blocked.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

function unblock(id) {
    fetch(`/admin/viewUsers/blockUnblockUser?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.unblocked) {
                window.location.reload();
                console.log(data.unblocked)
            } else {
                console.log("Error: User not unblocked.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}



if (blockbtns) {
    blockbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.uid;
            Swal.fire({
                title: "Are you sure you want to block this user?",
                icon: "info",
                confirmButtonText: "Block User",
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    block(id)
                }
            })
        });
    });
}

if (unblockbtns) {
    unblockbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.uid;
            Swal.fire({
                title: "Are you sure you want to unblock this user?",
                icon: "info",
                confirmButtonText: "Unblock User",
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    unblock(id)
                }
            })
        });
    });
}
