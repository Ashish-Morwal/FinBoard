// Simple storage interface for FinBoard
// This project uses localStorage on the frontend for data persistence
// and direct API calls to financial services

export interface IStorage {
  // Placeholder for future backend storage needs
  healthCheck(): Promise<{ status: string }>;
}

export class MemStorage implements IStorage {
  async healthCheck(): Promise<{ status: string }> {
    return { status: "ok" };
  }
}

export const storage = new MemStorage();
