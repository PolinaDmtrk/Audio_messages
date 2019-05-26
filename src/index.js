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

    $('.pages').on('click', '.page', function() {
        currentPage = $(this).text();
        drawData(filteredMessages, currentPage, messagesPerPage);
    });
    $('.prevPage button').on('click', () => {
        if (currentPage != 1) {currentPage--};
        drawData(filteredMessages, currentPage, messagesPerPage);
    });
    $('.nextPage button').on('click', () => {
        if (currentPage != Math.ceil(filteredMessages.length/messagesPerPage)) {currentPage++};
        drawData(filteredMessages, currentPage, messagesPerPage);
    });

    $('#period').on('change', () => {
        filters.period = $('#period option:selected').val();
        filteredMessages = filterData(messages, filters);
    });

    $('#duration').on('change', () => {
        filters.duration = $('#duration option:selected').val();
        filteredMessages = filterData(messages, filters);
    });

    $('#search').on('input', () => {
        $('#search i').css('display', 'none');
        filteredMessages = filterData(messages, filters);
    });
    $('#search').on('change', () => {
        if ($('#search input').val() == '') {
            $('#search i').css('display', '');
        }
    });

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

    let progress;
    $('#data').on('click', '.audio button', function(e) {
        const currentDiv = $(this).parent('div');
        const audio = currentDiv.siblings('audio');
        const secondsLabel = currentDiv.find(".seconds");
        const minutesLabel = currentDiv.find(".minutes");
        const bar = currentDiv.find(".myBar");
        const percentPerSec = 100 / Math.ceil(audio[0].duration);

        if (audio[0].paused) {
            $(this).find('i').removeClass("fa-play-circle")
            $(this).find('i').addClass("fa-pause-circle")
            audio[0].play();
            progress = setInterval(runProgress, 1000);
        }
        else {
            $(this).find('i').removeClass("fa-pause-circle")
            $(this).find('i').addClass("fa-play-circle")
            audio[0].pause();
            clearInterval(progress)
        }

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