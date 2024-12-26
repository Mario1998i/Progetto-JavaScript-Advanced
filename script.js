// Funzione per recuperare i libri di una categoria
const fetchBooks = async (category) => {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const apiUrl = `https://openlibrary.org/subjects/${category}.json`;

    try {
        console.log(`Fetching books from: ${proxyUrl}${encodeURIComponent(apiUrl)}`);
        const response = await axios.get(`${proxyUrl}${encodeURIComponent(apiUrl)}`);
        const data = JSON.parse(response.data.contents); // Parsing contenuto di AllOrigins
        const books = data.works || [];
        console.log("Books fetched:", books);
        renderBooks(books);
    } catch (error) {
        console.error("Errore durante il recupero dei libri:", error);
        alert("Impossibile recuperare i dati. Riprova più tardi.");
    }
};

// Funzione per visualizzare i libri nella pagina
const renderBooks = (books) => {
    const booksContainer = document.getElementById("results");
    if (!booksContainer) {
        console.error("Elemento #results non trovato nel DOM.");
        return;
    }

    booksContainer.innerHTML = books.map(
        (book) => `
        <div class="book" data-key="${book.key}">
            <h3>${book.title}</h3>
            <p>Autori: ${book.authors.map(a => a.name).join(', ')}</p>
        </div>`
    ).join('');

    console.log("Books rendered in DOM.");

    // Aggiungi evento click a ogni libro
    document.querySelectorAll(".book").forEach((bookElement) => {
        bookElement.addEventListener("click", () => {
            const bookKey = bookElement.getAttribute("data-key");
            console.log(`Fetching description for book key: ${bookKey}`);
            fetchBookDescription(bookKey);

            // Mostra il contenitore della descrizione
            const descriptionContainer = document.getElementById("book-description");
            if (descriptionContainer) {
                descriptionContainer.style.display = "block";
            }
        });
    });
};

// Funzione per recuperare la descrizione di un libro
const fetchBookDescription = async (key) => {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const apiUrl = `https://openlibrary.org${key}.json`;

    try {
        console.log(`Fetching book description from: ${proxyUrl}${encodeURIComponent(apiUrl)}`);
        const response = await axios.get(`${proxyUrl}${encodeURIComponent(apiUrl)}`);
        const data = JSON.parse(response.data.contents); // Parsing contenuto di AllOrigins
        const description = data.description
            ? typeof data.description === "string"
                ? data.description
                : data.description.value
            : "Nessuna descrizione disponibile.";

        console.log("Description fetched:", description);
        displayDescription(description);
    } catch (error) {
        console.error("Errore durante il recupero della descrizione:", error);
        alert("Impossibile recuperare la descrizione del libro. Riprova più tardi.");
    }
};

// Funzione per visualizzare la descrizione di un libro
const displayDescription = (description) => {
    const descriptionContainer = document.getElementById("book-description");
    if (!descriptionContainer) {
        console.error("Elemento #book-description non trovato nel DOM.");
        return;
    }

    descriptionContainer.innerHTML = `<p>${description}</p>`;
    console.log("Description rendered in DOM.");
};

// Aggiunge il listener al pulsante di ricerca
document.getElementById("search-btn").addEventListener("click", () => {
    const categoryInput = document.getElementById("category");
    if (!categoryInput) {
        console.error("Elemento #category non trovato nel DOM.");
        return;
    }

    const category = categoryInput.value.trim();
    if (!category) {
        alert("Inserisci una categoria valida!");
        return;
    }

    console.log(`Search triggered for category: ${category}`);
    fetchBooks(category);
});
