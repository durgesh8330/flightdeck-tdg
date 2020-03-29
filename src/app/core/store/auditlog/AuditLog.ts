export interface AuditLog {
    createdById ?: string;
    resourceId ?: string;
    module ?: string;
    type ?: string;
    value ?: string;
    display ?: string;
    status ?: string;
    detail ?: string;
  }