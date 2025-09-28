// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     panNumber: { type: String, required: true },
//     idImagePath: { type: String }, // keep optional — multer will set it
//   },
//   { timestamps: true }
// );



// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", userSchema);
// export default User;


import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    panNumber: {
      type: String,
      required: true,
    },
    kycDoc: {
      type: String, // path or URL to uploaded ID (jpg/pdf)
    },

    // Virtual wallet (₹100,000 initial balance)
    wallet: {
      type: Number,
      default: 100000,
    },

    // Holdings (portfolio)
    holdings: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        units: { type: Number, default: 0 },
        avgPrice: { type: Number, default: 0 },
        invested: { type: Number, default: 0 },
      },
    ],

    // Watchlist
    watchlist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    ],
  },
  { timestamps: true }
);

// Password hashing before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
