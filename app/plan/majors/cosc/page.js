"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { usePlannerStore } from "@/store/usePlannerStore";
import { useStoreHydration } from "@/lib/hydration";
import { csMajor } from "@/data/majors/csMajor";
import RequirementGrid from "@/components/RequirementGrid";
import { doesCourseMatchCategory } from "@/lib/matching";

export default function MajorPlanner() {
  const { completedCourses } = useProfileStore();
  const { plannedCourses } = usePlannerStore();
  const hydrated = useStoreHydration();

  if (!hydrated) return null;
  console.log("Completed Courses:", completedCourses);
  console.log("Planned Courses:", plannedCourses);

  // Combine courses with their source (completed or planned)
  const allCourses = [
    ...completedCourses.map((course) => ({ ...course, source: "completed" })),
    ...plannedCourses.map((course) => ({ ...course, source: "planned" })),
  ];

  const { prerequisites, requirements } = csMajor;

  // Track allocated course IDs and category allocations
  const allocatedIds = new Set();
  const categoryAllocations = {};

  // Process prerequisites
  prerequisites.forEach((category) => {
    const matched = [];
    for (const course of allCourses) {
      if (
        !allocatedIds.has(course.id) &&
        doesCourseMatchCategory(course, category)
      ) {
        matched.push(course);
        allocatedIds.add(course.id);
        if (matched.length === category.requiredCount) break;
      }
    }
    categoryAllocations[category.categoryId] = matched;
  });

  // Process requirements
  requirements.forEach((category) => {
    const matched = [];
    for (const course of allCourses) {
      if (
        !allocatedIds.has(course.id) &&
        doesCourseMatchCategory(course, category)
      ) {
        matched.push(course);
        allocatedIds.add(course.id);
        if (matched.length === category.requiredCount) break;
      }
    }
    categoryAllocations[category.categoryId] = matched;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen text-grayText">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          {csMajor.name} Planner
        </h1>

        {/* Prerequisites Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Prerequisites
          </h2>
          <div className="space-y-6">
            {csMajor.prerequisites?.map((cat) => (
              <RequirementGrid
                key={cat.categoryId}
                category={cat}
                completedCourses={completedCourses}
                plannedCourses={plannedCourses}
              />
            ))}
          </div>
        </section>

        {/* Main Requirements Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Requirements
          </h2>
          <div className="space-y-6">
            {csMajor.requirements?.map((cat) => (
              <RequirementGrid
                key={cat.categoryId}
                category={cat}
                allocatedCourses={categoryAllocations[cat.categoryId] || []}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
