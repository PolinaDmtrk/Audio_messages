export function filterDataByDuration(data, duration) {
    let durationFilter;
    switch (+duration) {
      case 0:
        return data;
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
    const filteredData = data.filter((item) => {
        return item.duration < durationFilter;
    });
    return filteredData;
}