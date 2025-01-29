// utils/matching.js

/**
 * Checks if a given `course` (like { class_code: "COSC", course_number: "30", ... })
 * satisfies a "category" that either has:
 *   - allowedClasses: [ "COSC1", "ENGS20" ]
 *   - match: { class_code, min_number, max_number, or: [] }
 */
export function doesCourseMatchCategory(course, category) {
  if (!course || !category) return false;

  // if there's an 'allowedClasses' array
  if (category.allowedClasses) {
    // Normalize course number by stripping leading zeros for numeric codes
    const normalizeCourseNumber = (numStr) => {
      if (/^\d+$/.test(numStr)) { // Check if entirely numeric
        return parseInt(numStr, 10).toString();
      }
      return numStr; // Leave alphanumeric as-is
    };
    
    const normalizedNumber = normalizeCourseNumber(course.course_number);
    const courseKey = `${course.class_code}${normalizedNumber}`.replace(/\s+/g, "");
    return category.allowedClasses.includes(courseKey);
  }

  // ff there's a 'match' object
  if (category.match) {
    // if there's an OR array
    if (category.match.or && Array.isArray(category.match.or)) {
      // return true if ANY sub-condition is satisfied
      return category.match.or.some((cond) => checkSingleCondition(course, cond));
    } else {
      // single condition
      return checkSingleCondition(course, category.match);
    }
  }

  return false;
}

/**
 * For a single condition object:
 *   { class_code?:string, min_number?:number, max_number?:number, specific_numbers?: number[] }
 */
function checkSingleCondition(course, cond) {
  // Handle class_code case insensitively
  if (cond.class_code && course.class_code.toUpperCase() !== cond.class_code.toUpperCase()) {
    return false;
  }

  // Parse numbers safely
  const courseNum = parseInt(course.course_number, 10);
  const condNum = (num) => (isNaN(num) ? null : num);

  if (cond.min_number !== undefined && courseNum < condNum(cond.min_number)) return false;
  if (cond.max_number !== undefined && courseNum > condNum(cond.max_number)) return false;
  if (cond.specific_numbers) {
    const specificNums = cond.specific_numbers.map(n => condNum(n));
    if (!specificNums.includes(courseNum)) return false;
  }

  return true;
}
