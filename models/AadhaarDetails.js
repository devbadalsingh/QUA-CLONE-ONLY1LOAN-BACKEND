import mongoose from "mongoose";

const aadhaarSchema = new mongoose.Schema(
    {
        details: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
);

const AadhaarDetails = mongoose.model("AadhaarDetails", aadhaarSchema);
export default AadhaarDetails;
