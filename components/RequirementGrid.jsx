"use client";

import { useRouter } from "next/navigation";

/**
 * Takes a requirement category object that may have:
 *   - allowedClasses: ["COSC1","ENGS20"] => single or multiple
 *   - match: { or: [ ... ] } => OR array
 *   - match: { class_code, min_number, max_number, specific_numbers }
 *   - requiredCount => how many courses needed
 *
 * Displays requiredCount "slots" for planned/completed courses. If a slot is empty => "Add".
 * Clicking "Add" constructs the correct URL query string for "allowed=..." or "or=..." or single range
 * *and* properly encodes them so you don't break the query param parsing.
 */
export default function RequirementGrid({
  category,
  allocatedCourses = [],
}) {
  const router = useRouter();
  const { label, requiredCount = 1 } = category;

  const slots = [];
  for (let i = 0; i < requiredCount; i++) {
    slots.push(allocatedCourses[i] || null);
  }

  /**
   * Helper to build a single sub-expression: "class_code=COSC&min_number=30"
   */
  function buildQueryStringForSingleMatch(m) {
    const qs = [];
    if (m.class_code) qs.push(`class_code=${m.class_code}`);
    if (m.min_number) qs.push(`min_number=${m.min_number}`);
    if (m.max_number) qs.push(`max_number=${m.max_number}`);
    if (m.course_number) qs.push(`course_number=${m.course_number}`);
    // etc if needed
    return qs.join("&");
  }

  function buildUrlFromMatch(matchObj) {
    // by default => "/classes?" plus the param(s)
    let base = "/classes?";

    // if OR array => produce "?or_filter=..."
    if (matchObj.or) {
      const parts = matchObj.or.map((sub) =>
        buildQueryStringForSingleMatch(sub)
      );
      // => ["class_code=COSC&min_number=30&max_number=89","class_code=MATH&min_number=20"]
      const joined = parts.join("|");
      // => "class_code=COSC&min_number=30&max_number=89|class_code=MATH&min_number=20"
      const encoded = encodeURIComponent(joined);
      // => "class_code%3DCOSC%26min_number%3D30%26max_number%3D89%7Cclass_code%3DMATH%26min_number%3D20"

      console.log("[DEBUG] buildUrlFromMatch => or parts:", parts);
      console.log("[DEBUG] joined OR string (unencoded):", joined);
      console.log("[DEBUG] final encoded =>", encoded);

      return `${base}or_filter=${encoded}`;
    }

    // for specific_numbers array => produce an OR param as well
    if (matchObj.specific_numbers) {
      // e.g. { class_code: "COSC", specific_numbers:[98,99] }
      const parts = matchObj.specific_numbers.map(
        (num) => `class_code=${matchObj.class_code}&min_number=${num}&max_number=${num}`
    );
      const joined = parts.join("|");
      const encoded = encodeURIComponent(joined);
      return `${base}or_filter=${encoded}`;
    }

    // otherwise, a single match => e.g. "class_code=COSC&min_number=50"
    const singleQs = buildQueryStringForSingleMatch(matchObj);
    // e.g. "class_code=COSC&min_number=50"
    return `${base}${singleQs}`;
  }

  function handleFindClasses() {
    let url = "/classes?";

    if (category.allowedClasses) {
      url += `allowed=${category.allowedClasses.join(",")}`;
    } else if (category.match) {
      url = buildUrlFromMatch(category.match);
    }

    console.log("[DEBUG] handleFindClasses => final router.push url:", url);

    router.push(url);
  }

  return (
    <div className="mb-8">
      <h4 className="text-xl font-semibold mb-4 text-gray-800">
        {label} (Need {requiredCount})
      </h4>
      <div className="flex flex-wrap gap-6">
        {slots.map((slotCourse, index) => {
          if (slotCourse) {
            return (
              <div
                key={index}
                className={`w-64 h-40 border-2 ${
                  slotCourse.source === "completed"
                    ? "bg-yellow-50 border-yellow-400"
                    : "bg-blue-50 border-blue-400"
                } rounded-lg shadow-sm flex flex-col items-center justify-center p-4 transition-transform transform hover:scale-105`}
              >
                <p
                  className={`text-md font-semibold mb-1 ${
                    slotCourse.source === "completed"
                      ? "text-yellow-800"
                      : "text-blue-800"
                  }`}
                >
                  {slotCourse.title}
                </p>
                <p className="text-sm text-gray-600">
                  {slotCourse.class_code} {slotCourse.course_number}
                </p>
                <p
                  className={`text-xs mt-2 italic ${
                    slotCourse.source === "completed"
                      ? "text-yellow-800"
                      : "text-blue-800"
                  }`}
                >
                  {slotCourse.source === "completed" ? "Completed" : "Planned"}
                </p>
              </div>
            );
          } else {
            return (
              <button
                key={index}
                onClick={handleFindClasses}
                className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white shadow-inner transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brandGreen focus:ring-opacity-50"
              >
                <span className="text-brandGreen font-semibold text-xl">
                  Add
                </span>
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}
