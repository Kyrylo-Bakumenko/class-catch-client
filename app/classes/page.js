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

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
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
    if (!initialized) return;

    console.log("[DEBUG] Fetching classes with params:", params);
    setLoading(true);
    setError(null);

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
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [params, initialized]);

  const handleParamsChange = (newParams) => {
    setParams(newParams);
    setInitialized(true);
  };

  const handleSubscribe = async (classObj) => {
    if (!user || !user.email) {
      alert("Please log in to subscribe to classes.");
      return;
    }
    try {
      await subscribeToClass(classObj.id, user.email);
      alert(`Subscribed to ${classObj.title} successfully!`);
    } catch (e) {
      alert("Subscription failed: " + e.message);
    }
  };

  const handleUnsubscribe = async (classObj) => {
    try {
      await unsubscribeFromClass(classObj.id);
      alert(`Unsubscribed from ${classObj.title} successfully!`);
    } catch (e) {
      alert("Unsubscribe failed: " + e.message);
    }
  };

  // Handle filter removals
  const handleRemoveFilter = (key) => {
    setParams((prev) => ({ ...prev, [key]: [] }));
  };

  const handleRemoveClassCodeFilter = () => {
    setParams((prev) => ({ ...prev, classCode: "", minNumber: null, maxNumber: null }));
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

            {/* Range-based filter chip */}
            {params.classCode && (
              <FilterChip
                label={`${params.classCode} ${params.minNumber ?? ""}-${params.maxNumber ?? ""}`}
                onRemove={handleRemoveClassCodeFilter}
              />
            )}

            {/* Filter Chips for distribs, worldCultures, langReqs, periods */}
            {params.distribs.map((d) => (
              <FilterChip key={d} label={`Distrib: ${d}`} onRemove={() => handleRemoveFilter("distribs")} />
            ))}
            {params.worldCultures.map((wc) => (
              <FilterChip key={wc} label={`WC: ${wc}`} onRemove={() => handleRemoveFilter("worldCultures")} />
            ))}
            {params.langReqs.map((lr) => (
              <FilterChip key={lr} label={`Lang: ${lr}`} onRemove={() => handleRemoveFilter("langReqs")} />
            ))}
            {params.periods.map((p) => (
              <FilterChip key={p} label={`Period: ${p}`} onRemove={() => handleRemoveFilter("periods")} />
            ))}

            {/* OR Filter Chip */}
            {params.orParam && (
              <FilterChip label={`OR Filter`} onRemove={() => setParams((p) => ({ ...p, orParam: "" }))} />
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
                  onSubscribe={() => handleSubscribe(classInfo)}
                  onUnsubscribe={() => handleUnsubscribe(classInfo)}
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
