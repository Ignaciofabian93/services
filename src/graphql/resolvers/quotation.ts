import { QuotationStatus } from "../../types/enums";
import { QuotationService } from "../services/quotation";

export const QuotationResolver = {
  Query: {
    getQuotation: (_parent: unknown, args: { id: string }) => QuotationService.getQuotation({ id: parseInt(args.id) }),
    getQuotationsByClient: (_parent: unknown, args: { clientId: string; page?: number; pageSize?: number }) =>
      QuotationService.getQuotationsByClient({
        clientId: args.clientId,
        page: args.page || 1,
        pageSize: args.pageSize || 10,
      }),
    getQuotationsByProvider: (_parent: unknown, args: { providerId: string; page?: number; pageSize?: number }) =>
      QuotationService.getQuotationsByProvider({
        providerId: args.providerId,
        page: args.page || 1,
        pageSize: args.pageSize || 10,
      }),
    getQuotationsByService: (_parent: unknown, args: { serviceId: string; page?: number; pageSize?: number }) =>
      QuotationService.getQuotationsByService({
        serviceId: parseInt(args.serviceId),
        page: args.page || 1,
        pageSize: args.pageSize || 10,
      }),
    getQuotationsByStatus: (_parent: unknown, args: { status: QuotationStatus; page?: number; pageSize?: number }) =>
      QuotationService.getQuotationsByStatus({
        status: args.status,
        page: args.page || 1,
        pageSize: args.pageSize || 10,
      }),
  },
  Mutation: {
    addQuotation: (_parent: unknown, args: { input: any }) => QuotationService.addQuotation(args.input),
    updateQuotation: (_parent: unknown, args: { input: any }) => QuotationService.updateQuotation(args.input),
    acceptQuotation: (_parent: unknown, args: { id: string }) =>
      QuotationService.acceptQuotation({ id: parseInt(args.id) }),
    declineQuotation: (_parent: unknown, args: { id: string; reason?: string }) =>
      QuotationService.declineQuotation({ id: parseInt(args.id), reason: args.reason }),
    completeQuotation: (_parent: unknown, args: { id: string }) =>
      QuotationService.completeQuotation({ id: parseInt(args.id) }),
    cancelQuotation: (_parent: unknown, args: { id: string; reason?: string }) =>
      QuotationService.cancelQuotation({ id: parseInt(args.id), reason: args.reason }),
    deleteQuotation: (_parent: unknown, args: { id: string }) =>
      QuotationService.deleteQuotation({ id: parseInt(args.id) }),
  },
};
