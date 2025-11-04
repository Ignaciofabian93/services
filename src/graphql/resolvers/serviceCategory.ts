import { ServiceCategoryService } from "../services/serviceCategory";
import { ServiceSubCategoryService } from "../services/serviceSubCategory";

export const ServiceCategoryResolver = {
  Query: {
    getServiceCategory: (_parent: unknown, args: { id: string }) =>
      ServiceCategoryService.getServiceCategory({ id: parseInt(args.id) }),
    getServiceSubCategories: (
      _parent: unknown,
      args: { serviceCategoryId: string; page?: number; pageSize?: number },
    ) =>
      ServiceSubCategoryService.getServiceSubCategories({
        serviceCategoryId: parseInt(args.serviceCategoryId),
        page: args.page || 1,
        pageSize: args.pageSize || 10,
      }),
    getServiceSubCategory: (_parent: unknown, args: { id: string }) =>
      ServiceSubCategoryService.getServiceSubCategory({ id: parseInt(args.id) }),
  },
};
