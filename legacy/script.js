function toggleMenu(){
    /*getElementById is used for selecting elements by their id attribute, while querySelector is used to select elements by CSS selector,including class names. Since you are targeting a class (.hamburger-icon), querySelector is the appropriate method. */
    const menu= document.querySelector(".menu-links");/* Targets menu-link of the Hamburger nav*/ 
    const icon =document.querySelector(".hamburger-icon"); /*Targets hamburger-icon of hamburger nav */
    /*on clicking the menu/icon we perform the action*/
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}