import {BOOKS_PER_PAGE,authors,books,genres} from "./data.js"

//SEARCH FUNCTION - Fetch HTML DOM Elements
const search = document.querySelector("[data-header-search]");
const searchCancel = document.querySelector("[data-search-cancel]");
const searchOverlay = document.querySelector("[data-search-overlay]");
const searchForm = document.querySelector("[data-search-form]");
const searchTitle = document.querySelector("[data-search-title]");
const searchGenres = document.querySelector("[data-search-genres]");
const searchAuthors = document.querySelector("[data-search-authors]");

//DATA LIST - Fetch HTML DOM Elements
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

//SETTINGS Function - Fetch HTML DOM Elements
const settings = document.querySelector("[data-header-settings]");
const settingsTheme = document.querySelector("[data-settings-theme]");
const settingsOverlay = document.querySelector("[data-settings-overlay]");
const settingsForm = document.querySelector("[data-settings-form]");
const settingsCancel = document.querySelector("[data-settings-cancel]");

//page range counter
const range = books.length;
if (!books && !Array.isArray(books)) throw new Error("Source required"); 
if (!range && range.length < 2) throw new Error("Range must be an array with two numbers");
let page = 1;

//settings function
const themes = {
  day: ["255, 255, 255", "10, 10, 20"],
  night: ["10, 10, 20", "255, 255, 255"],
};

settingsTheme.value =
  //adjusts theme on open according to users pc preference
  window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").books
    ? "night"
    : "day";
window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").books
  ? "day"
  : "night";

settingsForm.addEventListener("submit", (event) => {
  // user selects dark/light
  event.preventDefault();

  const formSubmit = new FormData(event.target);
  const submit = Object.fromEntries(formSubmit);

  if (submit.theme === "night") {
    document.documentElement.style.setProperty(
      "--color-light",
      themes[submit.theme][0]
    );
    document.documentElement.style.setProperty(
      "--color-dark",
      themes[submit.theme][1]
    );
  } else {
    document.documentElement.style.setProperty(
      "--color-light",
      themes[submit.theme][0]
    );
    document.documentElement.style.setProperty(
      "--color-dark",
      themes[submit.theme][1]
    );
  }
  settingsOverlay.close();
});

settingsCancel.addEventListener("click", () => {
  //"cancel" clicked closes settingbar
  settingsOverlay.close();
  settingsForm.reset();
});

settings.addEventListener("click", () => {
  //opens settings and focuses on themes
  settingsTheme.focus();
  settingsOverlay.showModal();
});

//create range of books to disply
const fragment = document.createDocumentFragment();
const extracted = books.slice(0, 36);

for (let i = 0; i < extracted.length; i++) {
  const { author: authorId, id, image, title } = extracted[i];

  const extractedList = document.createElement("button"); //button effect for preview
  extractedList.classList = "preview";
  extractedList.setAttribute("data-preview", id);

  extractedList.innerHTML = /* html */ `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[authorId]}</div>
        </div>
    `;

  fragment.appendChild(extractedList);
}
listItems.appendChild(fragment);

//genres list
const genresFragment = document.createDocumentFragment();
const genreElement = document.createElement("option");
genreElement.value = "any";
genreElement.innerText = "All Genres";
genresFragment.appendChild(genreElement);

const genreList = Object.entries(genres);
for (let i = 0; i < genreList.length; i++) {
  const [id, name] = genreList[i];
  const genreOption = document.createElement("option");
  genreOption.value = id;
  genreOption.textContent = name;
  genresFragment.appendChild(genreOption);
}
searchGenres.appendChild(genresFragment);

//author list
const authorsFragment = document.createDocumentFragment();
const authorsElement = document.createElement("option");
authorsElement.value = "any";
authorsElement.innerText = "All Authors";
authorsFragment.appendChild(authorsElement);

const authorList = Object.entries(authors);
for (let i = 0; i < authorList.length; i++) {
  const [id, name] = authorList[i];
  const authorOption = document.createElement("option");
  authorOption.value = id;
  authorOption.textContent = name;
  authorsFragment.appendChild(authorOption);
}
searchAuthors.appendChild(authorsFragment);

//close list items preview
listClose.addEventListener("click", () => {
  listActive.close();
});

//summary preview setting setup
listItems.addEventListener("click", (event) => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (let i = 0; i < pathArray.length; i++) {
    const node = pathArray[i];
    if (active) {
      break;
    }
    const previewId = node?.dataset?.preview;

    for (let i = 0; i < books.length; i++) {
      const singleBook = books[i];
      if (singleBook.id === previewId) {
        active = singleBook;
        break;
      }
    }
  }

  if (!active) {
    return;
  }

  listActive.open = true;
  listBlur.src = active.image;
  listImage.src = active.image;
  listTitle.textContent = active.title;

  listSubtitle.textContent = `${authors[active.author]} (${new Date(
    active.published
  ).getFullYear()})`;
  listDescription.textContent = active.description;
});

// set up the "show more" button
listButton.innerHTML = /* HTML */ `
  <span>Show more</span>
  <span class="list__remaining">
    (${books.length - page * BOOKS_PER_PAGE > 0
      ? books.length - page * BOOKS_PER_PAGE
      : 0})</span
  >
`;

listButton.addEventListener("click", () => {
  // define "show more" page range
  const start = (page - 1) * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;

  const extractedNew = books.slice(start, end);

  const newFragment = document.createDocumentFragment();
  for (let i = 0; i < extractedNew.length; i++) {
    const showMore = extractedNew[i];
    const showPreview = createPreview(showMore);
    newFragment.appendChild(showPreview);
  }

  listItems.appendChild(newFragment);
  const remaining = books.length - page * BOOKS_PER_PAGE;
  listButton.innerHTML = /* HTML */ `
    <span>Show more</span>
    <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
  `;

  listButton.disabled = remaining <= 0;
  page = page + 1;
});

// create preview
function createPreview(preview) {
  const { author: authorId, id, image, title } = preview;

  const showMore = document.createElement("button");
  showMore.classList = "preview";
  showMore.setAttribute("data-preview", id);

  showMore.innerHTML = /* html */ `
              <img
                  class="preview__image"
                  src="${image}"
              />
              <div class="preview__info">
                  <h3 class="preview__title">${title}</h3>
                  <div class="preview__author">${authors[authorId]}</div>
              </div>
          `;
  return showMore;
}

//search function
search.addEventListener("click", () => {
  //user clicks on search icon & search bar opens
  searchOverlay.showModal();
  searchTitle.focus();
});

searchCancel.addEventListener("click", () => {
  //user clicks "cancel" button & searchbar closes
  searchOverlay.close();
  searchForm.reset();
});

searchForm.addEventListener("submit", (event) => {
  //user selects requested data in searchbar form, results returned on "search" click
  event.preventDefault();

  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);

  const result = [];
  const booksList = books;

  for (let i = 0; i < booksList.length; i++) {
    const book = booksList[i];

    let titleMatch =
      filters.title.trim() !== "" &&
      book.title.toLowerCase().includes(filters.title.toLowerCase());
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

    const search = document.createDocumentFragment();
    //returns search results
    for (let i = 0; i < result.length; i++) {
      const book = result[i];
      const bookPreview = createPreview(book);
      search.appendChild(bookPreview);
    }
    listItems.appendChild(search);
  } else {
    listMessage.classList.add("list__message_show"); //if no results available return "no results found.." message
    listButton.disabled = true;
    listItems.innerHTML = "";
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  searchOverlay.close();
  searchForm.reset();
});
