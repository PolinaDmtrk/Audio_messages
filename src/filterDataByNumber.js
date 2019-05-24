export function filterDataByNumber(data) {
    const filter = $('#search input').val().toUpperCase();
    const filteredData = data.filter((item) => {
        return item.from.toUpperCase().indexOf(filter) > -1;
    });
    return filteredData;
}