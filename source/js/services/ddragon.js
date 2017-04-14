import http from 'lib/http';
import { format } from 'lib/strings';
import globals from 'services/globals';

const EndPoints = {
    BASE: 'http://ddragon.leagueoflegends.com/cdn/${version}',
    DATA: '/data/${locale}/${target}',
    IMAGE: '/img/${path}'
};

const DataTargets = {
    MASTERIES: 'mastery.json',
    RUNES: 'rune.json',
    CHAMPIONS: 'champion.json'
};

const DEFAULT_LOCALE = 'en_US';
const DEFAULT_VERSION = globals.version;

function fetchData(version, target, locale) {
    return http.get(
        format(EndPoints.BASE + EndPoints.DATA, {
            version: version || DEFAULT_VERSION,
            locale: locale || DEFAULT_LOCALE,
            target
        })
    ).then(res => JSON.parse(res.body))
}

function fetchImage(version, path, locale) {
    return http.get(imageURL(version, path, locale))
        .then(res => JSON.parse(res.body))
}

function imageURL(version, path, locale) {
    return format(EndPoints.BASE + EndPoints.IMAGE, {
        version: version || DEFAULT_VERSION,
        locale: locale || DEFAULT_LOCALE,
        path
    })
}

export { DataTargets };
export default { fetchData, fetchImage, imageURL };