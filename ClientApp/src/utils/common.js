import numeral from 'numeral'
import React from 'react'
/**
 * returna una cadena en tipo capital
 * @param {String} string -  cadena de texto a covertir en Capital
 * @return {String} result
 */
const toCapital = string => [...string].map((c, i) => i == 0 ? c.toUpperCase() : c).join('');

/**
 * Convierte un date a ticks
 * @param {Date} date -  cadena de texto a covertir en Capital
 */
const getTicks = date => ((date.getTime() * 10000) + 621355968000000000);

export const cellRender = data => formatToMoney(data.value);

export const formatId = value => numeral(value).format('000000');

export const formatToMoney = value => numeral(value).format('0,0.00');

export const customizeTextAsPercent = data => `${data.value || 0} %`

export const cellAsBold = value => <b>{value}</b>;

export const phonePattern = /[-\s\./0-9]*$/g;
export const phoneRules = { X: /[0-9]/ };
export { getTicks }
export default toCapital