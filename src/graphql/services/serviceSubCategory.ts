import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";

export const ServiceSubCategoryService = {
  getServiceSubCategories: async ({
    serviceCategoryId,
    page,
    pageSize,
  }: {
    serviceCategoryId: number;
    page: number;
    pageSize: number;
  }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const count = await prisma.serviceSubCategory.count({ where: { serviceCategoryId } });

      const subcategories = await prisma.serviceSubCategory.findMany({
        where: { serviceCategoryId },
        skip,
        take,
      });

      return createPaginatedResponse(subcategories, count, page, pageSize);
    } catch (error) {
      console.error("Error al obtener las subcategorías de servicio:", error);
      return new ErrorService.InternalServerError("Error al obtener las subcategorías de servicio");
    }
  },

  getServiceSubCategory: async ({ id }: { id: number }) => {
    try {
      const subcategory = await prisma.serviceSubCategory.findUnique({
        where: { id },
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
          _count: {
            select: {
              services: true,
            },
          },
        },
      });

      if (!subcategory) {
        return new ErrorService.NotFoundError("Subcategoría de servicio no encontrada");
      }

      return {
        ...subcategory,
        serviceCount: subcategory._count.services,
      };
    } catch (error) {
      console.error("Error al obtener la subcategoría de servicio:", error);
      return new ErrorService.InternalServerError("Error al obtener la subcategoría de servicio");
    }
  },
};
