let selectItem = (selector) => {
    return document.querySelector(selector);
}


let selectItems = (selector) => {
    return document.querySelectorAll(selector);
}

const app = {
    navigation_menu: selectItem("ul#navbar__list"),
    sections: selectItems("main > section"),
    page_components: selectItems("main > section, header.main__hero"),
    main: selectItem("main")
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

build_nav();


// --------------------------------------------------------------------------------------------------------------
// Activate nax-items for viewed sections
// TODO: FIX TEH SCROLLING system to work with section per scroll system
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

let change_active_section = (section) => {
    // get current_selected section if any
    let selected_navItem = selectItem("li.nav-item.selected"),
        viewed_navItem = selectItem(`li.${section.id}-link`);
    if (selected_navItem !== viewed_navItem){
        if (selected_navItem) remove_class(selected_navItem, 'selected');
        add_class(viewed_navItem, 'selected');
    }
}

let handler = () => {
    app.page_components.forEach((section) => {
        if (isInViewport(section)) {
            change_active_section(section);
        }
    })
}

// listen to scroll || resize || DOMContentLoaded on window
window.addEventListener('DOMContentLoaded', handler, true);
window.addEventListener('resize', handler, true);
window.addEventListener('scroll', handler, true);




