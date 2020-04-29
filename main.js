const form = document.querySelector('form');
const addToLibraryBtn = document.querySelector('#addToLibrary');
const hideFormBtn = document.querySelector('#hideForm');
const addNewBookBtn = document.querySelector('#addNewBook')

let bookList = []

let BOOKS = (function() {
    const changeReadStatus = function(index) {
        bookList.forEach(book => {
            if (book.id == index.slice(6)) toggleReadStatus(index)
        })
    };

    const toggleReadStatus = function(index) {
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
    };

    const reAssignIds = function() {
        bookList.forEach((book,i) => book.id = i + 1);
    }

    return {
        changeReadStatus,
        reAssignIds
    }
    
})();

let UI = (function() {
    const checkFormInput = function(author, title, pages) {
        if (author == '' || title == '' || pages == '') {
            return true;
        }
        return false;
    };

    const showAlert = function(message, className) {
        const alertMessage = document.createElement('div');
        const container = document.querySelector('.container');
        alertMessage.textContent = message
        alertMessage.classList.add('alert', `alert-${className}`, 'bg-danger', 'mb-2', 'text-center')
        container.insertBefore(alertMessage, form);
        // Remove after 3s
        setTimeout(() => document.querySelector('.alert').remove(), 2000)
    };

    const deleteBookEntry = function(index) {
        bookList.forEach(book => {
            if (book.id == index.slice(3)){
                bookList.splice(index.slice(3)-1, 1)
            }
        })
    };
    
    const refreshBookList = function() {
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
    };

    return {
        checkFormInput,
        showAlert,
        deleteBookEntry,
        refreshBookList
    }
})();

// CREATE: Creates new book
class Books{
    constructor(author, title, pages, read){
        this.author = author;
        this.title = title;
        this.pages = pages;
        this.read = read;
    }
}

let STORE = (function() {
    // Sets the book list inside local storage
    let setItem = function() {
        localStorage.setItem("bookList", JSON.stringify(bookList));
    };

    // Retrives the book list from local storage
    let getItem = function() {
        bookList = JSON.parse(localStorage.getItem("bookList"));
        bookList.forEach(book => {UI.refreshBookList()});
    };

    return {
        setItem,
        getItem
    }

})();

// EVENT: Add to Library
addToLibraryBtn.addEventListener('click', () => {
    // Get book information
    const author = document.querySelector('#author').value;
    const title = document.querySelector('#title').value;
    const pages = document.querySelector('#numOfPages').value;
    const read = document.querySelector('#read').checked;

    // Checks if the form is empty, alerts if it is
    if (UI.checkFormInput(author, title, pages)) {
        UI.showAlert("Please Fill out the Form Properly", "danger")
        return;
    }

    // Creates new book object based on inputs
    const book = new Books(author, title, pages, read)

    // Add new book to book list
    bookList.push(book);

    // Iterate through the booklist to add a book id to each book
    BOOKS.reAssignIds();

    // Adds book to the book list
    UI.refreshBookList();

    // Resets the form so old input isn't left inserted
    form.reset();

    // Adds bookList to local storage
    STORE.setItem();

})

// EVENT: Hide "add new book" form
hideFormBtn.addEventListener('click', () => {
    form.classList.toggle('hide');
})

// EVENT: Show "add new book" form
addNewBookBtn.addEventListener('click', () => {
    form.classList.toggle('hide');
})


// EVENT: Delete or Change Status of book from reading list
document.querySelector('.book-list').addEventListener('click', (e) => {
    if (e.target.classList[2] == 'btn-warning') {
        UI.deleteBookEntry(e.target.classList[0]);
        // Reassigns ID's of reminaing book entries
        BOOKS.reAssignIds()
        // Updates displayed Book List
        UI.refreshBookList();
        // Updates local storage after book has been deleted
        STORE.setItem();
    }else if (e.target.classList[2] == "btn-success" || e.target.classList[2] == "btn-danger") {
        BOOKS.changeReadStatus(e.target.classList[0]);
        // Updates displayed Book List
        UI.refreshBookList();
        // Updates local storage after read status has change
        STORE.setItem();
    }
})

// Grabs the local storage values if there are any
if (localStorage.length > 0) {
    STORE.getItem();
} 