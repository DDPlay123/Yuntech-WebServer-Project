var express = require('express')
var app = express()

// show list of my data
app.get('/list', function(req, res, next) {
	req.getConnection(function(error,conn) {
	conn.query('SELECT * FROM detail ORDER BY id DESC',function(err, rows, fields) {
		if (err) {
			req.flash('error', err)
				res.render('web/list', {
					title: 'List All Data',
					data: ''
				})
		} else {
            // render to views/web/list.ejs 
			res.render('web/list', {
				title: 'List All Data',
				data: rows
			})
		}
	})
	})
})

// show list of today of my data
app.get('/day', function(req, res, next) {
	req.getConnection(function(error,conn) {
	conn.query('SELECT * FROM detail WHERE today = date(curdate())',function(err, rows, fields) {
		if (err) {
			req.flash('error', err)
				res.render('web/day', {
					title: 'List Today Data',
					data: ''
				})
		} else {
            // render to views/web/day.ejs 
			res.render('web/day', {
				title: 'List Today Data',
				data: rows
			})
		}
	})
	})
})

// show list of week of my data
app.get('/week', function(req, res, next) {
	req.getConnection(function(error,conn) {
	conn.query('SELECT * FROM detail WHERE yearweek(`today`,0) =yearweek(curdate())',function(err, rows, fields) {
		if (err) {
			req.flash('error', err)
				res.render('web/week', {
					title: 'List Week Data',
					data: ''
				})
		} else {
            // render to views/web/week.ejs
			res.render('web/week', {
				title: 'List Week Data',
				data: rows
			})
		}
	})
	})
})

// delete data
app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }
	console.log(user)
	req.getConnection(function(error, conn) {
        // file removed
		conn.query('SELECT photo FROM detail WHERE id = ' + req.params.id,function(err, rows){
			rows.forEach(function(img){
				const fs = require('fs')
				const path = 'C:/Users/a7032/AndroidStudioProjects/107_Yuntech/web_server/public/upload/'+ img.photo
				console.log(path + 'got it')
				fs.unlink(path, (err) => {
					if (err) {
						console.error(err)
					    return
					}
					else {
                        console.log(img.photo + 'deleted')
                    }
				})
			})
		})
		conn.query('DELETE FROM detail WHERE id = ' + req.params.id, user,function(err, result) {
			if (err) {
				req.flash('error', err)
                // redirect to web list page
				res.redirect('/web/list')
			} else {
				req.flash('success', 'User deleted successfully! id = ' +req.params.id)
                // redirect to web list page
				res.redirect('/web/list')
	        }
        })
    })
})

//display Map
app.get('/map', function(req, res, next){
	req.getConnection(function(error,conn) {
		conn.query('SELECT * FROM detail ORDER BY id DESC',function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
					res.render('web/map', {
						title: 'Show map',
						data: ''
					})
			} else {
           		// render to views/web/list.ejs 
				res.render('web/map', {
					title: 'Show map',
					data: rows
				})
			}
		})
	})
})

app.get('/map/(:id)', function(req, res, next){
	req.getConnection(function(error,conn) {
		conn.query('SELECT * FROM detail WHERE id = ' + req.params.id, function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
					res.render('web/map', {
						title: 'Show map',
						data: ''
					})
			} else {
           		// render to views/web/list.ejs 
				res.render('web/map', {
					title: 'Show map',
					data: rows
				})
			}
		})
	})
})

module.exports = app