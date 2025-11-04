import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

  # Federated seller type
  extend type Seller @key(fields: "id") {
    id: ID! @external
  }

  enum ServicePricing {
    FIXED
    QUOTATION
    HOURLY
    PACKAGE
  }

  enum QuotationStatus {
    PENDING
    ACCEPTED
    DECLINED
    COMPLETED
    CANCELLED
    EXPIRED
  }

  scalar DateTime
  scalar JSON

  type PageInfo @shareable {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
    pageSize: Int!
  }

  type ServiceCategory @key(fields: "id") {
    id: ID!
    category: String!
    subcategories: [ServiceSubCategory!]!
    services: ServiceConnection!
  }

  type ServiceSubCategory @key(fields: "id") {
    id: ID!
    subCategory: String!
    serviceCategoryId: Int!
    serviceCategory: ServiceCategory
    services: ServiceConnection!
    serviceCount: Int
  }

  type Service @key(fields: "id") {
    id: ID!
    name: String!
    description: String
    sellerId: String!
    subcategoryId: Int!
    pricingType: ServicePricing!
    basePrice: Float
    priceRange: String
    duration: Int
    isActive: Boolean!
    images: [String!]!
    tags: [String!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    serviceCategory: ServiceSubCategory
    seller: Seller
    quotations: [Quotation!]!
    reviews: [ServiceReview!]!
    averageRating: Float
    reviewCount: Int!
  }

  type ServiceReview @key(fields: "id") {
    id: ID!
    serviceId: Int!
    reviewerId: String!
    rating: Int!
    comment: String
    createdAt: DateTime!
    service: Service
    reviewer: Seller
  }

  type Quotation @key(fields: "id") {
    id: ID!
    serviceId: Int!
    clientId: String!
    providerId: String!
    title: String!
    description: String!
    estimatedPrice: Float
    finalPrice: Float
    estimatedDuration: Int
    status: QuotationStatus!
    clientNotes: String
    providerNotes: String
    attachments: [String!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    expiresAt: DateTime
    acceptedAt: DateTime
    completedAt: DateTime
    service: Service
    client: Seller
    provider: Seller
  }

  input AddServiceInput {
    name: String!
    description: String
    subcategoryId: Int!
    pricingType: ServicePricing!
    basePrice: Float
    priceRange: String
    duration: Int
    images: [String!]!
    tags: [String!]
    sellerId: String!
    isActive: Boolean
  }

  input UpdateServiceInput {
    id: ID!
    name: String
    description: String
    subcategoryId: Int
    pricingType: ServicePricing
    basePrice: Float
    priceRange: String
    duration: Int
    images: [String!]
    tags: [String!]
    isActive: Boolean
  }

  input AddQuotationInput {
    serviceId: Int!
    clientId: String!
    providerId: String!
    title: String!
    description: String!
    estimatedPrice: Float
    estimatedDuration: Int
    clientNotes: String
    attachments: [String!]
    expiresAt: DateTime
  }

  input UpdateQuotationInput {
    id: ID!
    estimatedPrice: Float
    finalPrice: Float
    estimatedDuration: Int
    status: QuotationStatus
    clientNotes: String
    providerNotes: String
    attachments: [String!]
    expiresAt: DateTime
  }

  input AddServiceReviewInput {
    serviceId: Int!
    reviewerId: String!
    rating: Int!
    comment: String
  }

  type ServiceCategoryConnection {
    nodes: [ServiceCategory!]!
    pageInfo: PageInfo!
  }

  type ServiceSubCategoryConnection {
    nodes: [ServiceSubCategory!]!
    pageInfo: PageInfo!
  }

  type ServiceConnection {
    nodes: [Service!]!
    pageInfo: PageInfo!
  }

  type QuotationConnection {
    nodes: [Quotation!]!
    pageInfo: PageInfo!
  }

  type ServiceReviewConnection {
    nodes: [ServiceReview!]!
    pageInfo: PageInfo!
  }

  extend type Query {
    # Service Catalog
    serviceCatalog: [ServiceCategory]

    # Service Category Queries
    getServiceCategory(id: ID!): ServiceCategory
    getServiceSubCategories(serviceCategoryId: ID!, page: Int = 1, pageSize: Int = 10): ServiceSubCategoryConnection
    getServiceSubCategory(id: ID!): ServiceSubCategory

    # Service Queries
    getService(id: ID!): Service
    getServices(page: Int = 1, pageSize: Int = 10, isActive: Boolean): ServiceConnection
    getServicesBySeller(sellerId: ID!, page: Int = 1, pageSize: Int = 10, isActive: Boolean): ServiceConnection
    getServicesBySubCategory(
      subcategoryId: ID!
      page: Int = 1
      pageSize: Int = 10
      isActive: Boolean
    ): ServiceConnection
    getServicesByPricingType(
      pricingType: ServicePricing!
      page: Int = 1
      pageSize: Int = 10
      isActive: Boolean
    ): ServiceConnection

    # Quotation Queries
    getQuotation(id: ID!): Quotation
    getQuotationsByClient(clientId: ID!, page: Int = 1, pageSize: Int = 10): QuotationConnection
    getQuotationsByProvider(providerId: ID!, page: Int = 1, pageSize: Int = 10): QuotationConnection
    getQuotationsByService(serviceId: ID!, page: Int = 1, pageSize: Int = 10): QuotationConnection
    getQuotationsByStatus(status: QuotationStatus!, page: Int = 1, pageSize: Int = 10): QuotationConnection

    # Review Queries
    getServiceReviews(serviceId: ID!, page: Int = 1, pageSize: Int = 10): ServiceReviewConnection
    getServiceReviewsByReviewer(reviewerId: ID!, page: Int = 1, pageSize: Int = 10): ServiceReviewConnection
  }

  extend type Mutation {
    # Service Mutations
    addService(input: AddServiceInput!): Service
    updateService(input: UpdateServiceInput!): Service
    deleteService(id: ID!): Service
    toggleServiceActive(id: ID!): Service

    # Quotation Mutations
    addQuotation(input: AddQuotationInput!): Quotation
    updateQuotation(input: UpdateQuotationInput!): Quotation
    acceptQuotation(id: ID!): Quotation
    declineQuotation(id: ID!, reason: String): Quotation
    completeQuotation(id: ID!): Quotation
    cancelQuotation(id: ID!, reason: String): Quotation
    deleteQuotation(id: ID!): Boolean

    # Service Review Mutations
    addServiceReview(input: AddServiceReviewInput!): ServiceReview
    deleteServiceReview(id: ID!): Boolean
  }
`;
