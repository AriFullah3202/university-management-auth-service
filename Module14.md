* [page , limit , sortBy, sortOrder](#page--limit--sortby--sortorder)
  * [images](#images)
  * [code](#code)
  * [Implementation Pagination using page , limit and skip](#implementaion-pagination-using-page--limit-and-skip)
  * [Implement dynamic sorting](#implement-dynamic-sorting)
    * [Dynamic pagination](#implement-dynamic-pagination)
    * [Dynamic sorting](#dynamic-sorting)


## Page , Limit , SortBy , SortOrder

## images
<div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
  <img src="./Screenshot%202023-06-13%20162750.png" alt="Image 1" style="flex: 1; width: 48%;">
</div>

## code
## Implementaion Pagination using page , limit and skip
in academicSemester.route.ts
```js
router.get('/', AcademicSemesterController.getSemisters);
```
in academicSemester.controller.ts
* src
  * shared
    * pick.ts
  * interface
    * pagination.ts
  * constant
    * paginationFields.ts


```js
//======================================pick.ts=================================
//======================================pick.ts=================================
//======================================pick.ts=================================

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


//===============================pagination.ts===========================================//
//===============================pagination.ts===========================================//
//===============================pagination.ts===========================================//

export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

//==============================paginationFields.ts======================================
//==============================paginationFields.ts======================================
//==============================paginationFields.ts======================================

export const paginationField = ['page', 'limit', 'sortBy', 'sortOrder'];

// ================================academicSemester.controller.ts====================================//
// ================================academicSemester.controller.ts====================================//
// ================================academicSemester.controller.ts====================================//


const getSemisters = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //ekhan theke pick.ts e jabe
    // ekhane req.query er moddhe ache value and paginationfield er moddhe ache
    // fileld
    //const paginationOptions = pick([ekhane sob value ache], ['page', 'limit', 'sortBy', 'sortOrder'] );

    // src => constant => paginationField.ts 
    const paginatinOptions = pick(req.query, paginationField);
    logger.info(paginatinOptions);
    const result = await AcademicSemesterService.getAllSemister(
      paginatinOptions
    );
    // app => shared => sendResponse.ts er moddhe jabe
    sendRespose<IAcademicSemester[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semister rerived susecssfully',
      meta: result.meta,
      data: result.data,
    });
    next();
  }
);
// ===========================================academicSemister.service.ts========================
// ===========================================academicSemister.service.ts========================
// ===========================================academicSemister.service.ts========================

// src => interface => IPaginationOptions.ts ekhane jacche 
const getAllSemister = async (
  paginatinOptions: IPaginationOptions
): Promise<IGenericResponse<IAcademicSemester[]>> => {
  const { page = 1, limit = 10 } = paginatinOptions;
  const skip = (page - 1) * limit;
  const result = await AcademicSemester.find().sort().skip(skip).limit(limit);

  const total = await AcademicSemester.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};



```
## implement dynamic sorting 
## implement dynamic pagination
implement dynamic pagination . amra sob admin , faculty , academic semister ,
sob jagai pagination lage 
eijonno ekta pagination helper file kuli
* src
  * helper
    * paginationHelper.ts
```js
type IOption = {
  page?: number;
  limit?: number;
};
type IOptionResult = {
  page: number;
  limit: number;
  skip: number;
};
const calculatePaginations = (option: IOption): IOptionResult => {
  // ekhane numbr e convert kora
  const page = Number(option.page || 1);
  const limit = Number(option.limit || 10);
  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip,
  };
};
export const paginationHelper = {
  calculatePaginations,
};
```
in academicSemister.ts 
```js
//before
 const { page = 1, limit = 10 } = paginatinOptions;
  const skip = (page - 1) * limit;
// after
  // src => helper => paginationHelper.ts
  const { page, limit, skip } =
    paginationHelper.calculatePaginations(paginatinOptions);
```
## Dynamic sorting
* src
  * helper
    * paginationHelper.ts

in pagingHelper.ts
```js
import { SortOrder } from 'mongoose';

type IOption = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};
type IOptionResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy : string;
  sortOrder : string;
};
const calculatePaginations = (option: IOption): IOptionResult => {
  // ekhane numbr e convert kora
  const page = Number(option.page || 1);
  const limit = Number(option.limit || 10);
  const skip = (page - 1) * limit;
  const sortBy = option.sortBy || `createdAt`;
  const sortOrder = option.sortOrder || 'desc';
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

```
### in academicSemester.service.ts
```js
  // amra paginationHelper maddhome amra pacchi {page , limit , skip , sortby , sortOrder}
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePaginations(paginatinOptions);
  // for sorting
  // empty object key and value type declaration
  const sortConditions: { [key: string]: SortOrder } = {};
  // if er maddohome object e key and value akare data save korchi
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await AcademicSemester.find()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
```



