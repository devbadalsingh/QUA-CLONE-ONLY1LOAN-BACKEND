// Function to extract Aadhaar ID from URL
function getIdFromUrl() {
    const urlParts = window.location.pathname.split("/");
    return urlParts[urlParts.length - 1];
}

// Function to request OTP
async function requestOtp() {
    const aadhaarId = getIdFromUrl();

    const otpRequestBtn = document.querySelector("#requestOtpBtn")
    
    otpRequestBtn.disabled = true;
    otpRequestBtn.textContent = "Requesting...";

    if (!aadhaarId) {
        alert("Invalid Aadhaar verification link.");
        return;
    }

    try {
        const response = await fetch(`/api/verify/aadhaar/${aadhaarId}`);
        const result = await response.json();

        if (response.ok && result.success) {
            alert("OTP sent successfully! Redirecting to OTP page...");
            console.log("res", result);
            const { codeVerifier, transactionId, fwdp } = result;
            const aadhaarInfo = {
                codeVerifier,
                transactionId,
                fwdp,
            };

            localStorage.setItem("aadhaarInfo", JSON.stringify(aadhaarInfo));
            console.log(localStorage.getItem("aadhaarInfo"));
            window.location.href = `/otp-page/${aadhaarId}`;
        } else {
            alert(result.message || "Failed to request OTP. Please try again.");
        }
    } catch (error) {
        console.error("Error requesting OTP:", error);
        alert("An error occurred. Please try again later.");
    }
}

// Attach event listener to the button
document.getElementById("requestOtpBtn").addEventListener("click", requestOtp);
