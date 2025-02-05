import { Session } from "next-auth";

export type UserRole = "USER" | "ADMIN";

export type Permission =
  | "create:resume"
  | "edit:resume"
  | "delete:resume"
  | "view:resume"
  | "manage:users"
  | "manage:roles";

export const DEFAULT_USER_PERMISSIONS: Permission[] = [
  "create:resume",
  "edit:resume",
  "delete:resume",
  "view:resume",
];

export const ADMIN_PERMISSIONS: Permission[] = [
  ...DEFAULT_USER_PERMISSIONS,
  "manage:users",
  "manage:roles",
];

export const getRolePermissions = (role: UserRole): Permission[] => {
  switch (role) {
    case "ADMIN":
      return ADMIN_PERMISSIONS;
    case "USER":
      return DEFAULT_USER_PERMISSIONS;
    default:
      return [];
  }
};

export const hasPermission = (
  userPermissions: string[],
  requiredPermission: Permission
): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasRole = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  if (requiredRole === "USER") {
    return ["USER", "ADMIN"].includes(userRole);
  }
  return userRole === requiredRole;
};

export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === "ADMIN";
};

interface AuthSession extends Session {
  user: {
    role: UserRole;
    permissions: string[];
  } & Session["user"];
}

// Middleware helper functions
export const withPermission = (permission: Permission) => {
  return async (session: AuthSession | null) => {
    if (!session?.user?.permissions) return false;
    return hasPermission(session.user.permissions, permission);
  };
};

export const withRole = (role: UserRole) => {
  return async (session: AuthSession | null) => {
    if (!session?.user?.role) return false;
    return hasRole(session.user.role, role);
  };
};
