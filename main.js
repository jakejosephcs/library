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
    let readStatus;
    let successOrDanger;
    if (book.read) {
        readStatus = "YES";
        successOrDanger = "success";
    } else {
        readStatus = "NO";
        successOrDanger = 'danger';
    }
    tableBody.innerHTML += `
        <td>${book.author}</td>
        <td>${book.title}</td>
        <td>${book.pages}</td>
        <td><button type="button" class="change${book.id} btn btn-${successOrDanger} btn-sm">${readStatus}</button></td>
        <td><button type="button" class="del${book.id} btn btn-warning btn-sm">X</button></td>
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

function changeReadStatus(index) {
    bookList.forEach(book => {
        if (book.id == index.slice(6)) toggleReadStatus(index)
    })
}

function toggleReadStatus(index){
    let readStatusBtn = document.querySelector(`.${index}`);
    if (readStatusBtn.classList.contains('btn-success')) {
        readStatusBtn.classList.remove('btn-success');
        readStatusBtn.classList.add('btn-danger');
        readStatusBtn.textContent = 'NO';
        bookList[index.slice(6)-1].read = false;
    } else {
        readStatusBtn.classList.remove('btn-danger');
        readStatusBtn.classList.add('btn-success');
        readStatusBtn.textContent = 'YES';
        bookList[index.slice(6)-1].read = true;
    }
    
}

function deleteBookEntry(index){
    bookList.forEach(book => {
        if (book.id == index.slice(3)){
            bookList.splice(index.slice(3)-1, 1)
        }
    })
    
}

function refreshBookList(){
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = "";
    let readStatus;
    let successOrDanger;
    bookList.forEach(book => {
        if (book.read) {
            readStatus = "YES";
            successOrDanger = "success";
        } else {
            readStatus = "NO";
            successOrDanger = 'danger';
        }
        tableBody.innerHTML += `
            <td>${book.author}</td>
            <td>${book.title}</td>
            <td>${book.pages}</td>
            <td><button type="button" class="change${book.id} btn btn-${successOrDanger} btn-sm">${readStatus}</button></td>
            <td><button type="button" class="del${book.id} btn btn-warning btn-sm">X</button></td>
        `
    })
}

// EVENT: Hide add new book form
hideFormBtn.addEventListener('click', () => {
    form.classList.toggle('hide');
})

// EVENT: Show add new book form
addNewBookBtn.addEventListener('click', () => {
    form.classList.toggle('hide');
})


// EVENT: Delete or Change Status of book from reading list
document.querySelector('.book-list').addEventListener('click', (e) => {
    if (e.target.classList[2] == 'btn-warning') {
        deleteBookEntry(e.target.classList[0]);
        refreshBookList()
    }else {
        changeReadStatus(e.target.classList[0])
    }
})
