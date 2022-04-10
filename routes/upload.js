var express = require('express')
var app = express()

// post data form
app.get('/add', function(req, res, next){
	req.getConnection(function (error, conn){
		conn.query('SELECT * FROM detail ORDER BY id DESC', function(err, rows, fieds){
			res.render('upload/add',{
				title: 'Add New Data',
				name : '',
				longitude: '',
				latitude: '',
				date: ''
			})
		})
	})
})

// post data
app.post('/add', function(req, res, next){
	req.assert('name', 'name is required' ).notEmpty() 
	req.assert('longitude', 'longitude is required').notEmpty()
	req.assert('latitude', 'latitude is required').notEmpty()
	req.assert('date', 'date is required').notEmpty()
	var errors = req.validationErrors()
	if( !errors ) { 
		var	name = req.sanitize('name').escape().trim()
		var	longitude = req.sanitize('longitude').escape().trim()
		var	latitude = req.sanitize('latitude').escape().trim()
		var	date = req.sanitize('date').escape().trim()
		var	today = req.sanitize('date').escape().trim()
		var photo = String(req.sanitize('date').escape().trim())+'.jpg'
        photo = photo.replace(/-/g,'')
        photo = photo.replace(/:/g,'')
        photo = photo.replace(/ /g,'_')
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO detail (name, longitude, latitude, date, today, photo, count)'+
			'SELECT ?,?,?,?,?,?,coalesce(max(count), 0 )+1 '+
			'FROM detail '+
			'WHERE name=?',[name, longitude, latitude, date, today, photo, name], function(err, result) {
				if (err) {
					req.flash('error', err)
					res.render('upload/add', {
						title: 'Add New Data',
						name : '',
						longitude: '',
						latitude: '',
						date: ''
					})
				}else {
					req.flash('success', 'Data added successfully!')
					res.render('upload/add', {
						title: 'Add New Data',
						name : '',
						longitude: '',
						latitude: '',
						date: ''
					})
				}
			})
		})
	}
	else {
		var error_msg = ''
			errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		res.render('upload/add', {
			title: 'Add New Data',
			name: req.body.name,
			longitude: req.body.longitude,
			latitude: req.body.latitude,
			date: req.body.date
		})
	}
})

// post Image form
app.get('/image', function(req, res, next){
	req.getConnection(function (error, conn){
		conn.query('SELECT * FROM detail ORDER BY id DESC', function(err, rows, fieds){
			res.render('upload/image',{
				title: 'Add Image',
				photo: ''
		})
		})
	})
})

// post Image
app.post('/image', function(req, res, next){
	let imageFile
	let uploadPath
	var errors = req.validationErrors()
	if( !errors ) { 
		imageFile = req.files.imageFile
		console.log(imageFile)
		uploadPath = 'C:/Users/a7032/AndroidStudioProjects/107_Yuntech/web_server/public/upload/' + imageFile.name
		imageFile.mv(uploadPath, function (erron) {
			if (erron) return res.status(500).send(erron)
			req.getConnection(function(error, conn) {
				conn.query('INSERT INTO detail SET photo = ? ', [imageFile.name],
				function(err, result) {
					if (err) {
						req.flash('error', err)
						res.render('upload/image', {
							title: 'Add Image',
							photo: ''
						})
					}else {
						req.flash('success', 'Data added successfully!')
						res.render('upload/image', {
							title: 'Add Image',
							photo: ''
						})
					}
				})
			})
		})
	}
	else {
		var error_msg = ''
			errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		res.render('upload/image', {
			title: 'Add Image',
			photo: req.body.image
		})
	}
})

module.exports = app