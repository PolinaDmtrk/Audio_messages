$(document).ready ( () => {
    const messages = [], messagesPerPage = 10; let currentPage = 1, filteredMessages = [];
    let filters = {
        period: 0,
        duration: 0
    };

    getData().then(
        data => {
            $(data).find('Data').each(function(i, item){
                messages[i] = {};
                messages[i].id = i;
                messages[i].date = $(this).find('Received').html();
                messages[i].from = $(this).find('From').html();
                messages[i].audio = $(this).find('MIME').find('MIME').attr('Disposition-filename');
                messages[i].duration = $(this).find('Duration').html();
            });
            drawData(messages, currentPage, messagesPerPage);
            filteredMessages = messages;
        }).catch(error => console.error('Error:', error));

    $('.pages').on('click', '.page', function() {
        currentPage = $(this).text();
        drawData(filteredMessages, currentPage, messagesPerPage)
    });
    $('.prevPage button').on('click', function() {
        if (currentPage != 1) {currentPage--};
        drawData(filteredMessages, currentPage, messagesPerPage)
    });
    $('.nextPage button').on('click', function() {
        if (currentPage != Math.ceil(filteredMessages.length/messagesPerPage)) {currentPage++};
        drawData(filteredMessages, currentPage, messagesPerPage)
    });
    $('#period').on('change', function() {
        filters.period = $('#period option:selected').attr('id');
        filteredMessages = filterData(messages, filters);
    });
    $('#duration').on('change', function() {
        filters.duration = $('#duration option:selected').attr('id');
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
})
function filterDataByNumber(data) {
    const filter = $('#search input').val().toUpperCase();
    filteredData = data.filter((item) => {
        return item.from.toUpperCase().indexOf(filter) > -1;
    });
    return filteredData;
}
async function getData(){
    const response = $.ajax({
        type: "POST",
        url: "data.xml",
        dataType: "xml",
        success: function(data) {
            console.log('Данные получены!');  
        },
        error: function(){
            alert('ERROR');
        }
    });
    return await response;
}
function modifyDate(date) {
    date = new Date(date);

    const day = ('0'+date.getDate()).slice(-2);
    const month = ('0'+(date.getMonth()+1)).slice(-2);
    const year = (''+date.getFullYear()).slice(-2);
    const hour = ('0'+date.getHours()).slice(-2);
    const minutes = ('0'+date.getMinutes()).slice(-2);

    const modifiedDate = `${day}.${month}.${year} ${hour}:${minutes}`;
    return modifiedDate;
}
function drawData(data, currentPage = 1, messagesPerPage = 10) {
    const paginatedData = paginateData(data, currentPage, messagesPerPage);
    $('#data tbody').empty();
    $(paginatedData).each((i, item)=>{
        const date = modifyDate(item.date);
        const td = `<td>${date}</td><td>${item.from}</td><td><audio src="${item.audio}" controls type="audio/wav"</audio></td>`;
        $('#data tbody').append(`<tr>${td}</tr>`);
    });
    drawPages(data.length, messagesPerPage);
}
function drawPages(count, messagesPerPage) {
    $('.pages').empty();
    for (let i = 1; i <= Math.ceil(count/messagesPerPage); i++) {
        $('.pages').append(`<a href="#" class="page">${i}</a>`);
    }
}
function paginateData(data, currentPage, messagesPerPage) {
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessag = indexOfLastMessage - messagesPerPage;
    const paginatedData = data.slice(indexOfFirstMessag, indexOfLastMessage);
    return paginatedData;
}
function filterDataByPeriod(data, period) {
    let filteredData = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
    const currentYear = now.getFullYear();
    switch (+period) {
      case 0:
        filteredData = data;
        break;
      case 1:
        filteredData = data.filter((item) => {
            let date = new Date(item.date);
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf();
            return date == today;
        });
        break;
      case 2:
        const yesterday = today - 86400000;
        filteredData = data.filter((item) => {
            let date = new Date(item.date);
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf();
            return date == yesterday;
        });
        break;
      case 3:
        const dayLastWeek = today - 86400000*7;
        filteredData = data.filter((item) => {
            let date = new Date(item.date);
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf();
            return date > dayLastWeek;
        });
        break;
      case 4:
        const currentMonth = now.getMonth()+1;
        filteredData = data.filter((item) => {
            const date = new Date(item.date);
            month = date.getMonth()+1;
            year = date.getFullYear();
            return ((month == currentMonth) && (year == currentYear));
        });
        break;
      case 5:
        const lastMonth = now.getMonth();
        filteredData = data.filter((item) => {
            const date = new Date(item.date);
            month = date.getMonth()+1;
            year = date.getFullYear();
            return ((month == lastMonth) && (year == currentYear));
        });
        break;
      default:
        console.log('Ошибка в фильтре по дате!');
    }
    return filteredData;
}
function filterDataByDuration(data, duration) {
    let durationFilter;
    switch (+duration) {
      case 0:
        return filteredData;
      case 1:
        durationFilter = 60;
        break;
      case 2:
        durationFilter = 180;
        break;
      case 3:
        durationFilter = 300;
        break;
      case 4:
        durationFilter = 600;
        break;
      default:
        console.log('Ошибка в фильтре по длительности!');
    }
    filteredData = data.filter((item) => {
        return item.duration < durationFilter;
    });
    return filteredData;
}
function filterData(data, filters) {
    let filteredData = data
    if (filters.period != 0) {
        filteredData = filterDataByPeriod(filteredData, filters.period);
    }
    if (filters.duration != 0) {
        filteredData = filterDataByDuration(filteredData, filters.duration);
    }
    filteredData = filterDataByNumber(filteredData);
    drawData(filteredData);
    return filteredData;
}