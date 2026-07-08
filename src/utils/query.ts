import { Model } from "mongoose";

interface QueryOptions {
  model: Model<any>;
  query: any;
  searchFields?: string[];
  allowedFilters?: string[];
  populate?: string | string[];
  select?: string;
  defaultLimit?: number;
  extraFilter?: any;
}

export const paginate = async ({
  model,
  query,
  searchFields = [],
  allowedFilters = [],
  populate,
  select,
  defaultLimit = 10,
  extraFilter = {},
}: QueryOptions) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || defaultLimit;
  const skip = (page - 1) * limit;

  const filter: any = { ...extraFilter };

  // Search
  if (query.search && searchFields.length) {
    filter.$or = searchFields.map((field) => ({
      [field]: {
        $regex: query.search,
        $options: "i",
      },
    }));
  }

  // Filters
  allowedFilters.forEach((field) => {
    if (query[field] !== undefined) {
      filter[field] = query[field];
    }
  });

  // Sorting
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;

  let dbQuery = model.find(filter);

  if (select) {
    dbQuery = dbQuery.select(select);
  }

  if (populate) {
    dbQuery = dbQuery.populate(populate);
  }

  const data = await dbQuery
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await model.countDocuments(filter);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};
