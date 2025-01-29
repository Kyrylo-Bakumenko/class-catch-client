"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SearchParamsProvider({ onParamsChange }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    // Parse search parameters
    const q = searchParams.get("search") || "";
    const classCode = searchParams.get("class_code") || "";
    const minNum = searchParams.get("min_number") ? parseInt(searchParams.get("min_number"), 10) : null;
    const maxNum = searchParams.get("max_number") ? parseInt(searchParams.get("max_number"), 10) : null;
    const distribs = searchParams.get("distribs")?.split(",") || [];
    const periods = searchParams.get("periods")?.split(",") || [];
    const worldCultures = searchParams.get("world_cultures")?.split(",") || [];
    const langReqs = searchParams.get("lang_reqs")?.split(",") || [];
    const allowed = searchParams.get("allowed")?.split(",") || [];
    const orParam = searchParams.get("or_filter") || "";

    // Pass parsed params back to the parent component
    onParamsChange({
      search: q,
      classCode,
      minNumber: minNum,
      maxNumber: maxNum,
      distribs,
      periods,
      worldCultures,
      langReqs,
      allowed,
      orParam,
    });
  }, [searchParams]);

  return null; // No UI rendering needed
}
