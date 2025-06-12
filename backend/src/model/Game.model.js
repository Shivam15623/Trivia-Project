import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔄 Dynamic category count validation based on template
gameSchema.pre("validate", async function (next) {
  if (this.categories?.length) {
    try {
      if (this.categories.length !== 6) {
        return next(
          new Error(
            `This game must have exactly ${template.numberOfCategories} categories as per the template.`
          )
        );
      }
    } catch (err) {
      return next(err);
    }
  }

  next();
});

const Game = mongoose.model("Game", gameSchema);
export default Game;
