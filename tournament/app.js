let slideUp = (target, duration = 500) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        //alert("!");
    }, duration);
}

let slideDown = (target, duration = 500) => {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;

    if (display === 'none')
        display = 'block';

    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
    }, duration);
}
var slideToggle = (target, duration = 500) => {
    if (window.getComputedStyle(target).display === 'none') {
        return slideDown(target, duration);
    } else {
        return slideUp(target, duration);
    }
}


let answerButtons = document.querySelectorAll('.has-hide-panel')

answerButtons.forEach(function(answerButton) {
    answerButton.addEventListener('click', function() {
        answerButton.closest('.tournament-questions').classList.toggle('task-show')
        slideToggle(answerButton.closest('.tournament-questions').querySelector('.tasks-wrapper'), 200)
        if (answerButton.closest('.tournament-questions').classList.contains('will-loading')) {
            setTimeout(function() {
                answerButton.closest('.tournament-questions').querySelector('.tasks-wrapper .content-preloader ').remove();
                answerButton.closest('.tournament-questions').querySelector('.tasks-wrapper').innerHTML += '<article class="task "><div id="puzzleInfo " class="puzzle "><table border="0 " width="100% "><tbody><tr><td valign="top "><div oncopy="addCopyright() " style="margin-left: 10px; margin-top: 5px; border: solid 0px black; "><table><tbody><tr><td class="tournament-icon "><img src="./tournament/raiffeisen-icon.svg " alt=" "></td><td><span class="tasktitle ">Отрезки и точки</span></td><td><div class="ya-share2 ya-share2_inited " data-curtain=" " data-shape="round " data-color-scheme="whiteblack " data-size="s " data-limit="0 " data-copy="first " data-more-button-type="short " data-services="messenger,vkontakte,facebook,odnoklassniki,telegram,twitter,viber,whatsapp,skype"><div class="ya-share2__container ya-share2__container_size_s ya-share2__container_color-scheme_whiteblack ya-share2__container_shape_round "><ul class="ya-share2__list ya-share2__list_direction_horizontal "><li class="ya-share2__item ya-share2__item_more "><a class="ya-share2__link ya-share2__link_more " href="javascript:void(0); "><span class="ya-share2__badge ya-share2__badge_more "><span class="ya-share2__icon ya-share2__icon_more "></span></span></a><div class="ya-share2__popup ya-share2__popup_direction_bottom ya-share2__popup_list-direction_horizontal "></div></li></ul></div></div></td><td></td></tr></tbody></table></div><div oncopy="addCopyright() " style="line-height: 150%; margin-left: 10px; "><span class="taskdescription "><a href="" title="Задача относится к категории &quot;Взвешивания&quot; " class="taskcategory ">Взвешивания</a>,&nbsp;<span title="Решение этой задачи принесет вам 1 балл рейтинга ">Вес:<b>1</b></span>,&nbsp;<span title="Задача понравилась 100% решивших ">Симпатии:<b>100%</b></span>,&nbsp;<span title="Игроки поблагодарили нас за задачу, пожертвовав 0.7 Мозгобаксов Вы тоже можете сделать на странице комментариев или обсуждения решения задачи, нажав кнопку &quot;спасибо за задачу&quot; ">Престиж:&nbsp;0.7</span>,&nbsp;<span title="Задача была опубликована 14.03.2021 ">14.03.2021</span></span><span class="rightdescription ">Задачу предложил:<a href="" style="color: black; text-decoration: none;font-family:verdana;font-size: 11px " title="Профиль игрока Breghnev ">Breghnev</a></span></div><div id="puzzleStatBox_721 " align="center " style="display:none; "></div><div style="margin-left: 10px; margin-right: 10px; "><hr border="none " background-color="grey " height="1px "></div><div oncopy="addCopyright() " class="with-math " style="margin-left: 10px; margin-right: 10px; border: solid 0px black; font-size:14px; line-height: 140%; ">В 64 пронумерованных кошельках лежали копеечные монетки. Кошелек №1 был пуст, а вкаждомследующем по номеру кошельке было на одну копейку больше, чем в предыдущем. Затемодинизкошельков опустошили, а все монетки из него разложили по одной в кошельки с меньшиминомерами. Ввашем распоряжении есть весы со стрелкой, которые позволяют за одно взвешиваниеузнатьсуммарныйвес любых выбранных кошельков вместе с их содержимым. При этом известно, чтокопеечнаямонеткавесит 1 г, а пустой кошелек — 100 г. За какое наименьшее число взвешиваний можногарантированноузнать номер опустевшего кошелька?</div><div class="emptyDiv10 "></div><span style="float: left; margin-left: 10px; margin-bottom: 10px; "><span class="answerlink cta color-white btn-sm task-unswer " >Ответить на задачу</span></span><span style="float: right; margin-right: 10px; margin-bottom: 10px; "><span style="margin: 5px; "><a href="?path=comments&amp;puzzle=721 " class="link ">Комментарии: 15</a></span></span></td></tr></tbody></table></div></article><div class="user-rating "><table class="rating-table "><caption class="rating-title title-l ">Рейтинг победителей</caption><thead><tr class="rating-name-line "><td class="rating-col rating-col-name ">Логин</td><td class="rating-col rating-col-name ">Всего баллов</td></tr></thead><tbody><tr><td class="table-separator " colspan="2 "></td></tr><tr><td class="rating-col "><span class="col-number ">1.</span>impas</td><td>9</td></tr><tr><td class="rating-col "><span class="col-number ">2.</span>bmikle</td><td>7</td></tr><tr><td class="rating-col "><span class="col-number ">3.</span>Gaatot</td><td>6</td></tr><tr><td class="rating-col "><span class="col-number ">4.</span>zmerch2</td><td>5</td></tr><tr><td class="rating-col "><span class="col-number ">5.</span>Eugeny</td><td>4</td></tr><tr><td class="rating-col "><span class="col-number ">6.</span>BAS14</td><td>1</td></tr><tr><td class="rating-col "><span class="col-number ">7.</span>Breghnev</td><td>2</td></tr></tbody></table></div>'


            }, 2500)

        }

    })
})

document.querySelector('.close-message').addEventListener('click', function() {
    slideUp(this.closest('.message'), 150);
    setTimeout(function() {
        document.querySelector('.close-message').closest('.message').remove()
    }, 200)
})