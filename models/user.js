const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.set('toJSON', {
	transform: function (doc, ret) {
		ret.id = ret._id.toString()
		delete ret._id
		delete ret.__v
	},
})


module.exports = mongoose.model('User', userSchema);
