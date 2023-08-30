(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    function setHash(hash) {
        hash = hash ? `#${hash}` : window.location.href.split("#")[0];
        history.pushState("", "", hash);
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function tabs() {
        const tabs = document.querySelectorAll("[data-tabs]");
        let tabsActiveHash = [];
        if (tabs.length > 0) {
            const hash = getHash();
            if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
            tabs.forEach(((tabsBlock, index) => {
                tabsBlock.classList.add("_tab-init");
                tabsBlock.setAttribute("data-tabs-index", index);
                tabsBlock.addEventListener("click", setTabsAction);
                initTabs(tabsBlock);
            }));
            let mdQueriesArray = dataMediaQueries(tabs, "tabs");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
        }
        function setTitlePosition(tabsMediaArray, matchMedia) {
            tabsMediaArray.forEach((tabsMediaItem => {
                tabsMediaItem = tabsMediaItem.item;
                let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
                let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
                let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
                let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
                tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems.forEach(((tabsContentItem, index) => {
                    if (matchMedia.matches) {
                        tabsContent.append(tabsTitleItems[index]);
                        tabsContent.append(tabsContentItem);
                        tabsMediaItem.classList.add("_tab-spoller");
                    } else {
                        tabsTitles.append(tabsTitleItems[index]);
                        tabsMediaItem.classList.remove("_tab-spoller");
                    }
                }));
            }));
        }
        function initTabs(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
            if (tabsActiveHashBlock) {
                const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
                tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
            }
            if (tabsContent.length) {
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    tabsTitles[index].setAttribute("data-tabs-title", "");
                    tabsContentItem.setAttribute("data-tabs-item", "");
                    if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                    tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
                }));
            }
        }
        function setTabsStatus(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            function isTabsAnamate(tabsBlock) {
                if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
            }
            const tabsBlockAnimate = isTabsAnamate(tabsBlock);
            if (tabsContent.length > 0) {
                const isHash = tabsBlock.hasAttribute("data-tabs-hash");
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    if (tabsTitles[index].classList.contains("_tab-active")) {
                        if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                        if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                    } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
                }));
            }
        }
        function setTabsAction(e) {
            const el = e.target;
            if (el.closest("[data-tabs-title]")) {
                const tabTitle = el.closest("[data-tabs-title]");
                const tabsBlock = tabTitle.closest("[data-tabs]");
                if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                    let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                    tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                    tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                    tabTitle.classList.add("_tab-active");
                    setTabsStatus(tabsBlock);
                }
                e.preventDefault();
            }
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    const LOCATION = {
        center: [ 37.723082, 55.75254 ],
        zoom: 13
    };
    const LOCATION_1 = {
        center: [ 37.653082, 55.75254 ],
        zoom: 13
    };
    const LOCATION_2 = {
        center: [ 37.634182, 55.76153 ],
        zoom: 13
    };
    const LOCATION_3 = {
        center: [ 37.665282, 55.77052 ],
        zoom: 13
    };
    window["FLS"] = true;
    isWebp();
    menuInit();
    tabs();
    const menu_links = document.querySelectorAll(".menu__link");
    menu_links.forEach((elem => {
        elem.addEventListener("click", (e => {
            e.preventDefault();
            if (window.matchMedia("(min-width: 992px)").matches) return;
            if (elem.nextSibling) while (elem.parentNode.children) if (elem.nextElementSibling.classList.contains("menu__list")) if (elem.classList.contains("active")) {
                elem.classList.remove("active");
                elem.nextElementSibling.style.maxHeight = elem.nextElementSibling.scrollHeight + "px";
                elem.nextElementSibling.style.paddingTop = 0;
                setTimeout((() => {
                    elem.nextElementSibling.style.maxHeight = 0;
                }), 5);
                setTimeout((() => {
                    elem.nextElementSibling.style.display = "none";
                }), 600);
                break;
            } else {
                elem.classList.add("active");
                elem.nextElementSibling.style.display = "flex";
                setTimeout((() => {
                    elem.nextElementSibling.style.maxHeight = elem.nextElementSibling.scrollHeight + 30 + "px";
                    elem.nextElementSibling.style.paddingTop = "15px";
                }), 5);
                setTimeout((() => {
                    elem.nextElementSibling.style.maxHeight = "none";
                }), 400);
                break;
            }
        }));
    }));
    window.addEventListener("resize", (e => {}));
    function initSliders() {
        if (document.querySelector(".advantages__slider")) new Swiper(".advantages__slider", {
            slidesPerView: 1.2,
            spaceBetween: 36,
            pagination: {
                clickable: true
            },
            autoplay: {
                delay: 3e3,
                disableOnInteraction: false
            },
            watchOverflow: true,
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 36,
                    autoHeight: true
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 36
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 36
                }
            },
            simulateTouch: true,
            touchRatio: 1,
            touchAngle: 45,
            grabCursor: true,
            slideToClickedSlide: true
        });
        new Swiper(".complex__slider", {
            slidesPerView: 1,
            autoHeight: false,
            grid: {
                rows: 2
            },
            spaceBetween: 36,
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            watchOverflow: true,
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 36,
                    grid: {
                        rows: 2
                    }
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 36,
                    grid: {
                        rows: 2
                    }
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 31,
                    grid: {
                        rows: 2
                    }
                }
            },
            autoplay: {
                delay: 3e3,
                disableOnInteraction: false
            },
            simulateTouch: true,
            touchRatio: 1,
            touchAngle: 45,
            grabCursor: true,
            slideToClickedSlide: true
        });
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    window.map = null;
    main();
    async function main() {
        await ymaps3.ready;
        const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapFeatureDataSource, YMapLayer, YMapControls, YMapMarker} = ymaps3;
        map = new YMap(document.getElementById("app"), {
            location: LOCATION
        });
        map.addChild(new YMapDefaultSchemeLayer);
        map.addChild(new YMapDefaultFeaturesLayer);
        map.addChild(new YMapFeatureDataSource({
            id: "popups"
        }));
        map.addChild(new YMapLayer({
            source: "popups"
        }));
        class MyMarkerWithPopup extends ymaps3.YMapComplexEntity {
            _onAttach() {
                this._actualize();
            }
            _onDetach() {
                this.marker = null;
            }
            _onUpdate(props) {
                if (props.coordinates) this.marker?.update({
                    coordinates: props.coordinates
                });
                this._actualize();
            }
            _actualize() {
                const props = this._props;
                this._lazyCreatePopup();
                this._lazyCreateMarker();
                if (!this._state.popupOpen || !props.popupHidesMarker) this.addChild(this.marker); else if (this.marker) this.removeChild(this.marker);
                if (this._state.popupOpen) this.popupElement.style.display = "flex"; else if (this.popupElement) this.popupElement.style.display = "none";
            }
            _lazyCreateMarker() {
                if (this.marker) return;
                const pinElement = document.createElement("div");
                pinElement.className = "my-marker__pin";
                const el = document.createElement("img");
                el.className = "my-marker__img";
                el.src = "./img/map/pin-1.svg";
                const markerElement = document.createElement("div");
                markerElement.className = "my-marker";
                markerElement.append(el);
                markerElement.append(pinElement);
                this._markerElement = markerElement;
                pinElement.onclick = () => {
                    this._state.popupOpen = true;
                    this._actualize();
                };
                const container = document.createElement("div");
                container.append(this._markerElement, this.popupElement);
                this.marker = new YMapMarker({
                    coordinates: this._props.coordinates
                }, container);
            }
            _lazyCreatePopup() {
                if (this.popupElement) return;
                const element = document.createElement("div");
                element.className = "popup";
                const textElement = document.createElement("div");
                textElement.className = "popup__text";
                textElement.textContent = this._props.popupContent;
                element.append(textElement);
                this.popupElement = element;
            }
            constructor(props) {
                super(props);
                this._state = {
                    popupOpen: false
                };
            }
        }
        map.addChild(new MyMarkerWithPopup({
            coordinates: LOCATION_1.center,
            popupContent: 'ЖК "Яблоновский"'
        }));
        map.addChild(new MyMarkerWithPopup({
            coordinates: LOCATION_2.center,
            popupContent: "Магазины"
        }));
        map.addChild(new MyMarkerWithPopup({
            coordinates: LOCATION_3.center,
            popupContent: "Детский сад"
        }));
        const pins = document.querySelectorAll(".my-marker__img");
        const markers = document.querySelectorAll(".my-marker");
        pins.forEach(((item, index) => {
            item.src = `./img/map/pin-${index + 1}.svg`;
        }));
        const tabs_container = document.querySelector(".map__tabs-container");
        markers.forEach(((item, index) => {
            item.id = `marker-${index + 1}`;
            const tabElement = document.createElement("div");
            tabElement.className = "card tab-map";
            const tabWrapper = document.createElement("div");
            tabWrapper.className = "card__wrap tab-map__wrap";
            tabElement.append(tabWrapper);
            const span = document.createElement("span");
            const img = document.createElement("img");
            img.src = item.firstChild.src;
            span.append(img);
            const tabText = document.createElement("p");
            tabText.className = "card__text tab-map__text";
            tabText.textContent = item.nextElementSibling.firstChild.textContent;
            tabWrapper.append(span, tabText);
            item.onclick = () => {
                if (tabElement.classList.contains("active")) {
                    item.nextElementSibling.style.display = "none";
                    tabElement.classList.remove("active");
                } else {
                    item.nextElementSibling.style.display = "flex";
                    tabElement.classList.add("active");
                }
            };
            tabElement.onclick = () => {
                if (tabElement.classList.contains("active")) {
                    item.nextElementSibling.style.display = "none";
                    tabElement.classList.remove("active");
                } else {
                    item.nextElementSibling.style.display = "flex";
                    tabElement.classList.add("active");
                }
            };
            tabs_container.append(tabElement);
        }));
    }
    const mapContainer = document.querySelector("#app");
    window.addEventListener("resize", (e => {
        if (window.matchMedia("(min-width: 992px)").matches) mapContainer.style.height = "662" + "px"; else mapContainer.style.height = "622" + "px";
    }));
    const tabsButtons = document.querySelectorAll(".tabs__btn");
    const photosContainer = document.querySelector(".tabs__photos");
    const tabsPhotos = document.querySelectorAll(".tabs__body");
    tabsButtons.forEach((item => {
        item.onclick = () => {
            photosContainer.innerHTML = "";
            tabsPhotos.forEach((item => {
                if (item.hasAttribute("hidden")) {
                    const image = item.firstElementChild.firstElementChild.cloneNode(true);
                    photosContainer.append(image);
                }
            }));
        };
    }));
})();