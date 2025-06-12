import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Assuming you are linking to a category schema
  },
  answer: {
    type: String,
    required: true, // Correct answer from the options
  },
  options: {
    type: [String],
    required: true, // Ensure at least some options exist
    validate: {
      validator: function (value) {
        return value.length === 4; // Ensure exactly 4 options
      },
      message: "There must be exactly 4 options.",
    },
  },
  points: {
    type: Number,
    enum: [200, 400, 600],
    required: true,
  },
  questionImage: {
    type: String, 
  },
  answerImage: {
    type: String, 
  },
});
const Question = mongoose.model("Question", questionSchema);
export default Question;
