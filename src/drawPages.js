export function drawPages(count, messagesPerPage) {
    $('.pages').empty();
    for (let i = 1; i <= Math.ceil(count/messagesPerPage); i++) {
        $('.pages').append(`<a href="#" class="page">${i}</a>`);
    }
}