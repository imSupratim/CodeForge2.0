// import mongoose from "mongoose";
// import Question from "./models/Question.js";
// import { questions } from "./data/questions.js";
// import dotenv from "dotenv";

// dotenv.config()


// const seedQuestions = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI)

//     await Question.deleteMany()
//     await Question.insertMany(questions)

//     console.log("✅ Questions seeded successfully")
//     process.exit()
//   } catch (error) {
//     console.error("❌ Seeding failed", error)
//     process.exit(1)
//   }
// }

// seedQuestions()


import mongoose from "mongoose";
import Question from "./models/Question.js";
import { questions } from "./data/questions.js";
import dotenv from "dotenv";

dotenv.config();

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    let inserted = 0;
    let skipped = 0;

    for (const q of questions) {
      const exists = await Question.findOne({ title: q.title });

      if (exists) {
        skipped++;
        continue;
      }

      await Question.create(q);
      inserted++;
    }

    console.log("✅ Seeding complete");
    console.log(`➕ Inserted: ${inserted}`);
    console.log(`⏭️ Skipped (already exists): ${skipped}`);

    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed", error);
    process.exit(1);
  }
};

seedQuestions();
