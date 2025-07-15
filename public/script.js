document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  const line3 = document.getElementById('line3');

  btn.addEventListener('click', () => {
    menu.classList.toggle('h-0');
    menu.classList.toggle('overflow-hidden');
    line1.classList.toggle('rotate-45');
    line1.classList.toggle('translate-y-1.5');
    line2.classList.toggle('opacity-0');
    line3.classList.toggle('-rotate-45');
    line3.classList.toggle('-translate-y-1.5');
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('h-0', 'overflow-hidden');
      line1.classList.remove('rotate-45', 'translate-y-1.5');
      line2.classList.remove('opacity-0');
      line3.classList.remove('-rotate-45', '-translate-y-1.5');
    });
  });
});
