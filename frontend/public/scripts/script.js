// character limit
const MAX_INPUT_LENGTH = 80;

// listens for add button click
const attachAddBtnListener = () => {
	const addBtn = document.getElementById('addButton');
	addBtn.addEventListener('click', addListItem);
};

// listens for clear button click
const attachClearBtnListener = () => {
	const clearBtn = document.getElementById('clearFilters');
	clearBtn.addEventListener('click', clearFilters);
};

// executes these functions on page load
window.onload = () => {
	attachAddBtnListener();
	attachClearBtnListener();
	getPostsByID();
	// document.getElementById("getPosts").addEventListener("click", getPosts);
	document.getElementById('getPostsID').addEventListener('click', getPostsByID);
};

/*
 *   renders the <li> item child under <div id="list">
 *   renders deconste <button> used to hide <div id="list">
 *   renders hidden <button> used to modify changes to <p>
 *   clears <input> after clicking ok
 */
const addListItem = () => {
	const inputText = truncateText(getInputText('inputTask'), MAX_INPUT_LENGTH); // grabs input text
	const li = createListItem(); // creates <li> element
	createDelBtn(li); // renders <button> used to delete <li>
	createChngBtn(li, inputText); // renders <button> used to modify <p>

	// if nothing was inputted...
	if (inputText === '') {
		alert('Enter something...');
	} else {
		// else add and render the <li> to the <div id="list">
		document.getElementById('list').appendChild(li); // append <li> to <div id="list">
		addTodoItem(inputText); // adds todo item to the database
		getPostsByID(); // gets all todo items from the database
		clearInputText();
	}
};

// gets input
const getInputText = (element) => {
	return document.getElementById(element).value.trim();
};

// clears input
const clearInputText = () => {
	document.getElementById('inputTask').value = '';
};

// create <li>
const createListItem = () => {
	const li = document.createElement('li');
	li.className = 'list-group-item bg-light';
	return li;
};

/*
 *   @element, the parent element (<li> in this case)
 *   renders the <button> element and appends it to <li>.
 *   clicking the <button> will hide <li> from the list
 */
const createDelBtn = (element) => {
	const button = document.createElement('button'); // create <button>
	button.textContent = 'delete'; // button's text
	button.className = 'float-right btn btn-danger';
	element.appendChild(button); // append it to the parent element

	// handles deconste functionality of the deconste button
	button.onclick = function() {
		const div = this.parentElement; // <li> is the parent
		div.style.display = 'none'; // hides <li>
		deleteTodoItem(element.getAttribute('data-id')); // send HTTP delete request to server
	};
};

/*
 *   @element, the parent element (<li> in this case)
 *   @text, the text to be displayed in <p>
 *   renders the <p> element and appends it to <li>.
 *   clicking <p> will create an <input> field and
 *   remove this element and displays the ok button.
 */
const createP = (element, text) => {
	const p = document.createElement('p'); // creates <p>
	p.textContent = text; // sets the text content
	element.appendChild(p); // append it to the parent element
};

/*
 *   @element, the parent element (<li> in this case)
 *   @text, the text to be displayed in <input>
 *   renders the <input> and removes <p>
 */
const createInput = (element, text) => {
	const input = document.createElement('input'); // creates <input>
	input.placeholder = text; // sets placeholder text
	input.maxLength = MAX_INPUT_LENGTH; // limits input length
	element.appendChild(input); // append it to the parent element
};

/*
 *   @element, the parent element (<li> in this case)
 *   @text, the text to be displayed in <button>
 *   renders the ok <button>
 *   clicking the button will hide this <button>,
 *   the <input>, and renders <p>
 */
const createChngBtn = (element, text) => {
	const button = document.createElement('button'); // create <button>
	button.textContent = 'edit'; // sets the text content
	button.className = 'float-right btn btn-secondary';
	element.appendChild(button); // append it to the parent element
	createP(element, text); // creates and puts text into <p>
	let isEdit = false; // handles what state the <button> is in

	button.onclick = function() {
		if (isEdit === false) {
			const currentP = element.querySelector('p'); // search for <p> inside <li>
			createInput(element, currentP.textContent); // renders <input>
			currentP.remove(); // remove <p> from <li>
			button.textContent = 'save'; // change <button> text
			isEdit = true;
		} else if (isEdit === true) {
			const inputText = element.querySelector('input'); // search for <input> inside <li>
			if (inputText.value.length === 0) {
				// if nothing was entered in input
				alert('enter text...');
			} else {
				createP(element, inputText.value); // renders the <p> with text from <input>
				inputText.remove(); // remove <input> from <li>
				button.textContent = 'edit'; // change <button> text
				updateTodoItem(element.getAttribute('data-id'), inputText.value); // updates the todo item
				isEdit = false;
			}
		}
	};
};

/*
 * function to filter <li> (non-case sensitive)
 */
