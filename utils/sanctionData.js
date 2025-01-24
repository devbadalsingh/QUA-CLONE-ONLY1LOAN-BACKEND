import Sanction from "../models/Sanction.js";
import CamDetails from "../models/CAM.js";
import { dateFormatter, dateStripper } from "./dateFormatter.js";

export const getSanctionData = async (id) => {
    // Fetch Sanction and CAM details
    const sanction = await Sanction.findById(id).populate({
        path: "application",
        populate: [{ path: "applicant" }],
    });

    const camDetails = await CamDetails.findOne({
        leadId: sanction.application.lead,
    });

    if (!sanction) {
        throw new Error("Sanction not found");
    }

    // Stripping the time from the date to compare
    const sanctionDate = dateStripper(new Date());
    const disbursalDate = dateStripper(camDetails?.details.disbursalDate);

    // Date validation
    if (
        (sanction.sanctionDate && sanction.sanctionDate > disbursalDate) || // Strip time from `sanctionDate`
        sanctionDate > disbursalDate
    ) {
        throw new Error(
            "Disbursal Date cannot be in the past. It must be the present date or future date!"
        );
    }

    // Create a response object with all common fields
    const response = {
        sanctionDate: sanctionDate,
        title: "Mr./Ms.",
        fullname: `${sanction.application.applicant.personalDetails.fName}${
            sanction.application.applicant.personalDetails.mName &&
            ` ${sanction.application.applicant.personalDetails.mName}`
        }${
            sanction.application.applicant.personalDetails.lName &&
            ` ${sanction.application.applicant.personalDetails.lName}`
        }`,
        loanNo: `${sanction.loanNo}`,
        pan: `${sanction.application.applicant.personalDetails.pan}`,
        residenceAddress: `${sanction.application.applicant.residence.address}, ${sanction.application.applicant.residence.city}`,
        stateCountry: `${sanction.application.applicant.residence.state}, India - ${sanction.application.applicant.residence.pincode}`,
        mobile: `${sanction.application.applicant.personalDetails.mobile}`,
        loanAmount: `${new Intl.NumberFormat().format(
            camDetails?.details.loanRecommended
        )}`,
        roi: `${camDetails?.details.roi}`,
        disbursalDate: dateFormatter(camDetails?.details.disbursalDate),
        repaymentAmount: `${new Intl.NumberFormat().format(
            camDetails?.details.repaymentAmount
        )}`,
        tenure: `${camDetails?.details.eligibleTenure}`,
        repaymentDate: dateFormatter(camDetails?.details.repaymentDate),
        penalInterest: Number(camDetails?.details.roi) * 2,
        processingFee: `${new Intl.NumberFormat().format(
            camDetails?.details.netAdminFeeAmount
        )}`,
        // repaymentCheques: `${camDetails?.details.repaymentCheques || "-"}`,
        // bankName: `${bankName || "-"}`,
        bouncedCharges: "1000",
        annualPercentage: `${
            365 * Number(camDetails?.details?.roi) +
            Number(camDetails?.details?.adminFeePercentage)
        }%`,
    };

    return { sanction, camDetails, response };
};
