export default (function () {
  // Email side toggle functionality
  const emailSideToggle = document.querySelector('.email-side-toggle');
  const emailApp = document.querySelector('.email-app');
  
  if (emailSideToggle && emailApp) {
    emailSideToggle.addEventListener('click', e => {
      emailApp.classList.toggle('side-active');
      e.preventDefault();
    });
  }

  // Email list item and back to mailbox functionality
  const emailListItems = document.querySelectorAll('.email-list-item, .back-to-mailbox');
  const emailContent = document.querySelector('.email-content');
  
  if (emailListItems.length > 0 && emailContent) {
    emailListItems.forEach(item => {
      item.addEventListener('click', e => {
        emailContent.classList.toggle('open');
        e.preventDefault();
      });
    });
  }
}())
