import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";

export const ServiceCategoryService = {
  getServiceCategory: async ({ id }: { id: number }) => {
    try {
      const serviceCategory = await prisma.serviceCategory.findUnique({
        where: { id },
        select: {
          id: true,
          category: true,
          subcategories: {
            select: {
              id: true,
              subCategory: true,
              serviceCategoryId: true,
            },
          },
        },
      });

      if (!serviceCategory) {
        return new ErrorService.NotFoundError("Categoría de servicio no encontrada");
      }

      return serviceCategory;
    } catch (error) {
      console.error("Error al obtener la categoría de servicio:", error);
      return new ErrorService.InternalServerError("Error al obtener la categoría de servicio");
    }
  },
};
