# Nexus B2B: The Unified Wholesale & Procurement Ecosystem

Nexus B2B is a comprehensive, enterprise-grade full-stack platform designed to revolutionize B2B commerce. It provides a seamless bridge between manufacturers, suppliers, and retailers, offering sophisticated tools for procurement, inventory management, and financial oversight.

## 🌟 Overview

In the complex world of wholesale trade, Nexus B2B serves as a centralized hub that simplifies the entire supply chain lifecycle. From discovery and negotiation to fulfillment and payment, the platform offers a premium, high-performance experience tailored for modern business needs.

## ✨ Key Features

### 🏢 Enterprise Marketplace
*   **Supplier Discovery**: A curated directory of verified global suppliers across multiple industries (Electronics, Textiles, Construction, etc.).
*   **Product Catalog**: Deep exploration of product specifications, pricing tiers, and Minimum Order Quantities (MOQ).
*   **Trust Metrics**: Comprehensive supplier profiles with ratings, years in business, and fulfillment rates.

### 💼 Procurement & RFQ Workflow
*   **Request for Quotation (RFQ)**: Specialized tools for businesses to request custom quotes and negotiate terms.
*   **Order Tracking**: Real-time visibility into order status, from placement to final warehouse delivery.
*   **Smart Cart**: Multi-supplier cart management with automated price calculations.

### 💳 Financial Management
*   **Credit Hub**: Integrated credit limit management, allowing businesses to operate with flexible payment terms (NET30, NET60).
*   **Spending Analytics**: Visualized business intelligence providing insights into spending patterns and supplier performance.
*   **Invoicing**: Organized payment tracking and due-date notifications.

### 💬 Business Communication
*   **Unified Messaging**: Direct communication channel between buyers and suppliers for seamless negotiation and support.
*   **Critical Alerts**: Push notifications for order status changes, new quotes, and payment deadlines.

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Monorepo** | pnpm Workspaces |
| **Mobile Frontend** | Expo (React Native), Expo Router, React Native Reanimated |
| **Web Sandbox** | Vite, React, Tailwind CSS 4, Framer Motion |
| **Backend API** | Node.js, Express 5, TypeScript |
| **Database** | PostgreSQL, Drizzle ORM |
| **Validation** | Zod (End-to-end schema safety) |
| **API Codegen** | Orval (OpenAPI to React Query hooks) |
| **Tooling** | esbuild, pino (logging) |

## 📁 Project Structure

```text
Nexus-B2B/
├── artifacts/
│   ├── mobile/           # Expo React Native application
│   ├── api-server/       # Express backend server
│   └── mockup-sandbox/   # Vite-based UI component playground
├── lib/
│   ├── api-client-react/ # Auto-generated API hooks
│   ├── api-spec/         # OpenAPI specifications (Source of Truth)
│   ├── api-zod/          # Shared Zod schemas for validation
│   └── db/               # Database schema and Drizzle client
├── scripts/              # Workspace-wide utility scripts
└── package.json          # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites
*   **Node.js 24+**
*   **pnpm 10+**
*   **PostgreSQL** (for the API server)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Sir-Castro/Nexus-B2B.git
   cd Nexus-B2B
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Application
*   **Start Mobile App**:
    ```bash
    pnpm --filter @workspace/mobile run dev
    ```
*   **Start API Server**:
    ```bash
    pnpm --filter @workspace/api-server run dev
    ```
    *Note: Requires a `DATABASE_URL` environment variable.*

*   **Open Mockup Sandbox**:
    ```bash
    pnpm --filter @workspace/mockup-sandbox run dev
    ```

## 📐 Architecture Decisions

*   **API-First Design**: All communication is defined in the `api-spec` library using OpenAPI. This ensures the frontend and backend are always in sync through automated code generation.
*   **Type Safety**: TypeScript is enforced across the entire monorepo, with shared Zod schemas providing runtime validation for all API boundaries.
*   **Glassmorphism & High-End UI**: The mobile app employs modern design principles, including blur effects and subtle animations, to provide a premium enterprise feel.

---

Built with precision for the modern supply chain.
