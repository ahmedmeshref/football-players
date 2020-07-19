let selectItem = (selector, parent=document) => {
    return parent.querySelector(selector);
}

let selectItems = (selector, parent=document) => {
    return parent.querySelectorAll(selector);
}

const app = {
    navigation_menu: selectItem("ul#navbar__list"),
    page_components: selectItems("main > section, header.main__hero"),
}

// --------------------------------------------------------------------------------------------------------------
// build nav bar
// --------------------------------------------------------------------------------------------------------------
let create_fragment = () => {
    return document.createDocumentFragment();
}

/**
 * create_li create a new li item
 * @param content {String}
 * @param id {Integer}
 * @returns {HTMLLIElement}
 */
let create_li = (content, id) => {
    let liItem = document.createElement('li');
    liItem.innerHTML = `
        <a href='#${id}'>${content}</a>
    `
    liItem.className = `nav-item ${id}-link`
    // select home li-nav item by default
    if (content === 'Home') liItem.classList.add('selected');
    return liItem;
}

/**
 * append_item appends the child HTML element to the parent element
 * @param parent {DocumentFragment}
 * @param child {HTMLLIElement}
 */
let append_item = (parent, child) => {
    parent.appendChild(child);
}


let build_nav = () => {
    let fragment = create_fragment();
    // loop over the main components of the page and create a nav-item for each
    app.page_components.forEach((section) => {
        let content = section.getAttribute('data-nav'),
            id = section.id,
            newLiItem = create_li(content, id);
        append_item(fragment, newLiItem);
    })
    append_item(app.navigation_menu, fragment);
}

start = performance.now();
build_nav();
end = performance.now();
console.log(`It took ${end - start} to build`);


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
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

let remove_class = (element, className) => {
    element.classList.remove(className);
}

let add_class = (element, className) => {
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
    if (currentActive) remove_class(currentActive, activationClass);
    add_class(toActivate, activationClass);
}

let activate_navItem = (selected_section, viewed_section) => {
    let viewed_navItem = selectItem(`li.${viewed_section.id}-link`),
        selected_navItem = selectItem(`li.${selected_section.id}-link`);
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
    app.page_components.forEach((section) => {
        if (isInViewport(section)) {
            activate_section(section);
        }
    })
}

// listen to scroll || resize || DOMContentLoaded on window
window.addEventListener('DOMContentLoaded', handler, true);
window.addEventListener('resize', handler, true);
window.addEventListener('scroll', handler, true);




