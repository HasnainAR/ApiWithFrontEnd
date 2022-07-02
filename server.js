const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const User2 = require('./model/user2')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express()
const ejs = require('ejs')
const { text } = require('body-parser')

app.set('view engine' , 'ejs');


const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

mongoose.connect('mongodb://localhost:27017/videoaza', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})
var users = User2.find({});




app.get('/ToDo',function(req, res, next){
	users.exec(function(err,data){
		if(err) throw err;
		res.render('ToDo',
			{records:data}
			
		)
		
	})
	
	
		


	})
	



app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

// app.get("/background123.jpg", function(req, res){
// 	res.writeHead(200, {'Content-Type': 'image/jpg'});
// 	res.end("background123.jpg");
//   })

app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)
		

		return res.json({ status: 'ok', data: token })
		
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})

app.post('/api/ToDo', async (req, res) => {
	const { text,text2,number} = req.body


	try {
		const response = await User2.create({
			text,
			text2,
			number
			
		})
		console.log('Data Successfully created: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})

app.get('/delete/:id',function(req,res,next){
	var id = req.params.id;
	var del= User2.findByIdAndDelete(id);
	del.exec(function(err){
		if(err) throw err;
		res.redirect("/ToDo");
	})

})
app.get('/edit/:id',function(req, res, next){
	var id = req.params.id;
	var edit= User2.findById(id);

	edit.exec(function(err,data){
		if(err) throw err;
		res.render('edit',
			{records:data}
		)
	})

		


	})
app.listen(9999, () => {
	console.log('Server up at 9999')
})
