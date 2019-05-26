import {paginateData} from './paginateData';
import {modifyDate} from './modifyDate';
import {drawPages} from './drawPages';
import {modifyTime} from './modifyTime';

export function drawData(data, currentPage = 1, messagesPerPage = 10) {
    const paginatedData = paginateData(data, currentPage, messagesPerPage);
    $('#data tbody').empty();
    $(paginatedData).each((i, item) => {
        const date = modifyDate(item.date);
        const duration = `<label>${modifyTime(Math.floor(item.duration/60))}</label>:<label>${modifyTime(Math.ceil(item.duration % 60))}</label>`;
		const audio = `<audio class="player" src="${item.audioName}" type="audio/wav"></audio><div class="audio"><button class="play"><i class="fas fa-play-circle"></i></button><label class="minutes">00</label>:<label class="seconds">00</label><div class="myProgress"><div class="myBar"></div></div>${duration}<form method="get" action="${item.audioName}"><button type="submit"><i class="fas fa-download"></i></button></form></div>`;
        const td = `<td>${date}</td><td>${item.from}</td><td>${audio}</td>`;
        $('#data tbody').append(`<tr>${td}</tr>`);
    });
    drawPages(data.length, messagesPerPage);
}