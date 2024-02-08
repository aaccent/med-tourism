const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
}; 

const lockPaddingElements = document.querySelector("header");
const orderCallEls = document.querySelectorAll(".header__button, .footer__button");
const popupEl = document.querySelector(".popup")

function lockBody() {
    let paddingValue = window.innerWidth - document.documentElement.clientWidth;
    if (lockPaddingElements && paddingValue) {
        lockPaddingElements.style.paddingRight = paddingValue + "px"
    }
    document.body.classList.add("_lock")
}

function unlockBody () {
    if (lockPaddingElements) {
        lockPaddingElements.style.paddingRight = ""
    }
    document.body.classList.remove("_lock")
}

function closePopup(popup) {
    popup.classList.remove("popup_open");
    popup.addEventListener("transitionend", () =>  {
        if (!document.querySelector(".header__burger_open")) {
            unlockBody() 
        }
        if (popup.querySelector(".form-block").classList.contains("form-block_sent")) {
            popup.querySelector(".form-block").classList.remove("form-block_sent")
        } else {
            resetForm(popup.querySelector(".form"))
        }
    }, {once: true})
}

function openPopup(popup = undefined) {
    lockBody()
    if (popup) {
        popup.classList.add("popup_open")
    } else {
        console.log("Give me a popup")
    }
}

function validateForm(form) {    
    const reqFiedls = form.querySelectorAll("[class$='__input_required']")
    // const emailField = form.querySelector("input[type='email']")

    function changeContentPage(form) {
        const formBlockEl = form.closest(".form-block__body");

        formBlockEl.style.opacity = "0"
        formBlockEl.addEventListener("transitionend", () => {
            form.closest(".form-block").classList.add("form-block_sent")
            formBlockEl.style.opacity = "1"
        }, { once: true })
    }

    let errors = 0;
    for (let i = 0; i < reqFiedls.length; i++) {
        if (reqFiedls[i].getAttribute("name") === "name") {
            if (reqFiedls[i].value === "") {
                reqFiedls[i].closest(".form__control").classList.add("form__control_error");
                errors++;
            }
        }
        if (reqFiedls[i].getAttribute("name") === "phone") {
            if (reqFiedls[i].value.trim() === "" || reqFiedls[i].value.length < 15) {
                reqFiedls[i].closest(".form__control").classList.add("form__control_error");
                errors++;
            }
        }
    }

    if (errors) {
        console.log("Fill req fields");
    } else {
        form.classList.add("form_sending")
        form.querySelectorAll("input, textarea").forEach(formField => formField.disabled = true)
        setTimeout(() => {
            changeContentPage(form)
            resetForm(form)
        }, 10500)
    }
}

function resetForm(form) {
    form.reset();
    form.querySelectorAll(".form__control").forEach(controlEl => controlEl.className = "form__control")
}

orderCallEls.forEach(orderCallEl => {
    orderCallEl.addEventListener("click", (e) => openPopup(popupEl))
})

for (let i = 0; i < document.forms.length; i++) {
    document.forms[i].addEventListener("submit", e => {
        e.preventDefault();
        validateForm(e.target)
        console.log("form")
    })
}

document.querySelector(".popup__close").addEventListener("click", e => closePopup(popupEl))
popupEl.addEventListener("click", e => {
    if (!e.target.closest(".popup__content")) {
        closePopup(popupEl)
    }
})

document.addEventListener("keydown", (e) => {
    if (e.which === 27) {
        closePopup(popupEl)
    }
})

const menuEl = document.querySelector(".header__nav")
const menuLinkEls = document.querySelectorAll(".header__menu-link");
const burgerMenuEl = document.querySelector(".header__menu")


menuLinkEls.forEach(menuLinkEl => {
    menuLinkEl.addEventListener("click", (e) => {
        let menuItemEl = e.target.closest(".header__menu-item");
        let hasSubmenu = menuItemEl.childElementCount === 2
        if (!hasSubmenu) {
            return
        }

        e.preventDefault();
        menuItemEl.classList.toggle("header__menu-item_open")
    })
})

burgerMenuEl.addEventListener("click", (e) => {
    let burgerEl = burgerMenuEl.querySelector(".header__burger");

    if (burgerEl.classList.contains("header__burger_open")) {
        unlockBody()
    } else {
        lockBody()
        let openSubmenu = document.querySelector(".header__menu-item_open")
        if (openSubmenu) {
            openSubmenu.classList.remove("header__menu-item_open")
        }
    }
    
    burgerEl.classList.toggle("header__burger_open")
    menuEl.classList.toggle("header__nav_open")
})

function documentActions(event) {
    const targetEl = event.target;

    if (!targetEl.closest(".header__menu-item")) {
        document.querySelectorAll(".header__menu-item_hover").forEach(activeMenuItem => activeMenuItem.classList.remove("header__menu-item_hover"))
    }
}

const headerEl = document.querySelector(".header");
const minYOffset = 70;
let lastPageY = 0

function handleScroll() {
    let pageY = window.pageYOffset;
    if (headerEl.querySelector(".header__burger").classList.contains("header__burger_open"))
        return
    if (lastPageY < pageY && pageY > minYOffset) {
        if (!headerEl.classList.contains("header_hide")) {
            headerEl.classList.add("header_hide")
            headerEl.classList.remove("header_show")
        }
    } else if (lastPageY > pageY) {
        if (!headerEl.classList.contains("header_show")) {
            headerEl.classList.remove("header_hide")
            headerEl.classList.add("header_show")
        }
        if (pageY < minYOffset && headerEl.classList.contains("header_show")) {
            headerEl.classList.remove("header_show")
        }
    }

    lastPageY = pageY
}
window.addEventListener("scroll", handleScroll)

if (window.pageYOffset > minYOffset) {
    headerEl.classList.add("header_hide")
}

document.addEventListener("click", documentActions);

let tabMediaQuery = window.matchMedia("(max-width: 992px)")

tabMediaQuery.addEventListener("change", e => {
    if (!e.matches) {
        if (burgerEl.classList.contains("header__burger_open")) {
            burgerEl.classList.remove("header__burger_open");
            menuEl.classList.remove("header__menu_open");
            document.querySelectorAll(".header__menu-item_open").forEach(menuItemEl => menuItemEl.classList.remove("header__menu-item_open"))
        }
    }
})