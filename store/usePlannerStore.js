// store/usePlannerStore.js
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * This store tracks the user's "planned" courses for the future.
 *   { id, class_code, course_number, title, term, etc. }
 */
export const usePlannerStore = create(
  persist((set, get) => ({
    plannedCourses: [],

    addCourseToPlanner: (course) => {
      const existing = get().plannedCourses.find((c) => c.id === course.id);
      if (!existing) {
        set((state) => ({
          plannedCourses: [...state.plannedCourses, course],
        }));
      }
    },

    removeCourseFromPlanner: (classId) => {
      set((state) => ({
        plannedCourses: state.plannedCourses.filter((c) => c.id !== classId),
      }));
    },
  }))
);
