import { ServicePricing } from "../../types/enums";
import { ServiceService } from "../services/service";

export const ServiceResolver = {
  Query: {
    getService: (_parent: unknown, args: { id: string }) => ServiceService.getService({ id: parseInt(args.id) }),
    getServices: (_parent: unknown, args: { page?: number; pageSize?: number; isActive?: boolean }) =>
      ServiceService.getServices({
        page: args.page || 1,
        pageSize: args.pageSize || 10,
        isActive: args.isActive,
      }),
    getServicesBySeller: (
      _parent: unknown,
      args: { sellerId: string; page?: number; pageSize?: number; isActive?: boolean },
    ) =>
      ServiceService.getServicesBySeller({
        sellerId: args.sellerId,
        page: args.page || 1,
        pageSize: args.pageSize || 10,
        isActive: args.isActive,
      }),
    getServicesBySubCategory: (
      _parent: unknown,
      args: { subcategoryId: string; page?: number; pageSize?: number; isActive?: boolean },
    ) =>
      ServiceService.getServicesBySubCategory({
        subcategoryId: parseInt(args.subcategoryId),
        page: args.page || 1,
        pageSize: args.pageSize || 10,
        isActive: args.isActive,
      }),
    getServicesByPricingType: (
      _parent: unknown,
      args: { pricingType: ServicePricing; page?: number; pageSize?: number; isActive?: boolean },
    ) =>
      ServiceService.getServicesByPricingType({
        pricingType: args.pricingType,
        page: args.page || 1,
        pageSize: args.pageSize || 10,
        isActive: args.isActive,
      }),
  },
  Mutation: {
    addService: (_parent: unknown, args: { input: any }) => ServiceService.addService(args.input),
    updateService: (_parent: unknown, args: { input: any }) => ServiceService.updateService(args.input),
    deleteService: (_parent: unknown, args: { id: string }) => ServiceService.deleteService({ id: parseInt(args.id) }),
    toggleServiceActive: (_parent: unknown, args: { id: string }) =>
      ServiceService.toggleServiceActive({ id: parseInt(args.id) }),
  },
};
