import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";

interface AddServiceReviewInput {
  serviceId: number;
  reviewerId: string;
  rating: number;
  comment?: string;
}

export const ServiceReviewService = {
  getServiceReviews: async ({ serviceId, page, pageSize }: { serviceId: number; page: number; pageSize: number }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const count = await prisma.serviceReview.count({ where: { serviceId } });
      const reviews = await prisma.serviceReview.findMany({
        where: { serviceId },
        skip,
        take,
      });
      return createPaginatedResponse(reviews, count, page, pageSize);
    } catch (error) {
      console.error("Error al obtener las reseñas del servicio:", error);
      return new ErrorService.InternalServerError("Error al obtener las reseñas del servicio");
    }
  },

  getServiceReviewsByReviewer: async ({
    reviewerId,
    page,
    pageSize,
  }: {
    reviewerId: string;
    page: number;
    pageSize: number;
  }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const count = await prisma.serviceReview.count({ where: { reviewerId } });
      const reviews = await prisma.serviceReview.findMany({
        where: { reviewerId },
        skip,
        take,
      });
      return createPaginatedResponse(reviews, count, page, pageSize);
    } catch (error) {
      console.error("Error al obtener las reseñas del revisor:", error);
      return new ErrorService.InternalServerError("Error al obtener las reseñas del revisor");
    }
  },

  addServiceReview: async (input: AddServiceReviewInput) => {
    try {
      // Check if user already reviewed this service
      const existingReview = await prisma.serviceReview.findFirst({
        where: {
          serviceId: input.serviceId,
          reviewerId: input.reviewerId,
        },
      });

      if (existingReview) {
        return new ErrorService.BadRequestError("Ya has reseñado este servicio");
      }

      const review = await prisma.serviceReview.create({
        data: {
          serviceId: input.serviceId,
          reviewerId: input.reviewerId,
          rating: input.rating,
          comment: input.comment,
        },
        select: {
          id: true,
          serviceId: true,
          reviewerId: true,
          rating: true,
          comment: true,
          createdAt: true,
          service: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });

      return {
        ...review,
        reviewer: { __typename: "Seller", id: review.reviewerId },
      };
    } catch (error) {
      console.error("Error al crear la reseña del servicio:", error);
      return new ErrorService.InternalServerError("Error al crear la reseña del servicio");
    }
  },

  deleteServiceReview: async ({ id }: { id: number }) => {
    try {
      await prisma.serviceReview.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Error al eliminar la reseña del servicio:", error);
      return false;
    }
  },
};
