import handlebars from "handlebars";
import * as fs from "fs";
import path from "path";
import { dateFormatter } from "./dateFormatter.js";
import { fileURLToPath } from "url";

export function sanctionLetter(
    sanctionDate,
    title,
    fullname,
    loanNo,
    pan,
    mobile,
    residenceAddress,
    stateCountry,
    camDetails
) {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(__dirname, "../config/sanction.html");
        const source = fs.readFileSync(filePath, "utf-8").toString();
        const template = handlebars.compile(source);

        let replacements = {
            sanctionDate: `${sanctionDate}`,
            title: `${title}`,
            fullname: `${fullname}`,
            loanNo: `${loanNo}`,
            pan: `${pan}`,
            residenceAddress: `${residenceAddress}`,
            stateCountry: `${stateCountry}`,
            mobile: `${mobile}`,
            loanAmount: `${new Intl.NumberFormat().format(
                camDetails?.details.loanRecommended
            )}`,
            roi: `${camDetails?.details.roi}`,
            disbursalDate: dateFormatter(camDetails?.details.disbursalDate),
            repaymentAmount: `${new Intl.NumberFormat().format(
                camDetails?.details.repaymentAmount
            )}`,
            tenure: `${camDetails?.details.eligibleTenure}`,
            totalInterest: `${new Intl.NumberFormat().format(
                Number(camDetails?.details.repaymentAmount) -
                    Number(camDetails?.details.loanRecommended)
            )}`,
            repaymentDate: dateFormatter(camDetails?.details.repaymentDate),
            penalInterest: Number(camDetails?.details.roi) * 2,
            processingFee: `${new Intl.NumberFormat().format(
                camDetails?.details.netAdminFeeAmount
            )}`,
            disbursalAmount: `${new Intl.NumberFormat().format(
                camDetails?.details.netDisbursalAmount
            )}`,
            // repaymentCheques: `${camDetails?.details.repaymentCheques || "-"}`,
            // bankName: `${bankName || "-"}`,
            bouncedCharges: "1000",
            annualPercentage: `${
                365 * Number(camDetails?.details?.roi) +
                Number(camDetails?.details?.adminFeePercentage)
            }`,
        };

        let htmlToSend = template(replacements);

        // footer =
        //     "https://publicramlella.s3.ap-south-1.amazonaws.com/public_assets/Footer.jpg";
        // header =
        //     "https://publicramlella.s3.ap-south-1.amazonaws.com/public_assets/Header.jpg";

        return htmlToSend;
    } catch (error) {
        return {
            success: false,
            message: `"Error in adding the template" ${error.message}`,
        };
    }
}
