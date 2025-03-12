const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Todo = require('../models/todo');
const router = express.Router();

// middleware to check if user is logged in (ran before user is directed to their profile)
const isLoggedIn = (req, res, next) => {
	if (!req.user) {
		// if user is not logged in
		res.redirect('/auth/login');
	} else {
		// if user is logged in
		next();
	}
};

// Route: Renders the to-do-list page
router.get('/', isLoggedIn, (req, res) => {
	res.render('list', { user: req.user });
});

// Route: get todo items with the ID
router.get('/:userId', (req, res) => {
	const id = req.user._id;

	// find a todo item given the _id
	Todo.find({ userId: id })
		.exec()
		.then((data) => {
			console.log(data);
			res.status(200).json(data);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

// Route: creates a todo item
router.post('/', (req, res) => {
	// creates a new Todo object in the database
	const todo = new Todo({
		_id: new mongoose.Types.ObjectId(),
		todo: req.body.todo,
		userId: req.user._id
	});

	// saving the new todo item to the database
	todo
		.save() // stores in db
		.then((data) => {
			console.log(data);
			res.status(201).json({
				msg: 'POST request SUCCESS creating a todo item',
				createdTodo: data
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

// Route: updates a single todo item
router.patch('/', (req, res) => {
	// store the request _id and todo
	const id = req.body.id;
	const todo = req.body.todo;

	// updates the todo item using the _id and todo from the request
	Todo.updateOne({ _id: id }, { todo: todo })
		.exec()
		.then((data) => {
			console.log(data);
			res.status(200).json(data);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

// Route: deletes a single todo item
router.delete('/', (req, res) => {
	// store the request _id
	const id = req.body.id;

	// deletes the todo item using the _id from the request
	Todo.deleteOne({ _id: id })
		.exec()
		.then((data) => {
			console.log(data);
			res.status(200).json(data);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

module.exports = router;