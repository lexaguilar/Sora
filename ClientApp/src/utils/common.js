/**
 * returna una cadena en tipo capital
 * @param {String} string -  cadena de texto a covertir en Capital
 */
const toCapital = string => [...string].map((c, i) => i == 0 ? c.toUpperCase() : c).join('');

export default toCapital