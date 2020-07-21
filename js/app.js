let selectItem = (selector, parent = document) => {
    return parent.querySelector(selector);
}

let selectItems = (selector, parent = document) => {
    return parent.querySelectorAll(selector);
}

const app = {
    navigation_menu: selectItem("ul#navbar__list"),
    sections: selectItems("main > section"),
    navigate_top: selectItem("div.navigate-top"),
    navigate_top_btn: selectItem("button.navigate-top-btn")
}

// --------------------------------------------------------------------------------------------------------------
// build nav bar
// --------------------------------------------------------------------------------------------------------------
let createFragment = () => {
    return document.createDocumentFragment();
}

/**
 * create_li create a new li item
 * @param content {String}
 * @param id {Integer}
 * @returns {HTMLLIElement}
 */
let createLiItem = (content, id) => {
    let liItem = document.createElement('li');
    liItem.textContent = content;
    liItem.className = `nav-item`;
    if (content === "Home") liItem.classList.add('selected');
    liItem.id = `${id}-link`;
    return liItem;
}

/**
 * append_item appends the child HTML element to the parent element
 * @param parent {DocumentFragment}
 * @param child {HTMLLIElement}
 */
let appendItem = (parent, child) => {
    parent.appendChild(child);
}


let build_nav = () => {
    let fragment = createFragment();
    // loop over the main components of the page and create a nav-item for each
    app.sections.forEach((section) => {
        let content = section.getAttribute('data-nav'),
            id = section.id,
            newLiItem = createLiItem(content, id);
        appendItem(fragment, newLiItem);
    })
    appendItem(app.navigation_menu, fragment);
}

build_nav();

// --------------------------------------------------------------------------------------------------------------
// Redirect to a specific section once navItem is clicked
// --------------------------------------------------------------------------------------------------------------

let redirect = (e) => {
    if (e.target && e.target.nodeName === 'LI'){
        // extract the section id from the clicked navItem id
        let redirectTo = e.target.id.split("-")[0];
        // navigate to the desired section
        window.location.href = `#${redirectTo}`;
    }
}


app.navigation_menu.addEventListener('click', redirect)


// --------------------------------------------------------------------------------------------------------------
// Activate nav-item and section in viewPort
// --------------------------------------------------------------------------------------------------------------

/**
 * isInViewport takes in HTML element and returns true if it is in the view port, False otherwise
 * @param element
 * @returns {boolean|boolean}
 */
let isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < (window.pageYOffset + window.innerHeight) &&
        rect.left < (window.pageXOffset + window.innerWidth) &&
        (rect.top + rect.height) > window.pageYOffset &&
        (rect.left + rect.width) > window.pageXOffset
    );
}

let removeClass = (element, className) => {
    element.classList.remove(className);
}

let addClass = (element, className) => {
    element.classList.add(className);
}

/**
 * activate changes the activation of two HTML elements by removing activation from currentActive element and adding it
 *  to toActivate element
 * @param currentActive {HTMLElement}
 * @param toActivate {HTMLElement}
 * @param activationClass {String}
 */
let activate = (currentActive, toActivate, activationClass) => {
    if (currentActive) removeClass(currentActive, activationClass);
    addClass(toActivate, activationClass);
}

let activate_navItem = (selected_section, viewed_section) => {
    let viewed_navItem = selectItem(`li#${viewed_section.id}-link`),
        selected_navItem = selectItem(`li#${selected_section.id}-link`);
    activate(selected_navItem, viewed_navItem, 'selected');
}

/**
 * change_active_section activates the current viewed section
 * @param viewed_section {HTMLElement}
 */
let activate_section = (viewed_section) => {
    // get current_selected section if any
    let selected_section = selectItem("section.active, header.active");
    if (selected_section !== viewed_section) {
        activate_navItem(selected_section, viewed_section);
        activate(selected_section, viewed_section, 'active');
    }
}

let handler = () => {
    app.sections.forEach((section) => {
        if (window.pageYOffset  >= section.offsetTop-100){
            activate_section(section);
        }
    })
}

// listen to scroll || resize || DOMContentLoaded on window
window.addEventListener('DOMContentLoaded', handler, true);
window.addEventListener('resize', handler, true);
window.addEventListener('scroll', handler, true);


// --------------------------------------------------------------------------------------------------------------
// Add a home button once the user reaches the end of the page
// --------------------------------------------------------------------------------------------------------------

let navigateHome = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // hide the scroll to home button
    addClass(app.navigate_top, 'hidden')
}

window.onscroll = function (ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // show the scroll to home button
        removeClass(app.navigate_top, 'hidden')
    }
};

// listen for click on the navigation button
app.navigate_top_btn.addEventListener('click', navigateHome);


