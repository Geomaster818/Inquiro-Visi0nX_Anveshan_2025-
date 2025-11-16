
/* Sidebar behavior: for mode C (floating overlay)
   - Hovering expands the menu (CSS handles)
   - Clicking the small icon toggles a persistent expanded state
   - Close button collapses persistent expanded state
*/
(function(){
  const sidebar = document.querySelector('.side-menu');
  if(!sidebar) return;
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'menu-icon toggle-btn';
  toggleBtn.title = 'Menu';
  toggleBtn.innerHTML = '&#9776;'; // hamburger
  // insert at top
  sidebar.insertAdjacentElement('afterbegin', toggleBtn);

  // click toggles expanded class persistently
  toggleBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    sidebar.classList.toggle('expanded');
  });

  // close button (if any)
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '✕';
  sidebar.appendChild(closeBtn);
  closeBtn.addEventListener('click', ()=> sidebar.classList.remove('expanded'));

  // clicking outside will collapse if it was expanded by click
  document.addEventListener('click', (e)=>{
    if(!sidebar.classList.contains('expanded')) return;
    if(sidebar.contains(e.target)) return;
    sidebar.classList.remove('expanded');
  });

  // allow focus escape with Escape key
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') sidebar.classList.remove('expanded');
  });
})();
