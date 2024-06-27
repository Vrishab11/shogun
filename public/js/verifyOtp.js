document.addEventListener("DOMContentLoaded", function() {
    var timeLimit = 60;
    var resendButton = document.getElementById("resend");
    var resendLink = document.getElementById("resendLink");
    var timerElement = document.getElementById("timer");
    var lastResendTime = localStorage.getItem("otpResendTime");
    
    function startTimer(timeLeft) {
        timerElement.innerHTML = "Resend OTP in " + timeLeft + " seconds";
        var timerInterval = setInterval(function() {
            timeLeft--;
            localStorage.setItem('otpTime', timeLeft);
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                resendButton.style.display = "block";
                timerElement.innerHTML = "";
            } else {
                timerElement.innerHTML = "Resend OTP in " + timeLeft + " seconds";
            }
        }, 1000);
    }
    
    function initializeTimer() {
        if (lastResendTime) {
            var elapsedTime = Math.max(0, timeLimit - Math.floor((Date.now() - lastResendTime) / 1000));
            if (elapsedTime === 0) {
                resendButton.style.display = "block";
            } else {
                startTimer(elapsedTime);
            }
        } else {
            resendButton.style.display = "none";
        }
    }

    initializeTimer();
    let times = localStorage.getItem('otpTime');
    startTimer(times ? times : timeLimit);
    
    resendLink.addEventListener("click", function(event) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/verifyotp/resendOtp", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                localStorage.setItem("otpResendTime", Date.now());
                resendButton.style.display = "none";
                startTimer(timeLimit);
            }
        };
        xhr.send();
        event.preventDefault();
    });
})