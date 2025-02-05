export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  password: string | null;
  role: string;
  permissions: string[];
  tier: string;
  stripeId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  subscriptionEndDate: Date | null;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  permissions: string[];
  tier: string;
  subscriptionStatus: string | null;
}

export type UserTier = "FREE" | "PRO";

export interface SubscriptionData {
  tier: UserTier;
  status: string | null;
  currentPeriodEnd: Date | null;
}

export const isProUser = (user: {
  tier: string;
  subscriptionStatus: string | null;
}) => {
  return user.tier === "PRO" && user.subscriptionStatus === "active";
};

export const getSubscriptionStatus = (user: DbUser): SubscriptionData => {
  return {
    tier: user.tier as UserTier,
    status: user.subscriptionStatus,
    currentPeriodEnd: user.subscriptionEndDate,
  };
};
