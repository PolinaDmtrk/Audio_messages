import {paginateData} from './paginateData';
import {modifyDate} from './modifyDate';
import {drawPages} from './drawPages';

export function drawData(data, currentPage = 1, messagesPerPage = 10) {
    const paginatedData = paginateData(data, currentPage, messagesPerPage);
    $('#data tbody').empty();
    $(paginatedData).each((i, item) => {
        const date = modifyDate(item.date);
        const td = `<td>${date}</td><td>${item.from}</td><td><audio class="audio" src="${item.audio}" controls type="audio/wav"></audio></td>`;
        $('#data tbody').append(`<tr>${td}</tr>`);
    });
    drawPages(data.length, messagesPerPage);
}