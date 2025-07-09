export default (function () {
  const searchToggle = document.querySelector('.search-toggle');
  const searchBox = document.querySelector('.search-box');
  const searchInput = document.querySelector('.search-input');
  const searchInputField = document.querySelector('.search-input input');
  
  if (searchToggle && searchBox && searchInput && searchInputField) {
    searchToggle.addEventListener('click', e => {
      searchBox.classList.toggle('active');
      searchInput.classList.toggle('active');
      searchInputField.focus();
      e.preventDefault();
    });
  }
}());
