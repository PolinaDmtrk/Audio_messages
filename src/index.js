import {getData} from './getData';
import {drawData} from './drawData';
import {filterData} from './filterData';
import {modifyTime} from './modifyTime';

$(document).ready ( () => {
    const messages = [], messagesPerPage = 10; let currentPage = 1, filteredMessages = [];
    let filters = {
        period: 0,
        duration: 0
    };

    //Получение данных из файла и отрисовка таблицы с сообщениями
    getData().then(
        data => {
            $(data).find('Data').each(function(i, item) {
                messages[i] = {};
                messages[i].id = i;
                messages[i].date = $(this).find('Received').html();
                messages[i].from = $(this).find('From').html();
                messages[i].audioName = $(this).find('MIME').find('MIME').attr('Disposition-filename');
                messages[i].duration = $(this).find('Duration').html();
            });
            drawData(messages, currentPage, messagesPerPage);
            filteredMessages = messages;
        }).catch(error => console.error('Error:', error));

    //Перерисовка таблицы по нажатию на страницу
    $('.pages').on('click', '.page', function() {
        currentPage = $(this).text();
        drawData(filteredMessages, currentPage, messagesPerPage);
    });
    //Перерисовка таблицы по нажатию на кнопку предыдущей страницы
    $('.prevPage button').on('click', () => {
        if (currentPage != 1) {currentPage--};
        drawData(filteredMessages, currentPage, messagesPerPage);
    });
    //Перерисовка таблицы по нажатию на кнопку следующей страницы
    $('.nextPage button').on('click', () => {
        if (currentPage != Math.ceil(filteredMessages.length/messagesPerPage)) {currentPage++};
        drawData(filteredMessages, currentPage, messagesPerPage);
    });

    //Фильтр сообщений по дате получения
    $('#period').on('change', () => {
        filters.period = $('#period option:selected').val();
        filteredMessages = filterData(messages, filters);
    });

    //Фильтр сообщений по длительности
    $('#duration').on('change', () => {
        filters.duration = $('#duration option:selected').val();
        filteredMessages = filterData(messages, filters);
    });

    //Фильтр сообщений по номеру
    $('#search').on('input', () => {
        $('#search i').css('display', 'none');
        filteredMessages = filterData(messages, filters);
    });
    $('#search').on('change', () => {
        if ($('#search input').val() == '') {
            $('#search i').css('display', '');
        }
    });

    //Очищение фильтров
    $('#discard').on('click', () => {
        filters = {
            period: 0,
            duration: 0
        };
        $('#period').val(0);
        $('#search input').val('');
        $('#duration').val(0);
        filteredMessages = filterData(messages, filters);
    });

    //Действия с аудио-файлами
    let progress;
    $('#data').on('click', '.audio button', function() {
        //При нажатии на кнопку проигрывания:

        //Все остальные аудио останавливаются
        let tr = $(this);
        while (tr[0].className != 'item') {
            tr = tr.parent();
        }
        tr.siblings().find('audio').each((i, audio) => {
            audio.pause();
        });

        const currentDiv = $(this).parent('div');
        const audio = currentDiv.siblings('audio');
        const secondsLabel = currentDiv.find(".seconds");
        const minutesLabel = currentDiv.find(".minutes");
        const bar = currentDiv.find(".myBar");
        const percentPerSec = 100 / Math.ceil(audio[0].duration);

        //Текущее аудио либо начинает проигрываться, либо останавливается, в зависимости от предыдущего состояния
        if (audio[0].paused) {
            $(this).find('i').removeClass("fa-play-circle");
            $(this).find('i').addClass("fa-pause-circle");
            audio[0].play();
            progress = setInterval(runProgress, 1000);
        }
        else {
            $(this).find('i').removeClass("fa-pause-circle");
            $(this).find('i').addClass("fa-play-circle");
            audio[0].pause();
            clearInterval(progress)
        }

        //Отображение текущего времени аудио
        function runProgress() {
            const currentTime = audio[0].currentTime;
            secondsLabel[0].innerHTML = modifyTime(Math.ceil(currentTime % 60));
            minutesLabel[0].innerHTML = modifyTime(Math.floor(currentTime / 60));
            const width = Math.ceil(currentTime) * percentPerSec;
            $(bar).css('width', width + '%');
            if (audio[0].ended) {
                clearInterval(progress);
                $(currentDiv).find('.play i').removeClass("fa-pause-circle")
                $(currentDiv).find('.play i').addClass("fa-play-circle")
            }
        }
    });
})