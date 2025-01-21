import mongoose from 'mongoose'

const counterSchema = new mongoose.Schema({
    sequenceName: { type: String, required: true, unique: true },
    sequenceValue: { type: Number, required: true }
})


const Counter = mongoose.model("Counter", counterSchema)

export default Counter