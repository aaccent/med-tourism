import "./modules/header.js"

new Swiper(".header__submenu .swiper", {
    direction: "vertical",
    scrollbar: {
        el: ".swiper-scrollbar"
    }
})


new Swiper('.reviews-section__swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    // slidesOffsetBefore: 30,
    // slidesOffsetAfter: 30,
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1280: {
            slidesPerView: 2.25
        }
    },
    navigation: {
        nextEl: '.reviews-section .swiper-button-next',
        prevEl: '.reviews-section .swiper-button-prev',
    },
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true
    },
    on: {
        init: swiper => {
            document.addEventListener("DOMContentLoaded", () => {
                function replaceButtons(e) {
                    var swiperButtonsEl = swiper.navigation.nextEl[0].parentElement;
                    swiperButtonsEl.remove();
                    if (e.matches) {
                        swiper.el.append(swiperButtonsEl)
                    } else {
                        swiper.el.parentElement.previousElementSibling.append(swiperButtonsEl)
                    }
                }
    
                var mediaQuery = window.matchMedia("(max-width: 768px)");
                mediaQuery.addEventListener("change", replaceButtons)
                
                replaceButtons(mediaQuery)
            })
            
        }
    }
});

new Swiper('.clients-section__swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        576: {
            slidesPerView: 1.25
        },
        768: {
            slidesPerView: 2
        },
        992: {
            slidesPerView: 3,
        },
        1280: {
            slidesPerView: 4
        }
    },
    navigation: {
        nextEl: '.clients-section .swiper-button-next',
        prevEl: '.clients-section .swiper-button-prev',
    },
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true
    },
    on: {
        init: swiper => {
            document.addEventListener("DOMContentLoaded", () => {
                function replaceButtons(e) {
                    var swiperButtonsEl = swiper.navigation.nextEl[0].parentElement;
                    swiperButtonsEl.remove();
                    if (e.matches) {
                        swiper.el.append(swiperButtonsEl)
                    } else {
                        swiper.el.parentElement.previousElementSibling.append(swiperButtonsEl)
                    }
                }
    
                var mediaQuery = window.matchMedia("(max-width: 768px)");
                mediaQuery.addEventListener("change", replaceButtons)
                
                replaceButtons(mediaQuery)
            })
            
        }
    }
});


const faqItemHeaderEls = document.querySelectorAll(".faq-item__header");

faqItemHeaderEls.forEach(faqItemHeaderEl => {
    let timeoutId;
    faqItemHeaderEl.addEventListener("click", e => {
        const faqItemEl = faqItemHeaderEl.parentElement;
        const faqItemBodyEl = faqItemHeaderEl.nextElementSibling;
        const faqItemTextEl = faqItemBodyEl.firstElementChild;

        if (faqItemEl.classList.contains("faq-item_open")) {
            let faqItemBodyHeight = faqItemBodyEl.scrollHeight;
            faqItemBodyEl.style.height = faqItemBodyHeight + "px";
            faqItemEl.classList.remove("faq-item_open")
            timeoutId = setTimeout(() => faqItemBodyEl.style.height = "")
        } else {
            clearTimeout(timeoutId)
            faqItemEl.classList.add("faq-item_open");
            faqItemBodyEl.style.height = faqItemTextEl.offsetHeight + "px";
            faqItemBodyEl.addEventListener("transitionend", () => {
                if (timeoutId) {
                    return
                }
                faqItemBodyEl.style.height = "auto"
            }, { once: true })
        }
    })
})

// contacts-us form
const inputEls = document.querySelectorAll(".form__input")
const inputControlClass = "form__control"

for (let i = 0; i < inputEls.length; i++) {
    let inputControlEl = inputEls[i].closest("." + inputControlClass)

    // ввод
    inputEls[i].addEventListener("input", e => {
        const inputEl = e.target;
        const changedClass = "form__control_changed"
        if (inputControlEl.classList.contains(inputControlClass + "_error")) {
            inputControlEl.classList.remove(inputControlClass + "_error")
        }
    })
    inputEls[i].addEventListener("change", e => {
        const inputEl = e.target;
        if (inputEl.value.trim() !== "") {
            inputControlEl.classList.add("form__control_filled")
        } else {
            inputControlEl.classList.remove("form__control_filled")
        }

    })
    inputEls[i].addEventListener("focus", e => {
        let focusedControl = document.querySelector("." + inputControlClass + "_focused")
        focusedControl && focusedControl.classList.remove(inputControlClass + "_focused")
        inputControlEl.classList.add("form__conrol_focused")
    })
}

document.querySelectorAll("input[name='phone']").forEach(inputElement => {
    inputElement.addEventListener("keypress", (e) => {
        const length = e.target.value.length;
        if (e.charCode < 48 || e.charCode > 57 || length > 14) {
            e.preventDefault();
            return;
        }

        switch (length) {
            case 0: 
                e.target.value = "8 " ;
                break;
            case 5:
            case 9:
            case 12:
                e.target.value += " ";
                break;
            default:
                break;
        }
    })
    inputElement.addEventListener("input", e => {e.target.value.length === 2 && (e.target.value = "")})
})


// yandex map

function init() {
    function setMapPins() {
        let myCollection = new ymaps.GeoObjectCollection();
        let coords = [55.7954692462696,49.10686513125719];
        // создание и установка пинов
        myCollection.add(new ymaps.Placemark(coords, {
            iconLayout: "default#image",
            iconImageHref: imagesSrc.pinImage,
            iconImageSize: [60, 60],
        }));
        // добавление пинов на карту
        map.geoObjects.add(myCollection);
        
        // первоначальная инициализация карты
        // map.panTo(coord, { duration: 150 })
    }

    async function getCoords () {
        setTimeout(() => {
            setMapPins(mapPins)
        }, 2000)
    }
    
    let mapPins;
    // создание карты
    let map = new ymaps.Map("map", {
        center: [55.79551291555022,49.10679244528347],
        controls: [],
        zoom: 14,
    })
    
    let imagesSrc = document.getElementById("map").dataset
    
    getCoords()
    
    // zoom ctrl + mouse wheel
    let ctrlKey = false
    let body = document.getElementsByTagName('body')[0];
    map.behaviors.disable(['scrollZoom']);
    body.onkeydown = callbackDown;
    body.onkeyup = callbackUp;
    function callbackDown(e){
        if(e.keyCode === 17 && !ctrlKey){
            ctrlKey = true
            map.behaviors.enable(['scrollZoom']);
        }
    }
    function callbackUp(e){
        if(e.keyCode === 17){
            ctrlKey = false
            map.behaviors.disable(['scrollZoom']);
        }
    }
}

ymaps.ready(init);
