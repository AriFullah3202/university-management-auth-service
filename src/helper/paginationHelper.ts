import { SortOrder } from 'mongoose';

type IOption = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};
// ekhane sortOrder e mongoes er SortOrder dite hbe na hoy sort method accept korbe na
type IOptionResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
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
export const paginationHelper = {
  calculatePaginations,
};
