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

});