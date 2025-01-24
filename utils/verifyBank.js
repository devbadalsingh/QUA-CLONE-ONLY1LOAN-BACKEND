import axios from "axios";

export const verifyBank = async (beneficiaryName, bankAccNo, ifscCode) => {
    try {
        let data = {
            accNo: `${bankAccNo}`,
            ifsc: `${ifscCode}`,
            benificiaryName: `${beneficiaryName}`,
        };

        const response = await axios.post(
            "https://api.digitap.ai/penny-drop/v2/check-valid",
            data,
            {
                headers: {
                    Authorization: process.env.DIGITAP_AUTH_KEY,
                    "Content-type": "application/json",
                },
            }
        );

        if (response.data.model.status === "SUCCESS") {
            return { success: true };
        }

        return { success: false, message: "Bank couldn't be verified!!" };
    } catch (error) {
        console.log({ status: error.status, message: error.message });
        return { status: error.status, success: false, message: error.message };
    }
};

// export const verifyBank = async (beneficiaryName, bankAccNo, ifscCode) => {
//     try {
//         let data = {
//             accNo: `${bankAccNo}`,
//             ifsc: `${ifscCode}`,
//             benificiaryName: `${beneficiaryName}`,
//         };
//         console.log("verify bank",data)

//         // const options = {
//         //     method: "POST",
//         //     url: "https://api.digitap.ai/penny-drop/v2/check-valid",
//         //     data: {
//         //         accN: `${bankAccNo}`,
//         //         ifsc: `${ifscCode}`,
//         //         benificiaryName: `${beneficiaryName}`,
//         //     },
//         //     headers: {
//         //         "Content-type": "application/json",
//         //         Authorization: process.env.DIGITAP_AUTH_KEY,
//         //     },
//         // };

//         const response = await axios.post(
//             "https://api.digitap.ai/penny-drop/v2/check-valid",
//             data,
//             {
//                 headers: {
//                     Authorization: process.env.DIGITAP_AUTH_KEY,
//                     "Content-type": "application/json",
//                 },
//             }
//         );

//         console.log('res',response.data.model)

//         if (response.data.model.status === "SUCCESS") {
//             return { success: true };
//         }

//         return { success: false, message: "Bank couldn't be verified!!" };
//     } catch (error) {
//         console.log({ status: error.status, message: error.response.data });
//         return { status: error.status, success: false, message: error.message };
//     }
// };
