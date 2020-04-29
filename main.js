const form = document.querySelector('form');

const addToLibraryBtn = document.querySelector('#addToLibrary');
const hideFormBtn = document.querySelector('#hideForm');
const addNewBookBtn = document.querySelector('#addNewBook')

const container = document.querySelector('.container');

let bookList = []

function checkFormInput(author, title, pages, read) {
    if (author == '' || title == '' || pages == '') {
        return true;
    }
    return false;
}

function showAlert(message, className){
    const alertMessage = document.createElement('div');
    alertMessage.textContent = message
    alertMessage.classList.add('alert', `alert-${className}`, 'bg-danger', 'mb-2', 'text-center')
    container.insertBefore(alertMessage, form);
    // Remove after 3s
    setTimeout(() => document.querySelector('.alert').remove(), 2000)
}

class Books{
    constructor(author, title, pages, read){
        this.author = author;
        this.title = title;
        this.pages = pages;
        this.read = read;
    }
}

function addBookToList(book) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML += `
        <td>${book.author}</td>
        <td>${book.title}</td>
        <td>${book.pages}</td>
        <td><button type="button" class="read read${book.id} btn btn-success btn-sm">YES</button></td>
        <td><button type="button" class="read read${book.id} btn btn-warning btn-sm">X</button></td>
    `
}


addToLibraryBtn.addEventListener('click', () => {
    // Get book information
    const author = document.querySelector('#author').value;
    const title = document.querySelector('#title').value;
    const pages = document.querySelector('#numOfPages').value;
    const read = document.querySelector('#read').checked;

    if (checkFormInput(author, title, pages, read)) {
        showAlert("Please Fill out the Form Properly", "danger")
        return;
    }

    const book = new Books(author, title, pages, read)

    bookList.push(book);

    bookList.forEach((book,i) => book.id = i + 1);

    addBookToList(book);

    form.reset();

})

// EVENT: Hide add new book form
hideFormBtn.addEventListener('click', () => {
    form.classList.toggle('hide');
})

// EVENT: Show add new book form
addNewBookBtn.addEventListener('click', () => {
    form.classList.toggle('hide');
})

// EVENT: Change read status of book
document.querySelector('.book-list').addEventListener('click', (e) => {
    console.log(e.target);
})

// EVENT: Delete book from reading list