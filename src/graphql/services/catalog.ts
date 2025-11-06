import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";

export const CatalogService = {
  getServiceCatalog: async () => {
    try {
      const serviceCategories = await prisma.serviceCategory.findMany({
        select: {
          id: true,
          category: true,
          href: true,
          subcategories: {
            select: {
              id: true,
              subCategory: true,
              href: true,
            },
          },
        },
        orderBy: {
          category: "asc",
        },
      });

      if (!serviceCategories.length) {
        return new ErrorService.NotFoundError("No se encontraron categorías de servicios");
      }

      return serviceCategories;
    } catch (error) {
      console.error("Error al obtener el catálogo de servicios:", error);
      return new ErrorService.InternalServerError("Error al obtener el catálogo de servicios");
    }
  },
};
