const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.method("toClient", function () {
  var obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.updatedAt;
  delete obj.password;

  return obj;
});

userSchema.pre("save", async function (next) {
  //if only another field is modified, then the password shoud remain the same. Otherwise, the user won't be able to authenticate next time.
  this.email = this.email.toLowerCase();

  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
