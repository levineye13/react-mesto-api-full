/**
 * Данная функция берет массив, который вернул Promise.allSetled (с полями value и status)
 * и возвращает новый массив из полей value
 *
 * @param  {Array} arr - исходный массив
 * @returns {Array}
 */
export const splitDataArray = (arr) => arr.map((subArr) => subArr.value);
