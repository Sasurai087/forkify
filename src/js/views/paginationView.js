import View from './View.js';
import icons from 'url:../../img/icons.svg'; //url param is needed for Parcel2 to import static files

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerCLick(handler) {
    this._parentElement.addEventListener('click', function(e){
      const btn = e.target.closest('.btn--inline');
      if(!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    })
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;

    //Page 1, there are other pages
    if (curPage === 1 && numPages > 1) 
        return this._generateMarkupButton('next', curPage);

    //Last page
    if (curPage === numPages && numPages > 1) 
        return this._generateMarkupButton('prev', curPage);

    //Other page
    if (curPage < numPages) 
        return `${this._generateMarkupButton('next', curPage)}${this._generateMarkupButton('prev', curPage)}`;

    //Page 1, there AREN'T other pages
    return '';
  }

  _generateMarkupButton(type, curPage) {
    return `
      <button data-goto="${type === 'next' ? curPage + 1 : curPage - 1}" class="btn--inline pagination__btn--${type}">
        ${type === 'next' ? `<span>Page ${curPage + 1}</span>` : ''}
        <svg class="search__icon">
           <use href="${icons}#icon-arrow-${type === 'next' ? 'right' : 'left'}"></use>
        </svg>
        ${type === 'prev' ? `<span>Page ${curPage - 1}</span>` : ''}
      </button>
    `;
  }

}

export default new PaginationView();