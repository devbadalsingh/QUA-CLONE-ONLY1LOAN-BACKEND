import axios from "axios";

export const BSA = async (formData) => {
    try {
        const response = await axios.post(
            "https://sm-bsa.scoreme.in/bsa/external/uploadBankStatementFiles",
            formData,
            {
                headers: {
                    ClientId: process.env.SCOREME_CLIENT_ID,
                    ClientSecret: process.env.SCOREME_CLIENT_SECRET,
                    // ...formData.getHeaders(), // Proper headers for FormData
                },
            }
        );
        if (response.data.responseCode === "SRS016") {
            return { success: true, message: response.data.responseMessage };
        }
        return {
            success: false,
            message: response.data.responseMessage,
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
