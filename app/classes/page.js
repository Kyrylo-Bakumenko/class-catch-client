// app/classes/page.js
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import ClassCard from "@/components/ClassCard";
import Filters from "@/components/Filters";
import FilterChip from "@/components/FilterChip";
// import CalendarPicker from "@/components/CalendarPicker";
import { useSubscriptionsStore } from "@/store/useSubscriptionsStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function ClassesPage() {
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  // these parse a custom param
  const [orParam, setOrParam] = useState(""); // e.g. class_code=COSC&min_number=30...|class_code=MATH&min_number=20"
  const [allowed, setAllowed] = useState([]); // e.g. ["COSC1","ENGS20"]

  // local states
  // search parse related
  const [search, setSearch] = useState("");
  const [classCode, setClassCode] = useState("");
  const [minNumber, setMinNumber] = useState(null);
  const [maxNumber, setMaxNumber] = useState(null);

  // filter related
  const [terms, setTerms] = useState([]);
  const [distribs, setDistribs] = useState([]);
  const [worldCultures, setWorldCultures] = useState([]);
  const [langReqs, setLangReqs] = useState([]);
  const [periods, setPeriods] = useState([]);

  // loading data related
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { subscribeToClass, unsubscribeFromClass, isClassSubscribed } =
    useSubscriptionsStore();

  const token = useAuthStore((state) => state.token);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // For mobile, we might just show a button at the top to toggle a modal with filters # TO CHANGE
  /*     WE MAY WANT TO SLIDE OUT AND REPLACE SEARCH RSULTS WITH FILTER MENU      */
  // For desktop, show the sidebar as planned

  // on mount, parse query params once
  useEffect(() => {
    console.log("[DEBUG] Parsing query params from the URL...");

    const q = searchParams.get("search");
    const code = searchParams.get("class_code");
    const minNum = searchParams.get("min_number");
    const maxNum = searchParams.get("max_number");
    const distParam = searchParams.get("distribs");
    const periodParam = searchParams.get("periods");
    // similarly for world_cultures, lang_reqs if they exist
    const wcParam = searchParams.get("world_cultures");
    const lrParam = searchParams.get("lang_reqs");
    const allowedParam = searchParams.get("allowed"); // prereq direct filter

    // cusotm OR query param
    const orVal = searchParams.get("or_filter");
    if (orVal) {
      setOrParam(orVal);
    }

    // set local states
    if (q) {
      console.log("[DEBUG]  -> search:", q);
      setSearch(q);
    }
    if (code) {
      console.log("[DEBUG]  -> class_code:", code);
      setClassCode(code);
    }
    if (minNum) {
      console.log("[DEBUG]  -> min_number:", minNum);
      setMinNumber(parseInt(minNum, 10));
    }
    if (maxNum) {
      console.log("[DEBUG]  -> max_number:", maxNum);
      setMaxNumber(parseInt(maxNum, 10));
    }

    if (distParam) {
      const arr = distParam.split(",");
      console.log("[DEBUG]  -> distribs:", arr);
      setDistribs(arr);
    }
    if (periodParam) {
      const arr = periodParam.split(",");
      console.log("[DEBUG]  -> periods:", arr);
      setPeriods(arr);
    }
    if (wcParam) {
      const arr = wcParam.split(",");
      console.log("[DEBUG]  -> world_cultures:", arr);
      setWorldCultures(arr);
    }
    if (lrParam) {
      const arr = lrParam.split(",");
      console.log("[DEBUG]  -> lang_reqs:", arr);
      setLangReqs(arr);
    }

    if (allowedParam) {
      const arr = allowedParam.split(",");
      console.log("[DEBUG]  -> max_number:", arr);
      setAllowed(arr);
    }

    // done parsing, mark as initialized
    setInitialized(true);
  }, [searchParams]);

  // whenever states change, fetch classes
  useEffect(() => {
    if (!initialized) {
      console.log("[DEBUG] Not fetching yet (waiting for parse).");
      return;
    }

    console.log("[DEBUG] Current states =>", {
      search,
      classCode,
      minNumber,
      maxNumber,
      terms,
      distribs,
      worldCultures,
      langReqs,
      periods,
    });

    const fetchClasses = async () => {
      setLoading(true);
      setError(null);

      // app/classes/page.js - inside useEffect fetch code
      let url = `${BASE_URL}/api/classes/?page=1`;

      // free-text search from SearchBar
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      // class_code from query
      if (classCode) {
        url += `&class_code=${encodeURIComponent(classCode)}`;
      }

      // numeric ranges for course_number if DRF supports it
      // REQUIRES ADDITION OF SOMETHING LIKE ?course_number__gte=50 in ClassViewSet
      if (minNumber != null) {
        url += `&course_number__gte=${minNumber}`;
      }
      if (maxNumber != null) {
        url += `&course_number__lte=${maxNumber}`;
      }

      // terms => OR
      if (terms.length > 0) {
        // produce "202501,202409"
        url += `&terms=${encodeURIComponent(terms.join(","))}`;
      }

      // distribs => intersection
      if (distribs.length > 0) {
        // produce "ART,LIT"
        url += `&distribs=${encodeURIComponent(distribs.join(","))}`;
      }

      // WC => intersection
      if (worldCultures.length > 0) {
        url += `&world_cultures=${encodeURIComponent(worldCultures.join(","))}`;
      }

      // lang_reqs => OR
      if (langReqs.length > 0) {
        url += `&lang_reqs=${encodeURIComponent(langReqs.join(","))}`;
      }

      // periods => OR
      if (periods.length > 0) {
        url += `&periods=${encodeURIComponent(periods.join(","))}`;
      }

      // if user has "allowed" e.g. ["COSC1","ENGS20"]
      if (allowed.length > 0) {
        url += `&allowed=${allowed.join(",")}`;
      }

      // if there is an orParam => "class_code=COSC&min_number=30&max_number=89|class_code=MATH&min_number=20"
      if (orParam) {
        const finalOr = encodeURIComponent(orParam);
        console.log("[DEBUG] fetchClasses => orParam raw:", orParam, " => finalOr:", finalOr);
        url += `&or_filter=${finalOr}`;
      }

      // Debug: log the final URL in your front-end console
      console.log("[DEBUG] Final classes fetch URL:", url);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        setClasses(data.results || []);
        if (data.count != null) {
          console.log("[DEBUG] classes returned:", data.count);
        } else {
          console.log("[DEBUG] classes returned:", (data.results || []).length);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [
    search,
    classCode,
    minNumber,
    maxNumber,
    terms,
    distribs,
    worldCultures,
    langReqs,
    periods,
    allowed,
    orParam,
    initialized,
    BASE_URL, // technically dependent on the env var
  ]);

  const handleCardClick = (classObj) => {
    // navigate to detail page
    router.push(`/classes/${classObj.id}`);
  };

  // on subscribe:
  const handleSubscribe = async (classObj) => {
    try {
      await subscribeToClass(classObj.id, "kirill.bakumenko.2016@gmail.com");
      alert(`Subscribed to ${classObj.title} successfully!`);
    } catch (e) {
      alert("Subscription failed: " + e.message);
    }
  };

  // on unsubscribe:
  const handleUnsubscribe = async (classObj) => {
    try {
      await unsubscribeFromClass(classObj.id);
      alert(`Unsubscribed from ${classObj.title} successfully!`);
    } catch (e) {
      alert("Unsubscribe failed: " + e.message);
    }
  };

  // if we want to show a chip for each “allowed=...” token, we can remove them individually:
  const handleRemoveAllowedToken = (token) => {
    setAllowed((prev) => prev.filter((t) => t !== token));
  };

  // remove the entire “orParam,”
  const handleRemoveOrParam = () => {
    setOrParam("");
  };

  // handle removing the class_code/minNumber/maxNumber filter
  const handleRemoveRangeFilter = () => {
    setClassCode("");
    setMinNumber(null);
    setMaxNumber(null);
    // optionally do router.push("/classes") if you want the URL updated
    // but for now we rely on local state
  };

  // build chip label if user has subject code + numeric range
  let subjectRangeLabel = "";
  if (classCode) {
    if (minNumber != null && maxNumber != null) {
      subjectRangeLabel = `${classCode} ${minNumber}–${maxNumber}`;
    } else {
      subjectRangeLabel = classCode;
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 text-grayText">
      {/* Filters sidebar (desktop only) */}
      <aside className="hidden md:flex flex-col w-64 p-4 border-r border-gray-200 bg-white">
        <Filters
          onTermChange={setTerms}
          onDistribChange={setDistribs}
          onWorldCultureChange={setWorldCultures}
          onLanguageReqChange={setLangReqs}
          onPeriodChange={setPeriods}
        />
      </aside>
      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-auto">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center flex-1 space-x-2">
            {/* Search Bar */}
            <SearchBar onSearchChange={setSearch} />

            {/* Range-based filter chip if user has classCode/minNumber */}
            {subjectRangeLabel && (
              <FilterChip
                label={subjectRangeLabel}
                onRemove={handleRemoveRangeFilter}
              />
            )}

            {/* “allowed” tokens => each becomes a chip, e.g. “Prereq: COSC1” */}
            {allowed.map((tok) => (
              <FilterChip
                key={tok}
                label={`Prereq: ${tok}`}
                onRemove={() => handleRemoveAllowedToken(tok)}
              />
            ))}

            {/* orParam => single chip with “OR Filter” text */ }
            {orParam && (
              <FilterChip label={`OR Filter`} onRemove={handleRemoveOrParam} />
            )}
          </div>
        </div>
        {error && <p className="p-4 text-red-500">{error}</p>}
        {/* classes grid */}
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
                  onCardClick={() => handleCardClick(classInfo)}
                />
              );
            })}
          </div>
        )}
        {/* <div>
          <CalendarPicker selectedPeriods={periods} onChange={setPeriods} />
          {/* Then pass `periods` into your fetch logic */}
        {/* </div> */}
      </main>
    </div>
  );
}
