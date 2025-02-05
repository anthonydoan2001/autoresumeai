import { Session } from "next-auth";
import { UserTier } from "@/app/types/auth";

interface SubscriptionStatus {
  isActive: boolean;
  isPro: boolean;
  isFree: boolean;
  tier: UserTier;
  status: string | null;
}

export const checkSubscriptionStatus = (
  session: Session | null
): SubscriptionStatus | null => {
  if (!session?.user) return null;

  const { tier, subscriptionStatus } = session.user;
  return {
    isActive: subscriptionStatus === "active",
    isPro: tier === "PRO" && subscriptionStatus === "active",
    isFree: tier === "FREE",
    tier: tier as UserTier,
    status: subscriptionStatus,
  };
};

export const requireProSubscription = (session: Session | null): boolean => {
  const subscription = checkSubscriptionStatus(session);
  return subscription?.isPro ?? false;
};

interface FeatureLimits {
  resumes: number;
  templates: number;
  aiSuggestions: number;
}

const FEATURE_LIMITS: Record<UserTier, FeatureLimits> = {
  FREE: {
    resumes: 3,
    templates: 5,
    aiSuggestions: 10,
  },
  PRO: {
    resumes: Infinity,
    templates: Infinity,
    aiSuggestions: Infinity,
  },
};

export const getFeatureLimit = (tier: UserTier): FeatureLimits => {
  return FEATURE_LIMITS[tier];
};

export const canAccessFeature = (
  session: Session | null,
  feature: keyof FeatureLimits,
  currentCount: number
): boolean => {
  const subscription = checkSubscriptionStatus(session);
  if (!subscription) return false;

  const limits = getFeatureLimit(subscription.tier);
  return currentCount < limits[feature];
};

export const getUpgradeMessage = (feature: string): string => {
  return `Upgrade to PRO to access unlimited ${feature}`;
};
