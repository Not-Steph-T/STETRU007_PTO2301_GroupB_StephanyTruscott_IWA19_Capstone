import {BOOKS_PER_PAGE,authors,books,genres} from "./data.js"

const range = [0, BOOKS_PER_PAGE];
const matches = books;
let page = 1;

if (!books && !Array.isArray(books)) {
  throw new Error("Source required");
}
if (!range && range.length < 2) {
  throw new Error("Range must be an array with two numbers");
}

//SEARCH - Fetch HTML DOM Elements 
const search = document.querySelector("[data-header-search]");
const searchCancel = document.querySelector("[data-search-cancel]");
const searchOverlay = document.querySelector("[data-search-overlay]");
const searchForm = document.querySelector("[data-search-form]");
const searchTitle = document.querySelector("[data-search-title]");
const searchGenres = document.querySelector("[data-search-genres]");
const searchAuthors = document.querySelector("[data-search-authors]");

search.addEventListener("click", () => {
  //opens searchbar and focuses on title
  searchOverlay.showModal();
  searchTitle.focus();
});

searchCancel.addEventListener("click", () => {
  //"cancel" clicked closes searchbar
  searchOverlay.close();
  searchForm.reset();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);

  const result = [];
  const booksList = books;
  
  for (let i = 0; i < booksList.length; i++) {
     const book = booksList[i];
     let titleMatch =
     filters.title.trim() !== "" && book.title.toLowerCase().includes(filters.title.toLowerCase());
     let authorMatch =
     filters.author !== "any" && book.author.includes(filters.author);
     let genreMatch =
     filters.genre !== "any" && book.genres.includes(filters.genre);
     
     if (titleMatch || authorMatch || genreMatch) {
      result.push(book);
    }
  }

    if (result.length > 0) {
    listMessage.classList.remove("list__message_show");
    listButton.disabled = true;
    listItems.innerHTML = "";

    const searchBook = document.createDocumentFragment();
    /**creates and displays the book preview of books that matches the filters in the result array */
    for (let i = 0; i < result.length; i++) {
      const book = result[i];
      const bookPreview = createPreview(book);
      searchBook.appendChild(bookPreview);
    }
    listItems.appendChild(searchBook);
  } else {
    listMessage.classList.add("list__message_show");
    listButton.disabled = true;
    listItems.innerHTML = "";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  searchOverlay.close();
  searchForm.reset();
});

//SETTINGS - Switching between day & night mode - Fetch HTML DOM Elements
const settings = document.querySelector("[data-header-settings]");
const settingsTheme = document.querySelector("[data-settings-theme]");
const settingsOverlay = document.querySelector("[data-settings-overlay]");
const settingsForm = document.querySelector("[data-settings-form]");
const settingsCancel = document.querySelector("[data-settings-cancel]");

const mode = {
  day: ["255, 255, 255", "10, 10, 20"],
  night: ["10, 10, 20", "255, 255, 255"],
};

settingsTheme.value =
  //dataSettingsTheme switches between night and day
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";

settings.addEventListener("click", () => {
  //opens settings and focuses on themes
  settingsTheme.focus();
  settingsOverlay.showModal();
});
  
settingsForm.addEventListener("submit", (event) => {
  // event listener to set the theme to day or night
  event.preventDefault();

  const formSubmit = new FormData(event.target);
  const submit = Object.fromEntries(formSubmit);

  if (submit.theme === "night") {
    document.documentElement.style.setProperty(
      "--color-light",
      mode[submit.theme][0]
    );
    document.documentElement.style.setProperty(
      "--color-dark",
      mode[submit.theme][1]
    );
  } else {
    document.documentElement.style.setProperty(
      "--color-light",
      mode[submit.theme][0]
    );
    document.documentElement.style.setProperty(
      "--color-dark",
      mode[submit.theme][1]
    );
  }
  settingsOverlay.close();
});

settingsCancel.addEventListener("click", () => {
  //"cancel" clicked closes settingbar
  settingsOverlay.close();
  settingsForm.reset();
});

