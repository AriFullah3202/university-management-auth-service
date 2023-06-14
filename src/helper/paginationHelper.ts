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
