import { CatalogResolver } from "./catalog";
import { ServiceCategoryResolver } from "./serviceCategory";
import { ServiceResolver } from "./service";
import { QuotationResolver } from "./quotation";
import { ServiceReviewResolver } from "./serviceReview";

export const MainResolver = {
  Query: {
    ...CatalogResolver.Query,
    ...ServiceCategoryResolver.Query,
    ...ServiceResolver.Query,
    ...QuotationResolver.Query,
    ...ServiceReviewResolver.Query,
  },
  Mutation: {
    ...ServiceResolver.Mutation,
    ...QuotationResolver.Mutation,
    ...ServiceReviewResolver.Mutation,
  },
};