//BOOK LIST
const listItems = document.querySelector("[data-list-items]");
const listMessage = document.querySelector("[data-list-message]");
const listButton = document.querySelector("[data-list-button]");
const listClose = document.querySelector("[data-list-close]");
const listActive = document.querySelector("[data-list-active]");
const listBlur = document.querySelector("[data-list-blur]");
const listImage = document.querySelector("[data-list-image]");
const listTitle = document.querySelector("[data-list-title]");
const listSubtitle = document.querySelector("[data-list-subtitle]");
const listDescription = document.querySelector("[data-list-description]");

//preview
function createPreview(preview) {
  const { author: authorId, id, image, title } = preview;

  const showPreview = document.createElement("button");
  showPreview.classList = "preview";
  showPreview.setAttribute("data-preview", id);

  showPreview.innerHTML = /* html */ `
        <img
            class="preview__image"
            src="${image}"
        />

        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[authorId]}</div>
        </div>
    `;

  return showPreview;
}

//for loop below creates a list of books showing only 36 previews at a time.
const fragment = document.createDocumentFragment();
const extracted = books.slice(0, 36);

for (const preview of extracted) {
  const showPreview = createPreview(preview);
  fragment.appendChild(showPreview);
}
listItems.appendChild(fragment);


search.addEventListener("click", () => {
  searchOverlay.showModal();
});

searchCancel.addEventListener("click", () => {
  searchOverlay.close();
  searchForm.reset();
}); 

//genres list
const genresFragment = document.createDocumentFragment();
const genreElement = document.createElement("option");
genreElement.value = "any"; // sets the value of the option to "any"
genreElement.innerText = "All Genres"; // sets inner text to "All Genres"
genresFragment.appendChild(genreElement);

// loops through an object and creates an option element for each entry, setting the value to the entry's key and the inner text to its value
for (const [id] of Object.entries(genres)) {
  const genreElement = document.createElement("option");
  genreElement.value = id;
  genreElement.innerText = genres[id];
  // option elements are added to the fragment
  genresFragment.appendChild(genreElement);
}

// the fragment is then appended to a searchGenres element
searchGenres.appendChild(genresFragment);


//author list
const authorsFragment = document.createDocumentFragment();
const authorsElement = document.createElement("option");
authorsElement.value = "any"; // sets the value of the option to "any"
authorsElement.innerText = "All Authors"; // sets inner text to "All Authors"
authorsFragment.appendChild(authorsElement);

for (const [id] of Object.entries(authors)) {
  const authorsElement = document.createElement("option");
  authorsElement.value = id;
  authorsElement.innerText = authors[id];
  // option elements are added to the fragment
  authorsFragment.appendChild(authorsElement);
}

// the fragment is then appended to a searchAuthors element
searchAuthors.appendChild(authorsFragment);

//click event listener for the "Show More" button
listButton.addEventListener("click", () => {
  page++;

  const start = (page - 1) * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;

  const extractedNew = books.slice(start, end);

  const newFragment = document.createDocumentFragment();

  for (const preview of extractedNew) {
    const showPreview = createPreview(preview);
    newFragment.appendChild(showPreview);
  }

  listItems.appendChild(newFragment);

  const remaining = matches.length - page * BOOKS_PER_PAGE;
  listButton.innerHTML = /* HTML */ `
    <span>Show more</span>
    <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
  `;

  listButton.disabled = remaining <= 0;
});

listButton.innerHTML =
  /* html */
  `<span> Show more books </span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>`;

/**this click event listener allows a user to click on a book
 * where active is a nullish value which returns books with an image and full description */
listItems.addEventListener("click", (event) => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (let node of pathArray) {
    if (active) {
      break;
    }
    // extract preview value from datalistItem attribute of the current node element.
     const previewId = node?.dataset?.preview;
    // Loop through the books array
    for (const singleBook of books) {
      if (singleBook.id === previewId) {
        active = singleBook;
        break;
      }
    }
  }
 if (!active) {
    return;
  }

  dataListActive.open = true;
  dataListBlur.src, (dataListImage.src = active.image);
  dataListTitle.textContent = active.title;

  dataListSubtitle.textContent = `${authors[active.author]} (${new Date(
    active.published
  ).getFullYear()})`;
  dataListDescription.textContent = active.description;
});

    //close list items preview
listClose.addEventListener("click", () => {
  listActive.close();
});
