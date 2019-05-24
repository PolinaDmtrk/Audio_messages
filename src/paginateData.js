export function paginateData(data, currentPage, messagesPerPage) {
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessag = indexOfLastMessage - messagesPerPage;
    const paginatedData = data.slice(indexOfFirstMessag, indexOfLastMessage);
    return paginatedData;
}