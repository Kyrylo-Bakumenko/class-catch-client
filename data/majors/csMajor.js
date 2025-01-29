// data/majors/csMajor.js

// simple CS major structure:
export const csMajor = {
  name: "Computer Science Major",
  prerequisites: [
    {
      categoryId: "prereq1",
      label: "Prerequisite 1: COSC 1 or ENGS 20",
      allowedClasses: ["COSC1", "ENGS20"],
      requiredCount: 1,
    },
    {
      categoryId: "prereq2",
      label: "Prerequisite 2: COSC 10",
      allowedClasses: ["COSC10"],
      requiredCount: 1,
    },
  ],

  requirements: [
    {
      categoryId: "theory",
      label: "Two from COSC 30–49",
      match: {
        class_code: "COSC",
        min_number: 30,
        max_number: 49,
      },
      requiredCount: 2,
    },
    {
      categoryId: "systems",
      label: "Two from COSC 50–69",
      match: {
        class_code: "COSC",
        min_number: 50,
        max_number: 69,
      },
      requiredCount: 2,
    },
    {
      categoryId: "applied",
      label: "Two from COSC 70–89",
      match: {
        class_code: "COSC",
        min_number: 70,
        max_number: 89,
      },
      requiredCount: 2,
    },
    {
      categoryId: "electives",
      label: "Three Additional Electives (COSC 30–89, or MATH≥20)",
      match: {
        or: [
          { class_code: "COSC", min_number: 30, max_number: 89 },
          { class_code: "MATH", min_number: 20 },
        ],
      },
      requiredCount: 3,
    },
    {
      categoryId: "culminating",
      label: "Culminating Experience (COSC 98 or 99) — 2 Terms",
      match: {
        class_code: "COSC",
        min_number: 98,
        max_number: 99,
      },
      requiredCount: 2,
    },
  ],
};
