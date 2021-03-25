const navLinks = document.querySelector('.nav-links')
const links = navLinks.querySelectorAll('a')

//Selecciona en la barra de navegación la página dónde se
//encuetra el usario en el momento
function setActive() {
    links.forEach(link =>{
    if(document.location.href === link.href) {
      link.className='active';
    }
  })
}
window.onload = setActive;

//Muestra el menú desplegable al clickar sobre el icono de menú
//en la barra de navegación
document
  .querySelector('.menu-icon')
  .addEventListener('click', e => {
    if (navLinks.style.display === "flex") {
      navLinks.style.display = "none"
    } else {
      navLinks.style.display = "flex"
    }
  })

