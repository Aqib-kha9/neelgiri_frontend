export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  isSystem: boolean;
}

export interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}
