// ekhane amra ki korbo ?
// { page: 1, limit: 10, sortBy: undefined, sortOrder: undefined }
// object ta amader banye dibe . for example
// joto gulo controller korbo sob jaygay req.query.page and req.query.limit likhte hbe . ei jonno amra ei file likhci
//ei funciton 2ta parameter nibe . ekta hocche object onno ta hocche kon kon field gula filter korbo
// generic use kore constraint disi je key hbe stirng and baki gula unknown

//['page','limit','sortBy','sortOrder']
// record hocche constrait
const pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[]
): Partial<T> => {
  // partial hocche
  const finalObj: Partial<T> = {};
  //ekhane loop korbe? 4 bar keys er modhe ki ache ? eigula ache ['page', 'limit', 'sortBy', 'sortOrder'];
  for (const key of keys) {
    //obj er moddhe ki ache? ekane koita req.query er modhe asche . for example
    ///academic-semesters/?page=1&limit=10 .. ekhane 2ta field ashche page and limit
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      // ja amra uri diye patabo oita finalObj er moddhe dekhabe
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

export default pick;
