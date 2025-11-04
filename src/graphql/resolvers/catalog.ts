import { CatalogService } from "../services/catalog";

export const CatalogResolver = {
  Query: {
    serviceCatalog: (_parent: unknown, _args: unknown) => CatalogService.getServiceCatalog(),
  },
};
