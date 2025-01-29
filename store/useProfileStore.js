// store/useProfileStore.js
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * This store tracks courses the user has COMPLETED in the past.
 *   { id: number, class_code: "COSC", course_number: "30", title: "Discrete Math", ... }
 */
export const useProfileStore = create(
  persist((set, get) => ({
    completedCourses: [],

    addCompletedCourse: (course) => {
      const existing = get().completedCourses.find((c) => c.id === course.id);
      if (!existing) {
        set((state) => ({
          completedCourses: [...state.completedCourses, course],
        }));
      }
    },

    removeCompletedCourse: (classId) => {
      set((state) => ({
        completedCourses: state.completedCourses.filter(
          (c) => c.id !== classId
        ),
      }));
    },
  }))
);
