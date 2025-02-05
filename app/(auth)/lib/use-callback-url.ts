"use client";

import { useSearchParams } from "next/navigation";

export function useCallbackUrl() {
  const searchParams = useSearchParams();
  return searchParams?.get("from") || "/dashboard";
}
