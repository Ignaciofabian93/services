import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { ServicePricing } from "../../types/enums";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";

interface AddServiceInput {
  name: string;
  description?: string;
  subcategoryId: number;
  pricingType: ServicePricing;
  basePrice?: number;
  priceRange?: string;
  duration?: number;
  images: string[];
  tags: string[];
  sellerId: string;
  isActive?: boolean;
}

interface UpdateServiceInput {
  id: number;
  name?: string;
  description?: string;
  subcategoryId?: number;
  pricingType?: ServicePricing;
  basePrice?: number;
  priceRange?: string;
  duration?: number;
  images?: string[];
  tags?: string[];
  isActive?: boolean;
}

export const ServiceService = {
  getService: async ({ id }: { id: number }) => {
    try {
      const service = await prisma.service.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          sellerId: true,
          subcategoryId: true,
          pricingType: true,
          basePrice: true,
          priceRange: true,
          duration: true,
          isActive: true,
          images: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          serviceCategory: {
            select: {
              id: true,
              subCategory: true,
              serviceCategoryId: true,
              serviceCategory: {
                select: {
                  id: true,
                  category: true,
                },
              },
            },
          },
          quotation: {
            select: {
              id: true,
              status: true,
              estimatedPrice: true,
              finalPrice: true,
            },
          },
          serviceReview: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              reviewerId: true,
            },
          },
        },
      });

      if (!service) {
        return new ErrorService.NotFoundError("Servicio no encontrado");
      }

      // Calculate average rating and review count
      const averageRating =
        service.serviceReview.length > 0
          ? service.serviceReview.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) /
            service.serviceReview.length
          : 0;

      return {
        ...service,
        quotations: service.quotation,
        reviews: service.serviceReview,
        averageRating,
        reviewCount: service.serviceReview.length,
      };
    } catch (error) {
      console.error("Error al obtener el servicio:", error);
      return new ErrorService.InternalServerError("Error al obtener el servicio");
    }
  },

  getServices: async ({ page, pageSize, isActive }: { page: number; pageSize: number; isActive?: boolean }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const where = isActive !== undefined ? { isActive } : {};
      const count = await prisma.service.count({ where });
      const services = await prisma.service.findMany({
        where,
        take,
        skip,
      });

      return createPaginatedResponse(services, count, page, pageSize);
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
      return new ErrorService.InternalServerError("Error al obtener los servicios");
    }
  },

  getServicesBySeller: async ({
    sellerId,
    page,
    pageSize,
    isActive,
  }: {
    sellerId: string;
    page: number;
    pageSize: number;
    isActive?: boolean;
  }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const where = {
        sellerId,
        ...(isActive !== undefined && { isActive }),
      };

      const count = await prisma.service.count({ where });
      const services = await prisma.service.findMany({
        where,
        skip,
        take,
      });
      return createPaginatedResponse(services, count, page, pageSize);
    } catch (error) {
      console.error("Error al obtener los servicios del vendedor:", error);
      return new ErrorService.InternalServerError("Error al obtener los servicios del vendedor");
    }
  },

  getServicesBySubCategory: async ({
    subcategoryId,
    page,
    pageSize,
    isActive,
  }: {
    subcategoryId: number;
    page: number;
    pageSize: number;
    isActive?: boolean;
  }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const where = {
        subcategoryId,
        ...(isActive !== undefined && { isActive }),
      };
      const count = await prisma.service.count({ where });
      const services = await prisma.service.findMany({
        where,
        skip,
        take,
      });
      return createPaginatedResponse(services, count, page, pageSize);
    } catch (error) {
      console.error("Error al obtener los servicios por subcategoría:", error);
      return new ErrorService.InternalServerError("Error al obtener los servicios por subcategoría");
    }
  },

  getServicesByPricingType: async ({
    pricingType,
    page,
    pageSize,
    isActive,
  }: {
    pricingType: ServicePricing;
    page: number;
    pageSize: number;
    isActive?: boolean;
  }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const where = {
        pricingType,
        ...(isActive !== undefined && { isActive }),
      };
      const count = await prisma.service.count({ where });
      const services = await prisma.service.findMany({
        where,
        skip,
        take,
      });
      return createPaginatedResponse(services, count, page, pageSize);
    } catch (error) {
      console.error("Error al obtener los servicios por tipo de precio:", error);
      return new ErrorService.InternalServerError("Error al obtener los servicios por tipo de precio");
    }
  },

  addService: async (input: AddServiceInput) => {
    try {
      const service = await prisma.service.create({
        data: {
          name: input.name,
          description: input.description,
          subcategoryId: input.subcategoryId,
          pricingType: input.pricingType,
          basePrice: input.basePrice,
          priceRange: input.priceRange,
          duration: input.duration,
          images: input.images,
          tags: input.tags,
          sellerId: input.sellerId,
          isActive: input.isActive ?? true,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          description: true,
          sellerId: true,
          subcategoryId: true,
          pricingType: true,
          basePrice: true,
          priceRange: true,
          duration: true,
          isActive: true,
          images: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          serviceCategory: {
            select: {
              id: true,
              subCategory: true,
              serviceCategoryId: true,
            },
          },
        },
      });

      return {
        ...service,
        quotations: [],
        reviews: [],
        averageRating: 0,
        reviewCount: 0,
      };
    } catch (error) {
      console.error("Error al crear el servicio:", error);
      return new ErrorService.InternalServerError("Error al crear el servicio");
    }
  },

  updateService: async (input: UpdateServiceInput) => {
    try {
      const service = await prisma.service.update({
        where: { id: input.id },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.description && { description: input.description }),
          ...(input.subcategoryId && { subcategoryId: input.subcategoryId }),
          ...(input.pricingType && { pricingType: input.pricingType }),
          ...(input.basePrice !== undefined && { basePrice: input.basePrice }),
          ...(input.priceRange && { priceRange: input.priceRange }),
          ...(input.duration !== undefined && { duration: input.duration }),
          ...(input.images && { images: input.images }),
          ...(input.tags && { tags: input.tags }),
          ...(input.isActive !== undefined && { isActive: input.isActive }),
        },
        select: {
          id: true,
          name: true,
          description: true,
          sellerId: true,
          subcategoryId: true,
          pricingType: true,
          basePrice: true,
          priceRange: true,
          duration: true,
          isActive: true,
          images: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          serviceCategory: {
            select: {
              id: true,
              subCategory: true,
              serviceCategoryId: true,
            },
          },
          _count: {
            select: {
              quotation: true,
              serviceReview: true,
            },
          },
        },
      });

      return {
        ...service,
        quotations: [],
        reviews: [],
        averageRating: 0,
        reviewCount: service._count.serviceReview,
      };
    } catch (error) {
      console.error("Error al actualizar el servicio:", error);
      return new ErrorService.InternalServerError("Error al actualizar el servicio");
    }
  },

  deleteService: async ({ id }: { id: number }) => {
    try {
      const service = await prisma.service.delete({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          sellerId: true,
          subcategoryId: true,
          pricingType: true,
          basePrice: true,
          priceRange: true,
          duration: true,
          isActive: true,
          images: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        ...service,
        quotations: [],
        reviews: [],
        averageRating: 0,
        reviewCount: 0,
      };
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
      return new ErrorService.InternalServerError("Error al eliminar el servicio");
    }
  },

  toggleServiceActive: async ({ id }: { id: number }) => {
    try {
      const currentService = await prisma.service.findUnique({
        where: { id },
        select: { isActive: true },
      });

      if (!currentService) {
        return new ErrorService.NotFoundError("Servicio no encontrado");
      }

      const service = await prisma.service.update({
        where: { id },
        data: { isActive: !currentService.isActive },
        select: {
          id: true,
          name: true,
          description: true,
          sellerId: true,
          subcategoryId: true,
          pricingType: true,
          basePrice: true,
          priceRange: true,
          duration: true,
          isActive: true,
          images: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          serviceCategory: {
            select: {
              id: true,
              subCategory: true,
              serviceCategoryId: true,
            },
          },
          _count: {
            select: {
              quotation: true,
              serviceReview: true,
            },
          },
        },
      });

      return {
        ...service,
        quotations: [],
        reviews: [],
        averageRating: 0,
        reviewCount: service._count.serviceReview,
      };
    } catch (error) {
      console.error("Error al cambiar el estado del servicio:", error);
      return new ErrorService.InternalServerError("Error al cambiar el estado del servicio");
    }
  },
};
