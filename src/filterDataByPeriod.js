export function filterDataByPeriod(data, period) {
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
            const month = date.getMonth()+1;
            const year = date.getFullYear();
            return ((month == currentMonth) && (year == currentYear));
        });
        break;
      case 5:
        const lastMonth = now.getMonth();
        filteredData = data.filter((item) => {
            const date = new Date(item.date);
            const month = date.getMonth()+1;
            const year = date.getFullYear();
            return ((month == lastMonth) && (year == currentYear));
        });
        break;
      default:
        console.log('Ошибка в фильтре по дате!');
    }
    return filteredData;
}