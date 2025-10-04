export interface JoinTenantData {
  invitationCode: string;
  ownerEmail: string | null;
}

export interface CacheConfig {
  ttl?: number;
  staleWhileRevalidate?: boolean;
  retryAttempts?: number;
}

export interface CacheKey {
  scope: string;
  identifier?: string | number;
  params?: Record<string, any>;
}
