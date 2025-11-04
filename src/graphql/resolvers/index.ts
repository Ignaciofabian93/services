import { MainResolver } from "./main";

export const resolvers = {
  Query: {
    ...MainResolver.Query,
  },
  Mutation: {
    ...MainResolver.Mutation,
  },
  // Service: {
  //   __resolveReference: MainResolver.Service.__resolveReference,
  // },
  // ServiceCategory: {
  //   __resolveReference: MainResolver.ServiceCategory.__resolveReference,
  // },
  // ServiceSubCategory: {
  //   __resolveReference: MainResolver.ServiceSubCategory.__resolveReference,
  // },
  // Quotation: {
  //   __resolveReference: MainResolver.Quotation.__resolveReference,
  // },
};
