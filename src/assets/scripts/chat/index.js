export default (function () {
  const chatSidebarToggle = document.getElementById('chat-sidebar-toggle');
  const chatSidebar = document.getElementById('chat-sidebar');
  
  if (chatSidebarToggle && chatSidebar) {
    chatSidebarToggle.addEventListener('click', e => {
      chatSidebar.classList.toggle('open');
      e.preventDefault();
    });
  }
}())
