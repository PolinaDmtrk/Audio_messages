import {filterDataByPeriod} from './filterDataByPeriod';
import {filterDataByDuration} from './filterDataByDuration';
import {filterDataByNumber} from './filterDataByNumber';
import {drawData} from './drawData';

export function filterData(data, filters) {
    let filteredData = data;
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