import axios from "axios";

const apiKey = process.env.ZOHO_APIKEY;

async function sendEmail(recipient, recipientName, subject,link) {
    try {
        const options = {
            method: "POST",
            url: "https://api.zeptomail.in/v1.1/email",
            headers: {
                accept: "application/json",
                authorization:
                    "Zoho-enczapikey PHtE6r1bFL3rjGJ5oRUH7KO6FcajPNwqqONmKVFP5osQCv5STk1T+Y8okzbmqxh/A6NLEv6ezdpr57jIt+iHJme4Zj5EDWqyqK3sx/VYSPOZsbq6x00Zs1seck3aVY7metVt1iXTvdzcNA==",
                "cache-control": "no-cache",
                "content-type": "application/json",
            },
            data: JSON.stringify({
                from: { address: "info@namanfinlease.com" },
                to: [
                    {
                        email_address: {
                            address: recipient,
                            name: recipientName,
                        },
                    },
                ],
                subject: subject,
                htmlbody: `<p>To verify your aadhaar click on <strong>${link}</strong>.</p>`,
            }),
        };

        const response = await axios(options);

        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error("Error sending email", error.message);
    }
}

export default sendEmail;
