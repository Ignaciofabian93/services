import { ServiceReviewService } from "../services/serviceReview";

export const ServiceReviewResolver = {
  Query: {
    getServiceReviews: (_parent: unknown, args: { serviceId: string; page?: number; pageSize?: number }) =>
      ServiceReviewService.getServiceReviews({
        serviceId: parseInt(args.serviceId),
        page: args.page || 1,
        pageSize: args.pageSize || 10,
      }),
    getServiceReviewsByReviewer: (_parent: unknown, args: { reviewerId: string; page?: number; pageSize?: number }) =>
      ServiceReviewService.getServiceReviewsByReviewer({
        reviewerId: args.reviewerId,
        page: args.page || 1,
        pageSize: args.pageSize || 10,
      }),
  },
  Mutation: {
    addServiceReview: (_parent: unknown, args: { input: any }) => ServiceReviewService.addServiceReview(args.input),
    deleteServiceReview: (_parent: unknown, args: { id: string }) =>
      ServiceReviewService.deleteServiceReview({ id: parseInt(args.id) }),
  },
};
