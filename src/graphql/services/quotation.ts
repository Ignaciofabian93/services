import { QuotationStatus } from "@prisma/client";
import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { calculatePrismaParams } from "../../utils/pagination";

interface AddQuotationInput {
  serviceId: number;
  clientId: string;
  providerId: string;
  title: string;
  description: string;
  estimatedPrice?: number;
  estimatedDuration?: number;
  clientNotes?: string;
  attachments?: string[];
  expiresAt?: Date;
}

interface UpdateQuotationInput {
  id: number;
  estimatedPrice?: number;
  finalPrice?: number;
  estimatedDuration?: number;
  status?: QuotationStatus;
  clientNotes?: string;
  providerNotes?: string;
  attachments?: string[];
  expiresAt?: Date;
}

export const QuotationService = {
  getQuotation: async ({ id }: { id: number }) => {
    try {
      const quotation = await prisma.quotation.findUnique({
        where: { id },
        select: {
          id: true,
          serviceId: true,
          clientId: true,
          providerId: true,
          title: true,
          description: true,
          estimatedPrice: true,
          finalPrice: true,
          estimatedDuration: true,
          status: true,
          clientNotes: true,
          providerNotes: true,
          attachments: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          acceptedAt: true,
          completedAt: true,
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              pricingType: true,
            },
          },
        },
      });

      if (!quotation) {
        return new ErrorService.NotFoundError("Cotización no encontrada");
      }

      return {
        ...quotation,
        client: { __typename: "Seller", id: quotation.clientId },
        provider: { __typename: "Seller", id: quotation.providerId },
      };
    } catch (error) {
      console.error("Error al obtener la cotización:", error);
      return new ErrorService.InternalServerError("Error al obtener la cotización");
    }
  },

  getQuotationsByClient: async ({ clientId, page, pageSize }: { clientId: string; page: number; pageSize: number }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const [quotations, totalCount] = await Promise.all([
        prisma.quotation.findMany({
          where: { clientId },
          select: {
            id: true,
            serviceId: true,
            clientId: true,
            providerId: true,
            title: true,
            description: true,
            estimatedPrice: true,
            finalPrice: true,
            estimatedDuration: true,
            status: true,
            clientNotes: true,
            providerNotes: true,
            attachments: true,
            createdAt: true,
            updatedAt: true,
            expiresAt: true,
            acceptedAt: true,
            completedAt: true,
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                pricingType: true,
              },
            },
          },
          skip,
          take,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.quotation.count({ where: { clientId } }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        nodes: quotations.map((quotation) => ({
          ...quotation,
          client: { __typename: "Seller", id: quotation.clientId },
          provider: { __typename: "Seller", id: quotation.providerId },
        })),
        pageInfo: {
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          startCursor: quotations.length > 0 ? quotations[0].id.toString() : null,
          endCursor: quotations.length > 0 ? quotations[quotations.length - 1].id.toString() : null,
          totalCount,
          totalPages,
          currentPage: page,
          pageSize,
        },
      };
    } catch (error) {
      console.error("Error al obtener las cotizaciones del cliente:", error);
      return new ErrorService.InternalServerError("Error al obtener las cotizaciones del cliente");
    }
  },

  getQuotationsByProvider: async ({
    providerId,
    page,
    pageSize,
  }: {
    providerId: string;
    page: number;
    pageSize: number;
  }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const [quotations, totalCount] = await Promise.all([
        prisma.quotation.findMany({
          where: { providerId },
          select: {
            id: true,
            serviceId: true,
            clientId: true,
            providerId: true,
            title: true,
            description: true,
            estimatedPrice: true,
            finalPrice: true,
            estimatedDuration: true,
            status: true,
            clientNotes: true,
            providerNotes: true,
            attachments: true,
            createdAt: true,
            updatedAt: true,
            expiresAt: true,
            acceptedAt: true,
            completedAt: true,
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                pricingType: true,
              },
            },
          },
          skip,
          take,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.quotation.count({ where: { providerId } }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        nodes: quotations.map((quotation) => ({
          ...quotation,
          client: { __typename: "Seller", id: quotation.clientId },
          provider: { __typename: "Seller", id: quotation.providerId },
        })),
        pageInfo: {
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          startCursor: quotations.length > 0 ? quotations[0].id.toString() : null,
          endCursor: quotations.length > 0 ? quotations[quotations.length - 1].id.toString() : null,
          totalCount,
          totalPages,
          currentPage: page,
          pageSize,
        },
      };
    } catch (error) {
      console.error("Error al obtener las cotizaciones del proveedor:", error);
      return new ErrorService.InternalServerError("Error al obtener las cotizaciones del proveedor");
    }
  },

  getQuotationsByService: async ({
    serviceId,
    page,
    pageSize,
  }: {
    serviceId: number;
    page: number;
    pageSize: number;
  }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const [quotations, totalCount] = await Promise.all([
        prisma.quotation.findMany({
          where: { serviceId },
          select: {
            id: true,
            serviceId: true,
            clientId: true,
            providerId: true,
            title: true,
            description: true,
            estimatedPrice: true,
            finalPrice: true,
            estimatedDuration: true,
            status: true,
            clientNotes: true,
            providerNotes: true,
            attachments: true,
            createdAt: true,
            updatedAt: true,
            expiresAt: true,
            acceptedAt: true,
            completedAt: true,
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                pricingType: true,
              },
            },
          },
          skip,
          take,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.quotation.count({ where: { serviceId } }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        nodes: quotations.map((quotation) => ({
          ...quotation,
          client: { __typename: "Seller", id: quotation.clientId },
          provider: { __typename: "Seller", id: quotation.providerId },
        })),
        pageInfo: {
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          startCursor: quotations.length > 0 ? quotations[0].id.toString() : null,
          endCursor: quotations.length > 0 ? quotations[quotations.length - 1].id.toString() : null,
          totalCount,
          totalPages,
          currentPage: page,
          pageSize,
        },
      };
    } catch (error) {
      console.error("Error al obtener las cotizaciones del servicio:", error);
      return new ErrorService.InternalServerError("Error al obtener las cotizaciones del servicio");
    }
  },

  getQuotationsByStatus: async ({
    status,
    page,
    pageSize,
  }: {
    status: QuotationStatus;
    page: number;
    pageSize: number;
  }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const [quotations, totalCount] = await Promise.all([
        prisma.quotation.findMany({
          where: { status },
          select: {
            id: true,
            serviceId: true,
            clientId: true,
            providerId: true,
            title: true,
            description: true,
            estimatedPrice: true,
            finalPrice: true,
            estimatedDuration: true,
            status: true,
            clientNotes: true,
            providerNotes: true,
            attachments: true,
            createdAt: true,
            updatedAt: true,
            expiresAt: true,
            acceptedAt: true,
            completedAt: true,
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                pricingType: true,
              },
            },
          },
          skip,
          take,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.quotation.count({ where: { status } }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        nodes: quotations.map((quotation) => ({
          ...quotation,
          client: { __typename: "Seller", id: quotation.clientId },
          provider: { __typename: "Seller", id: quotation.providerId },
        })),
        pageInfo: {
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          startCursor: quotations.length > 0 ? quotations[0].id.toString() : null,
          endCursor: quotations.length > 0 ? quotations[quotations.length - 1].id.toString() : null,
          totalCount,
          totalPages,
          currentPage: page,
          pageSize,
        },
      };
    } catch (error) {
      console.error("Error al obtener las cotizaciones por estado:", error);
      return new ErrorService.InternalServerError("Error al obtener las cotizaciones por estado");
    }
  },

  addQuotation: async (input: AddQuotationInput) => {
    try {
      const quotation = await prisma.quotation.create({
        data: {
          serviceId: input.serviceId,
          clientId: input.clientId,
          providerId: input.providerId,
          title: input.title,
          description: input.description,
          estimatedPrice: input.estimatedPrice,
          estimatedDuration: input.estimatedDuration,
          clientNotes: input.clientNotes,
          attachments: input.attachments || [],
          expiresAt: input.expiresAt,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          serviceId: true,
          clientId: true,
          providerId: true,
          title: true,
          description: true,
          estimatedPrice: true,
          finalPrice: true,
          estimatedDuration: true,
          status: true,
          clientNotes: true,
          providerNotes: true,
          attachments: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          acceptedAt: true,
          completedAt: true,
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              pricingType: true,
            },
          },
        },
      });

      return {
        ...quotation,
        client: { __typename: "Seller", id: quotation.clientId },
        provider: { __typename: "Seller", id: quotation.providerId },
      };
    } catch (error) {
      console.error("Error al crear la cotización:", error);
      return new ErrorService.InternalServerError("Error al crear la cotización");
    }
  },

  updateQuotation: async (input: UpdateQuotationInput) => {
    try {
      const quotation = await prisma.quotation.update({
        where: { id: input.id },
        data: {
          ...(input.estimatedPrice !== undefined && { estimatedPrice: input.estimatedPrice }),
          ...(input.finalPrice !== undefined && { finalPrice: input.finalPrice }),
          ...(input.estimatedDuration !== undefined && { estimatedDuration: input.estimatedDuration }),
          ...(input.status && { status: input.status }),
          ...(input.clientNotes && { clientNotes: input.clientNotes }),
          ...(input.providerNotes && { providerNotes: input.providerNotes }),
          ...(input.attachments && { attachments: input.attachments }),
          ...(input.expiresAt && { expiresAt: input.expiresAt }),
          updatedAt: new Date(),
        },
        select: {
          id: true,
          serviceId: true,
          clientId: true,
          providerId: true,
          title: true,
          description: true,
          estimatedPrice: true,
          finalPrice: true,
          estimatedDuration: true,
          status: true,
          clientNotes: true,
          providerNotes: true,
          attachments: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          acceptedAt: true,
          completedAt: true,
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              pricingType: true,
            },
          },
        },
      });

      return {
        ...quotation,
        client: { __typename: "Seller", id: quotation.clientId },
        provider: { __typename: "Seller", id: quotation.providerId },
      };
    } catch (error) {
      console.error("Error al actualizar la cotización:", error);
      return new ErrorService.InternalServerError("Error al actualizar la cotización");
    }
  },

  acceptQuotation: async ({ id }: { id: number }) => {
    try {
      const quotation = await prisma.quotation.update({
        where: { id },
        data: {
          status: QuotationStatus.ACCEPTED,
          acceptedAt: new Date(),
          updatedAt: new Date(),
        },
        select: {
          id: true,
          serviceId: true,
          clientId: true,
          providerId: true,
          title: true,
          description: true,
          estimatedPrice: true,
          finalPrice: true,
          estimatedDuration: true,
          status: true,
          clientNotes: true,
          providerNotes: true,
          attachments: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          acceptedAt: true,
          completedAt: true,
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              pricingType: true,
            },
          },
        },
      });

      return {
        ...quotation,
        client: { __typename: "Seller", id: quotation.clientId },
        provider: { __typename: "Seller", id: quotation.providerId },
      };
    } catch (error) {
      console.error("Error al aceptar la cotización:", error);
      return new ErrorService.InternalServerError("Error al aceptar la cotización");
    }
  },

  declineQuotation: async ({ id, reason }: { id: number; reason?: string }) => {
    try {
      const quotation = await prisma.quotation.update({
        where: { id },
        data: {
          status: QuotationStatus.DECLINED,
          providerNotes: reason || undefined,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          serviceId: true,
          clientId: true,
          providerId: true,
          title: true,
          description: true,
          estimatedPrice: true,
          finalPrice: true,
          estimatedDuration: true,
          status: true,
          clientNotes: true,
          providerNotes: true,
          attachments: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          acceptedAt: true,
          completedAt: true,
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              pricingType: true,
            },
          },
        },
      });

      return {
        ...quotation,
        client: { __typename: "Seller", id: quotation.clientId },
        provider: { __typename: "Seller", id: quotation.providerId },
      };
    } catch (error) {
      console.error("Error al rechazar la cotización:", error);
      return new ErrorService.InternalServerError("Error al rechazar la cotización");
    }
  },

  completeQuotation: async ({ id }: { id: number }) => {
    try {
      const quotation = await prisma.quotation.update({
        where: { id },
        data: {
          status: QuotationStatus.COMPLETED,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
        select: {
          id: true,
          serviceId: true,
          clientId: true,
          providerId: true,
          title: true,
          description: true,
          estimatedPrice: true,
          finalPrice: true,
          estimatedDuration: true,
          status: true,
          clientNotes: true,
          providerNotes: true,
          attachments: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          acceptedAt: true,
          completedAt: true,
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              pricingType: true,
            },
          },
        },
      });

      return {
        ...quotation,
        client: { __typename: "Seller", id: quotation.clientId },
        provider: { __typename: "Seller", id: quotation.providerId },
      };
    } catch (error) {
      console.error("Error al completar la cotización:", error);
      return new ErrorService.InternalServerError("Error al completar la cotización");
    }
  },

  cancelQuotation: async ({ id, reason }: { id: number; reason?: string }) => {
    try {
      const quotation = await prisma.quotation.update({
        where: { id },
        data: {
          status: QuotationStatus.CANCELLED,
          providerNotes: reason || undefined,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          serviceId: true,
          clientId: true,
          providerId: true,
          title: true,
          description: true,
          estimatedPrice: true,
          finalPrice: true,
          estimatedDuration: true,
          status: true,
          clientNotes: true,
          providerNotes: true,
          attachments: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          acceptedAt: true,
          completedAt: true,
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              pricingType: true,
            },
          },
        },
      });

      return {
        ...quotation,
        client: { __typename: "Seller", id: quotation.clientId },
        provider: { __typename: "Seller", id: quotation.providerId },
      };
    } catch (error) {
      console.error("Error al cancelar la cotización:", error);
      return new ErrorService.InternalServerError("Error al cancelar la cotización");
    }
  },

  deleteQuotation: async ({ id }: { id: number }) => {
    try {
      await prisma.quotation.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Error al eliminar la cotización:", error);
      return false;
    }
  },
};
