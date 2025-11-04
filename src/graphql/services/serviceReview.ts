import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { calculatePrismaParams } from "../../utils/pagination";

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

      const [reviews, totalCount] = await Promise.all([
        prisma.serviceReview.findMany({
          where: { serviceId },
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
          skip,
          take,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.serviceReview.count({ where: { serviceId } }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        nodes: reviews.map((review) => ({
          ...review,
          reviewer: { __typename: "Seller", id: review.reviewerId },
        })),
        pageInfo: {
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          startCursor: reviews.length > 0 ? reviews[0].id.toString() : null,
          endCursor: reviews.length > 0 ? reviews[reviews.length - 1].id.toString() : null,
          totalCount,
          totalPages,
          currentPage: page,
          pageSize,
        },
      };
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

      const [reviews, totalCount] = await Promise.all([
        prisma.serviceReview.findMany({
          where: { reviewerId },
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
          skip,
          take,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.serviceReview.count({ where: { reviewerId } }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        nodes: reviews.map((review) => ({
          ...review,
          reviewer: { __typename: "Seller", id: review.reviewerId },
        })),
        pageInfo: {
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          startCursor: reviews.length > 0 ? reviews[0].id.toString() : null,
          endCursor: reviews.length > 0 ? reviews[reviews.length - 1].id.toString() : null,
          totalCount,
          totalPages,
          currentPage: page,
          pageSize,
        },
      };
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
