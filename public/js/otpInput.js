// Auto-focus logic for OTP inputs
const inputs = document.querySelectorAll(".otp-input input");
inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

// Resend OTP logic
const resendBtn = document.getElementById("resendBtn");
async function resendOtp() {
    const aadhaarId = window.location.pathname.split("/").pop();
    if (!aadhaarId) {
        alert("Invalid Aadhaar verification link.");
        return;
    }

    resendBtn.disabled = true;
    resendBtn.innerText = "Resending...";
    let countdown = 30;

    const updateButtonText = () => {
        resendBtn.innerText = `Resend in ${countdown}s`;
        countdown--;

        if (countdown >= 0) {
            setTimeout(updateButtonText, 1000); // Update every second
        } else {
            resendBtn.disabled = false;
            // resendBtn.innerText = "Resend";
        }
    };

    // Start the countdown
    updateButtonText();

    try {
        const response = await fetch(`/api/verify/aadhaar/${aadhaarId}`);
        const result = await response.json();

        if (response.ok && result.success) {
            alert("OTP resent successfully!");
        } else {
            alert(result.message || "Failed to resend OTP. Please try again.");
        }
    } catch (error) {
        console.error("Error resending OTP:", error);
        alert("An error occurred. Please try again later.");
    } finally {
        setTimeout(() => {
            resendBtn.disabled = false;
            resendBtn.innerText = "Resend Again";
        },30000);
    }
}

// Attach event listener to the resend button
resendBtn.addEventListener("click", resendOtp);

// Function to extract Aadhaar ID from the URL
function getIdFromUrl() {
    const urlParts = window.location.pathname.split("/"); // Split the path
    return urlParts[urlParts.length - 1]; // Get the last part of the URL (ID)
}

// Handle OTP submission
async function submitOTP(event) {
    event.preventDefault(); // Prevent form default submission

    const otpSubmitBtn = document.querySelector("#otpSubmitBtn")
    otpSubmitBtn.disabled = true;
    otpSubmitBtn.textContent = "Requesting...";

    const aadhaarId = getIdFromUrl(); // Extract Aadhaar ID from the URL
    if (!aadhaarId) {
        alert("Aadhaar ID not found in URL.");
        return;
    }

    // Gather OTP digits
    const inputs = document.querySelectorAll(".otp-input input");
    const otp = Array.from(inputs)
        .map((input) => input.value)
        .join("");

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        alert("Please enter a valid 6-digit OTP.");
        return;
    }

    try {
        const aadhharInfo = JSON.parse(localStorage.getItem("aadhaarInfo"));
        const response = await fetch(`/api/verify/submit-aadhaar-otp/${aadhaarId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...aadhharInfo, otp }),
        });

        if (response.ok) {
            const data = await response.json();

            if (data.success) {
                alert("OTP Verified Successfully!");
                localStorage.clear();
                // Redirect or open the next page
                window.location.href = `/otp-success/${aadhaarId}`; // Replace `/next-page` with your actual URL
            } else {
                alert(data.message || "OTP verification failed.");
            }
        } else {
            alert("Failed to verify OTP. Please try again.");
        }
    } catch (error) {
        console.error("Error during OTP submission:", error);
        alert("An error occurred. Please try again later.");
    }finally {
        // Re-enable the button and reset its text
        otpSubmitBtn.disabled = false;
        otpSubmitBtn.textContent = "Submit";
    }
}

// Attach event listener to the form
document.getElementById("otpForm").addEventListener("submit", submitOTP);
