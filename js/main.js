'use strict';

window.addEventListener('DOMContentLoaded', () => {

    // TABS
    let tabContent = document.querySelectorAll('.tabcontent'),
        tabs = document.querySelectorAll('.tabheader__item'),
        tabsParent = document.querySelector('.tabheader');

    function hideTabContent() {
        tabContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show');
            tabs.forEach(tab => {
                tab.classList.remove('tabheader__item_active');
        });
    });
    }

    function showTabContent(i = 0) {
        tabContent[i].classList.add('show');
        tabContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        let target = e.target;
        if (target && target.matches('.tabheader__item')) {
            tabs.forEach((tab, i) => {
                if (tab == target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


    // TIMER
    let deadline = '2022-06-30';
    
    function getDateValue(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor(t / (1000 * 60 * 60) % 24),
            minutes = Math.floor(t / (1000 * 60) % 60),
            seconds = Math.floor(t / 1000 % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    function setTimeValue(id, endtime) {
        let timer = document.querySelector(id),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timerInterval = setInterval(updateDate, 1000);
        
        updateDate();
        function updateDate() {
            let t = getDateValue(endtime);

            function getNum(num) {
                if (num < 10) {
                    return `0${num}`;
                } else {
                return num;
            }
            }

            days.textContent = getNum(t.days);
            hours.textContent = getNum(t.hours);
            minutes.textContent = getNum(t.minutes);
            seconds.textContent = getNum(t.seconds);

            if (t.total == 0) {
                clearInterval(timerInterval);
            }
        }
    }

    setTimeValue('.timer', deadline);

    //MODAL

    let btns = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

        function openModal() {
            modal.classList.add('show');
            modal.classList.remove('hide');
            document.documentElement.style.overflow = 'hidden';
            clearInterval(interval)
        }

        function closeModal() {
            modal.classList.add('hide');
            modal.classList.remove('show');
            document.documentElement.style.overflow = '';
        }

        let interval = setTimeout(openModal, 3000);

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                openModal();
            });
        });

        modal.addEventListener('click', (e) => {
            let target = e.target;
            if (target && (target.matches('[data-close]') || target.matches('.modal'))) {
                closeModal();
            }
        });

        document.documentElement.addEventListener('keydown', (e) => {
            if (e.code == 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });

        window.addEventListener('scroll', scrollModal);

        function scrollModal() {
            if(document.documentElement.clientHeight + document.documentElement.scrollTop == 3769) {
                openModal();
                window.removeEventListener('scroll', scrollModal);
            }
        }

        // FORMS

        let message = {
            loading: 'img/spinner/spinner.svg',
            success: 'Спасибо, скоро мы с Вами свяжемся',
            failure: 'Что-то пошло не так',
        };

        let forms = document.querySelectorAll('form');

        forms.forEach(form => {
            postData(form);
        });

        function postData(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let statusMessage = document.createElement('img');
                statusMessage.src = message.loading;
                statusMessage.alt = 'loading';
                statusMessage.style.cssText = `
                    display: block;
                    margin: 0 auto;
                `;
                form.insertAdjacentElement('afterend', statusMessage);

                let formData = new FormData(form);

                let obj = {};

                formData.forEach((data, i) => {
                    obj[i] = data;
                });

                fetch('server.php', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(obj),
                })
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    console.log(new Error('Что-то пошло не так'));
                    showThanksModal(message.failure);
                })
                .finally(() => form.reset());
            }); 
        }

    function showThanksModal(message) {
        let prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();
        
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog')
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close" data-close>&times;</div> 
                <div class="modal__title">${message}</div>           
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 2000);
    }

    // CLASSES

    class Card {
        constructor(src, alt, title, descr, price, rate) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.rate = rate;
            this.converter();
        }

        converter() {
            this.price *= this.rate;
        }

        setCard() {
            let wrapper = document.querySelector('.menu__field .container'),
                element = document.createElement('div');

            element.classList.add('menu__item');
            element.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>`;

            wrapper.append(element);
        }
    }

    new Card (
        'img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        229,
        2,
    ).setCard();

    new Card (
        'img/tabs/elite.jpg',
        'elite',
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        550,
        1.3,
    ).setCard();

    new Card (
        'img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков. ',
        430,
        1.4,
    ).setCard();
});