"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import ClassCard from "@/components/ClassCard";
import Filters from "@/components/Filters";
import FilterChip from "@/components/FilterChip";
import { useSubscriptionsStore } from "@/store/useSubscriptionsStore";
import { useAuthStore } from "@/store/useAuthStore";
import SearchParamsProvider from "@/components/SearchParamsProvider";

export default function ClassesPage() {
  const [params, setParams] = useState({
    search: "",
    classCode: "",
    minNumber: null,
    maxNumber: null,
    distribs: [],
    periods: [],
    worldCultures: [],
    langReqs: [],
    allowed: [],
    orParam: "",
  });

  // loading data related
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);

  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const { subscribeToClass, unsubscribeFromClass, isClassSubscribed } =
    useSubscriptionsStore();

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    if (!initialized) {
      console.log("[DEBUG] Waiting for params initialization.");
      return;
    }

    console.log("[DEBUG] Fetching classes with params:", params);

    const fetchClasses = async () => {
      let url = `${BASE_URL}/api/classes/?page=1`;

      if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
      if (params.classCode) url += `&class_code=${encodeURIComponent(params.classCode)}`;
      if (params.minNumber != null) url += `&course_number__gte=${params.minNumber}`;
      if (params.maxNumber != null) url += `&course_number__lte=${params.maxNumber}`;
      if (params.distribs.length > 0) url += `&distribs=${encodeURIComponent(params.distribs.join(","))}`;
      if (params.worldCultures.length > 0) url += `&world_cultures=${encodeURIComponent(params.worldCultures.join(","))}`;
      if (params.langReqs.length > 0) url += `&lang_reqs=${encodeURIComponent(params.langReqs.join(","))}`;
      if (params.periods.length > 0) url += `&periods=${encodeURIComponent(params.periods.join(","))}`;
      if (params.allowed.length > 0) url += `&allowed=${params.allowed.join(",")}`;
      if (params.orParam) url += `&or_filter=${encodeURIComponent(params.orParam)}`;

      console.log("[DEBUG] Final URL:", url);

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
        const data = await res.json();
        setClasses(data.results || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch classes.");
      }
    };

    fetchClasses();
  }, [params, initialized]);

  const handleParamsChange = (newParams) => {
    setParams(newParams);
    setInitialized(true);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 text-grayText">
      {/* Wrap useSearchParams inside a Suspense boundary */}
      <Suspense fallback={<div>Loading filters...</div>}>
        <SearchParamsProvider onParamsChange={handleParamsChange} />
      </Suspense>

      {/* Filters sidebar */}
      <aside className="hidden md:flex flex-col w-64 p-4 border-r border-gray-200 bg-white">
        <Filters
          onTermChange={(terms) => setParams((p) => ({ ...p, terms }))}
          onDistribChange={(distribs) => setParams((p) => ({ ...p, distribs }))}
          onWorldCultureChange={(worldCultures) => setParams((p) => ({ ...p, worldCultures }))}
          onLanguageReqChange={(langReqs) => setParams((p) => ({ ...p, langReqs }))}
          onPeriodChange={(periods) => setParams((p) => ({ ...p, periods }))}
        />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-auto">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center flex-1 space-x-2">
            <SearchBar onSearchChange={(search) => setParams((p) => ({ ...p, search }))} />
            {params.classCode && (
              <FilterChip
                label={`${params.classCode} ${params.minNumber ?? ""}-${params.maxNumber ?? ""}`}
                onRemove={() => setParams((p) => ({ ...p, classCode: "", minNumber: null, maxNumber: null }))}
              />
            )}
          </div>
        </div>

        {error && <p className="p-4 text-red-500">{error}</p>}

        {!error && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classInfo) => {
              const subscribed = isClassSubscribed(classInfo.id);
              return (
                <ClassCard
                  key={classInfo.id}
                  classInfo={classInfo}
                  subscribed={subscribed}
                  onSubscribe={() => subscribeToClass(classInfo.id, user.email)}
                  onUnsubscribe={() => unsubscribeFromClass(classInfo.id)}
                  onCardClick={() => router.push(`/classes/${classInfo.id}`)}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
