const select = {
  templateOf: {
    books: '#template-book',
  },
  containerOf: {
    filters: '.container .filters',
    books: '.container .books-panel',
  },
  books: {
    bookHeader: '.book__header',
    bookImage: '.books-list .book__image',
    bookRating: '.book__rating',
    booksList: '.books-list',
  },
};

const templates = {
  listBook: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML),
};



class Books {
  constructor() {
    const thisBooks = this;
    thisBooks.data = dataSource.books;
    thisBooks.getElements();
    thisBooks.renderBooks();
    thisBooks.initActions();

    thisBooks.favoriteBooks = [];
    thisBooks.filtersBooks = [];
  }

  getElements() {
    const thisBooks = this;
    thisBooks.dom = {};
    thisBooks.dom.filtersForm = document.querySelector(select.containerOf.filters);
    thisBooks.dom.booksList = document.querySelector(select.books.booksList);
  }

  renderBooks() {
    const thisBooks = this;
    for (const item of thisBooks.data) {
      const ratingBgc = thisBooks.determineRatingBgc(item.rating);
      const ratingWidth = item.rating * 10;
      item.ratingBgc = ratingBgc;
      item.ratingWidth = ratingWidth;
      const generatedHTML = templates.listBook(item);
      const element = utils.createDOMFromHTML(generatedHTML);
      thisBooks.dom.booksList.appendChild(element);
    }
  }

  determineRatingBgc(rating) {
    if (rating < 6) {
      return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%);';
    } else if (rating > 6 && rating <= 8) {
      return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%);';
    } else if (rating > 8 && rating <= 9) {
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
    } else if (rating > 9) {
      return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%);';
    }
  }

  initActions() {
    const thisBooks = this;
    thisBooks.dom.booksList.addEventListener('click', function (e) {
      e.preventDefault();
    });

    thisBooks.dom.booksList.addEventListener('dblclick', function (e) {
      e.preventDefault();
      const bookId = e.target.offsetParent.getAttribute('data-id');
      if (e.target.offsetParent.classList.contains('book__image')) {
        if (e.target.offsetParent.classList.contains('favorite')) {
          e.target.offsetParent.classList.remove('favorite');
          thisBooks.favoriteBooks = thisBooks.favoriteBooks.filter(item => item != bookId);
        } else {
          e.target.offsetParent.classList.add('favorite');
          thisBooks.favoriteBooks.push(bookId);
        }
      }
      console.log(thisBooks.favoriteBooks);

    });
    thisBooks.dom.filtersForm.addEventListener('click', function (e) {
      if (
        e.target.tagName == 'INPUT' &&
        e.target.type == 'checkbox' &&
        e.target.name == 'filter'
      ) {
        e.target.checked == true
          ? thisBooks.filtersBooks.push(e.target.value)
          : thisBooks.filtersBooks = thisBooks.filtersBooks.filter(item => item != e.target.value);
      }
      thisBooks.filterBooks();
      console.log(thisBooks.filtersBooks);
    });
  }

  filterBooks() {
    const thisBooks = this;
    for (const book of thisBooks.data) {
      const bookElem = thisBooks.dom.booksList.querySelector(`[data-id="${book.id}"]`);
      bookElem.classList.remove('hidden');

      for (const filter of thisBooks.filtersBooks) {
        if (book.details[filter] == false) {
          bookElem.classList.add('hidden');
          break;
        }
      }
    }
  }

}


new Books();