import Counter from "../models/Counter.js";

export async function nextSequence(sequenceName, prefix, padding) {
    const updatedCounter = await Counter.findOneAndUpdate(
        { sequenceName },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
    );
    const sequenceNumber = String(updatedCounter.sequenceValue).padStart(
        padding,
        "0"
    );

    return `${prefix}${sequenceNumber}`;
}