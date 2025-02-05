"use client";

import { useSession } from "next-auth/react";
import {
  checkSubscriptionStatus,
  getFeatureLimit,
} from "@/app/lib/subscription";
import { UserTier } from "@/app/types/auth";

export function useSubscription() {
  const { data: session } = useSession();
  const subscription = checkSubscriptionStatus(session);

  return {
    // Basic subscription status
    isLoading: false,
    subscription,
    isPro: subscription?.isPro ?? false,
    isFree: subscription?.isFree ?? true,
    tier: (subscription?.tier ?? "FREE") as UserTier,
    status: subscription?.status ?? null,

    // Feature access helpers
    canAccessFeature: (
      feature: keyof ReturnType<typeof getFeatureLimit>,
      currentCount: number
    ) => {
      if (!subscription) return false;
      const limits = getFeatureLimit(subscription.tier);
      return currentCount < limits[feature];
    },

    // Feature limits
    limits: getFeatureLimit(subscription?.tier ?? "FREE"),

    // Upgrade helper
    needsUpgrade: (
      feature: keyof ReturnType<typeof getFeatureLimit>,
      currentCount: number
    ) => {
      if (!subscription) return true;
      const limits = getFeatureLimit(subscription.tier);
      return currentCount >= limits[feature];
    },

    // Messages
    getUpgradeMessage: (feature: string) => {
      return subscription?.isPro
        ? "You've reached your limit"
        : `Upgrade to PRO for unlimited ${feature}`;
    },
  };
}

// Example usage in a component:
/*
function ResumeList({ resumes }: { resumes: Resume[] }) {
  const { 
    isPro, 
    canAccessFeature, 
    needsUpgrade, 
    getUpgradeMessage 
  } = useSubscription();

  const canCreateMore = canAccessFeature("resumes", resumes.length);

  return (
    <div>
      {resumes.map(resume => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
      
      {canCreateMore ? (
        <CreateResumeButton />
      ) : (
        <UpgradePrompt message={getUpgradeMessage("resumes")} />
      )}
    </div>
  );
}
*/
