// utils/assignment.js
import { doesCourseMatchCategory } from "@/lib/matching";

export function assignCoursesToRequirements(courses, requirements) {
    // Create requirement tracking objects with unique IDs
    const reqs = requirements.map(req => ({
      ...req,
      id: req.id || `${req.label}-${Math.random().toString(36).substr(2, 9)}`, // Fallback ID
      remaining: req.requiredCount,
      assigned: []
    }));
  
    // Create course tracking objects with match counts
    const coursePool = courses.map(course => ({
      course,
      matches: reqs.filter(req => 
        doesCourseMatchCategory(course, req) // Now properly imported
      ).map(req => req.id),
      used: false
    }));
  
    // Sort courses by fewest matches first
    coursePool.sort((a, b) => a.matches.length - b.matches.length);
  
    // Assign courses to requirements
    coursePool.forEach(courseObj => {
      if (courseObj.used) return;
  
      // Find first matching requirement with remaining capacity
      for (const reqId of courseObj.matches) {
        const req = reqs.find(r => r.id === reqId);
        if (req && req.remaining > 0) {
          req.assigned.push(courseObj.course);
          req.remaining--;
          courseObj.used = true;
          break;
        }
      }
    });
  
    return reqs.reduce((acc, req) => {
      acc[req.id] = req.assigned;
      return acc;
    }, {});
  }