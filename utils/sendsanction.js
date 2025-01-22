import axios from "axios";
import { htmlToPdf } from "./htmlToPdf.js";
import { formatFullName } from "./nameFormatter.js";
import FormData from "form-data";
import { sanctionLetter } from "./sanctionLetter.js";
import {
    initiate,
    eSignStepTwo,
    eSignStepThree,
    eSignStepFour,
} from "../Controllers/eSignController.js";

const apiKey = process.env.ZOHO_APIKEY;

export const generateSanctionLetter = async (
    subject,
    sanctionDate,
    title,
    loanNo,
    fullname,
    mobile,
    residenceAddress,
    stateCountry,
    camDetails,
    lead,
    docs,
    recipientEmail
) => {
    try {
        const htmlToSend = sanctionLetter(
            sanctionDate,
            title,
            fullname,
            loanNo,
            lead.pan,
            mobile,
            residenceAddress,
            stateCountry,
            camDetails
        );

        // Convert the HTML to PDF
        const result = await htmlToPdf(docs, htmlToSend, "sanctionLetter");

        // Create form-data and append the PDF buffer
        const formData = new FormData();
        formData.append("files", Buffer.from(result.pdfBuffer), {
            filename: `sanction_${fullname}.pdf`,
            contentType: "application/pdf",
        });

        const stepOne = await initiate(formData);
        console.log("referenceId: ", stepOne.data.referenceId);

        const stepTwo = await eSignStepTwo(stepOne.data.referenceId);
        console.log("StepTwo: ", stepTwo);

        const fullName = formatFullName(lead.fName, lead.mName, lead.lName);
        console.log("Full Name: ", fullName);

        const stepThree = await eSignStepThree(
            lead._id.toString(),
            `${fullName}`,
            lead.aadhaar,
            stepTwo.data.file.directURL
        );
        console.log("StepThree: ", stepThree);

        const stepFour = await eSignStepFour(stepThree.data.referenceId);
        console.log("StepFour: ", stepFour);

        // Setup the options for the ZeptoMail API
        const options = {
            method: "POST",
            url: "https://api.zeptomail.in/v1.1/email",
            headers: {
                accept: "application/json",
                authorization: `Zoho-enczapikey PHtE6r1eFL/rjzF68UcBsPG/Q8L1No16/b5jKgkU44hBCPMFS00Eo49/xjO/ohkqU6JBRqTJy45v572e4u/TcWflNm1JWGqyqK3sx/VYSPOZsbq6x00etVkdd03eVoLue95s0CDfv9fcNA==`,
                "cache-control": "no-cache",
                "content-type": "application/json",
            },
            data: JSON.stringify({
                from: { address: "info@only1loan.com" },
                to: [
                    {
                        email_address: {
                            address: recipientEmail,
                            name: fullname,
                        },
                    },
                ],
                subject: subject,
                htmlbody: `<p>
                        Please verify and E-sign the sanction letter to
                        acknowledge.${" "}
                            ${stepFour.data.result.url}
                    </p>`,
                // htmlbody: htmlToSend,
            }),
        };

        // Make the request to the ZeptoMail API
        const response = await axios(options);
        if (response.data.message === "OK") {
            return {
                success: true,
                message: "Sanction letter sent successfully",
            };
        }
        return {
            success: false,
            message: "Failed to send email",
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: `"Error in ZeptoMail API" ${error.message}`,
        };
    }
};
