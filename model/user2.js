const mongoose = require('mongoose')


const UserSchema2 = new mongoose.Schema(
	{
		
		
		 text: { type: String, required: true },
		 text2:{ type: String,required: true},
		 number:{type: Number ,required:true}
		

	},
	{ collection: 'users2' }
)



const model2 = mongoose.model('UserSchema2', UserSchema2)

module.exports = model2
