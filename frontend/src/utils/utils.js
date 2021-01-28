/**
 * Данная функция берет массив, который вернул Promise.allSetled (с полями value и status)
 * и возвращает новый массив из полей value, если промис fulfilled или false, если промис rejected.
 *
 * @param  {Array} arr - исходный массив
 * @returns {Array}
 */
export const splitDataArray = (arr) =>
  arr.map((item) => (item.status === 'fulfilled' ? item.value : false));
