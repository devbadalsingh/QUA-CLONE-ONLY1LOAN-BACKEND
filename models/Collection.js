import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
    pan: {
        type: String,
        required: true,
        unique: true,
        sparse:true,
    },
    disbursal: { type: mongoose.Schema.Types.ObjectId, ref: "Disbursal" },
    isDisbursed: { type: Boolean, default: false },
    loanNo: { type: String, required: true },
});
