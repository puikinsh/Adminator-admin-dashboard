// Vanilla JS slide animations
function slideUp(element, duration = 200, callback = null) {
  element.style.height = `${element.scrollHeight  }px`;
  element.style.transition = `height ${duration}ms ease`;
  element.style.overflow = 'hidden';
  
  requestAnimationFrame(() => {
    element.style.height = '0';
    element.style.paddingTop = '0';
    element.style.paddingBottom = '0';
    element.style.marginTop = '0';
    element.style.marginBottom = '0';
  });
  
  setTimeout(() => {
    element.style.display = 'none';
    element.style.removeProperty('height');
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition');
    if (callback) callback();
  }, duration);
}

function slideDown(element, duration = 200, callback = null) {
  element.style.removeProperty('display');
  let display = window.getComputedStyle(element).display;
  if (display === 'none') display = 'block';
  
  element.style.display = display;
  element.style.height = '0';
  element.style.paddingTop = '0';
  element.style.paddingBottom = '0';
  element.style.marginTop = '0';
  element.style.marginBottom = '0';
  element.style.overflow = 'hidden';
  
  const height = element.scrollHeight;
  
  element.style.transition = `height ${duration}ms ease`;
  
  requestAnimationFrame(() => {
    element.style.height = `${height  }px`;
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
  });
  
  setTimeout(() => {
    element.style.removeProperty('height');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition');
    if (callback) callback();
  }, duration);
}

export default (function () {
  // Sidebar links
  const sidebarLinks = document.querySelectorAll('.sidebar .sidebar-menu li a');
  
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function () {
      const parentLi = this.parentElement;
      const dropdownMenu = parentLi.querySelector('.dropdown-menu');
      
      if (!dropdownMenu) return;
      
      if (parentLi.classList.contains('open')) {
        slideUp(dropdownMenu, 200, () => {
          parentLi.classList.remove('open');
        });
      } else {
        // Close all other open menus at the same level
        const siblingMenus = parentLi.parentElement.querySelectorAll('li.open');
        siblingMenus.forEach(sibling => {
          const siblingDropdown = sibling.querySelector('.dropdown-menu');
          const siblingLink = sibling.querySelector('a');
          
          if (siblingDropdown) {
            slideUp(siblingDropdown, 200);
          }
          if (siblingLink) {
            siblingLink.classList.remove('open');
          }
          sibling.classList.remove('open');
        });
        
        // Open current menu
        slideDown(dropdownMenu, 200, () => {
          parentLi.classList.add('open');
        });
      }
    });
  });

  // Sidebar Activity Class
  const sidebarLinkElements = document.querySelectorAll('.sidebar .sidebar-link');
  
  sidebarLinkElements.forEach(link => {
    link.classList.remove('active');
    
    const href = link.getAttribute('href');
    if (href) {
      const pattern = href[0] === '/' ? href.substr(1) : href;
      if (pattern === window.location.pathname.substr(1)) {
        link.classList.add('active');
      }
    }
  });

  // Sidebar Toggle
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const app = document.querySelector('.app');
  
  if (sidebarToggle && app) {
    sidebarToggle.addEventListener('click', e => {
      app.classList.toggle('is-collapsed');
      e.preventDefault();
    });
  }

  /**
   * Wait until sidebar fully toggled (animated in/out)
   * then trigger window resize event in order to recalculate
   * masonry layout widths and gutters.
   */
  const sidebarToggleById = document.getElementById('sidebar-toggle');
  if (sidebarToggleById) {
    sidebarToggleById.addEventListener('click', e => {
      e.preventDefault();
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    });
  }
}());