const filterList = () => {
	const inputText = getInputText('inputFilter'); // grabs input text
	const inputTextUpperCase = inputText.toUpperCase(); // changes input to upper case
	const list = document.getElementById('list'); // gets our <div> list
	const li = list.getElementsByTagName('li'); // grabs the <li>
	let p, txtValue;

	// loop through all <li>
	for (let i = 0; i < li.length; i++) {
		p = li[i].querySelector('p'); // grabs first instance of <p> in <li>
		txtValue = p.textContent || p.innerText; // grabs text from <p>
		if (txtValue.toUpperCase().indexOf(inputTextUpperCase) > -1) {
			// finding txtValue or a substring of txtValue
			li[i].style.display = ''; // display matching items
		} else {
			li[i].style.display = 'none'; // hide non-matching items
		}
	}
};

// clear the filter input
const clearFilters = () => {
	document.getElementById('inputFilter').value = ''; // clears text inputFilter
	const list = document.getElementById('list'); // gets our <div> list
	const li = list.getElementsByTagName('li'); // grabs the <li>

	// loop through and display all <li>
	for (let i = 0; i < li.length; i++) {
		li[i].style.display = '';
	}
};

/*
 *   @text, the text to be trimmed
 *   @maxLength, the maximum number of characters
 *   returns the text trimmed down to the maxLength
 */
const truncateText = (text, maxLength) => {
	if (text.length > maxLength) {
		// if text length is greater than maxLength
		text = text.substr(0, maxLength); // trim the text
	}
	return text;
};

/*
 *   @text, the text to be displayed in html
 *   sets the error text in the html
 */
const setErrorMsg = (text) => {
	alert(text);
};

// function to handle error handling in HTTP requests
const checkStatus = (res) => {
	if (res.ok) {
		return res.json();
	} else {
		let err = new Error(res.status + ' ' + res.statusText);
		err.response = res;
		throw err;
	}
};

// function to clear <li>'s from list
const clearList = () => {
	const list = document.getElementById('list');
	const li = list.getElementsByTagName('li');

	while (li.length > 0) {
		list.removeChild(li[0]);
	}
};

/*
 *   @text, the text of the todo item
 *   @id, the id of of the item stored in data-id
 *   function used to render list and buttons from DB
 */
const addListeItemFromDB = (text, data_id) => {
	const inputText = truncateText(text, MAX_INPUT_LENGTH); // grabs input text
	const li = createListItem(); // creates <li> element
	li.setAttribute('data-id', data_id);
	createDelBtn(li); // renders <button> used to delete <li>
	createChngBtn(li, inputText); // renders <button> used to modify <p>

	document.getElementById('list').appendChild(li); // append <li> to <div id="list">
};

const url = 'http://localhost:5000/list/';

// // gets all todo items from the database
// const getPosts = () => {
//   clearList();

//   fetch(url, {
//     method: "GET"
//   })
//     .then(checkStatus)
//     .then(res => {
//       // renders the list items, and stores the ID in a data attribute
//       for (let i = 0; i < res.length; i++) {
//         addListeItemFromDB(res[i].todo, res[i]._id);
//         // globalList[i] = res[i].todo; // populate client side list of todo items
//       }
//     })
//     .catch(error => {
//       setErrorMsg(`${error}`);
//     });
// };

// gets all todo items with a specific ID
const getPostsByID = () => {
	clearList();

	fetch('http://localhost:5000/list/1', {
		/* !! DYNAMICALLY GO TO USER'S TODO LIST !! */
		method: 'GET'
	})
		.then(checkStatus)
		.then((res) => {
			// renders the list items, and stores the ID in a data attribute
			for (let i = 0; i < res.length; i++) {
				addListeItemFromDB(res[i].todo, res[i]._id);
			}
		})
		.catch((error) => {
			setErrorMsg(`${error}`);
		});
};

/*
 * @text, the text of the todo item
 * Create a new todo item in the database when 'add' is clicked
 */
const addTodoItem = (text) => {
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({ todo: text })
	})
		.then(checkStatus)
		.then((res) => {
			console.log('Post request success: ', res);
		})
		.catch((error) => {
			setErrorMsg(`${error}`);
		});
};

/*
 * @id, the id of the todo item from the database
 * @text, the text of the todo item from the database
 * Updates a todo item with given ID when saved' is clicked
 */
const updateTodoItem = (id, text) => {
	fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			id: id,
			todo: text
		})
	})
		.then(checkStatus)
		.then((res) => {
			console.log('Update successful: ', res);
		})
		.catch((error) => {
			setErrorMsg(`${error}`);
		});
};

/*
 * @id, the id of the todo item from the database
 * Deletes todo item with matching ID when 'delete' is clicked
 */
const deleteTodoItem = (id) => {
	fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({ id: id })
	})
		.then(checkStatus)
		.then((res) => {
			console.log('Delete successful: ', res);
		})
		.catch((error) => {
			setErrorMsg(`${error}`);
		});
};