// components/RequirementRow.jsx
"use client";

import { doesCourseMatchCategory } from "@/lib/matching";
import { useRouter } from "next/navigation";

export default function RequirementRow({
  category,
  completedCourses = [],
  plannedCourses = [],
}) {
  const router = useRouter();

  // Filter out courses that match
  const matchingCompleted = completedCourses.filter((c) =>
    doesCourseMatchCategory(c, category)
  );
  const matchingPlanned = plannedCourses.filter((c) =>
    doesCourseMatchCategory(c, category)
  );

  const needed = category.requiredCount || 1;
  const have = matchingCompleted.length + matchingPlanned.length;
  const remain = Math.max(0, needed - have);

  const handleFindClasses = () => {
    // Build a query string. If category.match is { class_code: "COSC", min_number: 50, max_number: 69 }
    // we can do something like:
    let url = "/classes?";

    // If there's an allowedClasses array or we do a 'match'
    if (category.allowedClasses) {
      // e.g. "COSC1,ENGS20" 
      // not implemented for advanced. We'll skip for now or do ?allowed=...
    } else if (category.match) {
      if (category.match.class_code) {
        url += `class_code=${category.match.class_code}&`;
      }
      if (category.match.min_number) {
        url += `min_number=${category.match.min_number}&`;
      }
      if (category.match.max_number) {
        url += `max_number=${category.match.max_number}&`;
      }
      // if there's an "or" array or specific_numbers, you might handle that too
    }

    // Remove trailing &
    if (url.endsWith("&")) {
      url = url.slice(0, -1);
    }

    // let url = `/classes?class_code=COSC&min_number=50&max_number=69`; DEUBG TEST

    // DEBUG
    console.log("[DEBUG] Redirecting to:", url);

    router.push(url);
  };

  return (
    <div className="border p-3 rounded">
      <h4 className="font-semibold mb-1">{category.label} (Need {needed})</h4>
      <p className="text-sm mb-1">
        Completed: {matchingCompleted.map((c) => c.title).join(", ") || "None"}
      </p>
      <p className="text-sm mb-1">
        Planned: {matchingPlanned.map((c) => c.title).join(", ") || "None"}
      </p>
      <p className="text-sm mb-2">Still needed: {remain}</p>
      {remain > 0 && (
        <button
          onClick={handleFindClasses}
          className="bg-brandGreen text-white px-3 py-1 rounded hover:bg-brandGreen-dark text-sm"
        >
          Find Classes
        </button>
      )}
    </div>
  );
}
