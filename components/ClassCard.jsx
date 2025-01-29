// components/ClassCard.jsx
"use client";

import { useState } from "react";
// Material UI icons
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Suspense } from "react";

// adding major plans stores
import { usePlannerStore } from "@/store/usePlannerStore";
import { useProfileStore } from "@/store/useProfileStore";

export default function ClassCard({
  classInfo,
  subscribed = false,
  onSubscribe,
  onUnsubscribe,
  onCardClick,
}) {
  const [infoOpen, setInfoOpen] = useState(false);

  // for dropdown
  const [showPlanMenu, setShowPlanMenu] = useState(false);

  const { addCourseToPlanner } = usePlannerStore();
  const { addCompletedCourse } = useProfileStore();

  // hardcoded user "plans"
  const userPlans = ["Completed", "CS Major"];

  // handle card clicls
  const handleBackgroundClick = (e) => {
    // If the click target is not the info or subscribe buttons, navigate
    if (
      e.target.closest(".info-button") ||
      e.target.closest(".subscribe-button") ||
      e.target.closest(".unsubscribe-button") ||
      e.target.closest(".plan-button") ||
      e.target.closest(".plan-menu")
    ) {
      return;
    }
    onCardClick?.();
  };

  // handle dropdown plus click
  const togglePlanMenu = (e) => {
    e.stopPropagation();
    setShowPlanMenu((prev) => !prev);
  };

  // handle picking a plan from the dropdown
  const handleChoosePlan = (plan) => {
    console.log("Adding to:", plan, classInfo); // Debug
    setShowPlanMenu(false);
    if (plan === "Completed") {
      addCompletedCourse(classInfo);
      console.log("ProfileStore:", useProfileStore.getState().completedCourses); // Debug
    } else {
      // e.g. "CS Major"
      addCourseToPlanner(classInfo);
      console.log("PlannerStore:", usePlannerStore.getState().plannedCourses); // Debug
      // currently, this would span all major plans
    }
  };

  // handle subscribe/unsubscribe
  const handleSubscribeClick = (e) => {
    e.stopPropagation();
    onSubscribe?.();
  };
  const handleUnsubscribeClick = (e) => {
    e.stopPropagation();
    onUnsubscribe?.();
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        onClick={handleBackgroundClick}
        className="relative mb-4 bg-white rounded shadow hover:shadow-md transition-shadow text-grayText cursor-pointer"
        data-test="class-card"
      >
        <div className="p-4 pr-16 whitespace-normal break-words">
          {/* Title row: Class Title + Info icon inline */}
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold">{classInfo.title}</h2>
          </div>
          {/* Class code and other details */}
          <h3 className="text-sm font-semibold mb-1">
            {`${classInfo.class_code} ${classInfo.course_number}`}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInfoOpen(true);
              }}
              className="info-button ml-2 text-gray-500 hover:text-gray-700"
              aria-label="More Information"
            >
              <InfoOutlinedIcon fontSize="small" />
            </button>
          </h3>
          <p className="mb-1 text-sm">
            <span className="font-medium">Instructor:</span>{" "}
            {classInfo.instructor}
          </p>
          <p className="mb-1 text-sm">
            <span className="font-medium">Enrollment:</span>{" "}
            {classInfo.enrollment}/{classInfo.limit}
          </p>
          <p className="mb-1 text-sm">
            <span className="font-medium">Period:</span> {classInfo.period_code}
          </p>
        </div>

        {/* Top-right icons: subscribe/unsubscribe & plus menu */}
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          {/* Subscribe / Unsubscribe bell */}
          {!subscribed ? (
            <button
              onClick={handleSubscribeClick}
              className="subscribe-button p-1 rounded-full hover:bg-gray-100"
              aria-label="Subscribe"
              data-test="subscribe-button"
            >
              <NotificationsActiveIcon />
            </button>
          ) : (
            <button
              onClick={handleUnsubscribeClick}
              className="unsubscribe-button p-1 rounded-full hover:bg-gray-100"
              aria-label="Unsubscribe"
            >
              <NotificationsOffIcon />
            </button>
          )}

          {/* Plus icon => plan menu */}
          <div className="relative plan-button">
            <button
              onClick={togglePlanMenu}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Add to plan"
            >
              <AddCircleOutlineIcon />
            </button>
            {showPlanMenu && (
              <div
                className="plan-menu absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {userPlans.map((plan) => (
                  <button
                    key={plan}
                    onClick={() => handleChoosePlan(plan)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {plan}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info slide-out panel */}
        {infoOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-50"
              onClick={() => setInfoOpen(false)}
            ></div>
            {/* Panel */}
            <div
              className="fixed z-50 bg-white shadow-lg p-4 w-full bottom-0 rounded-t-xl
                       md:rounded-t-none md:rounded-l-xl md:w-96 md:h-full md:top-0 md:right-0
                       transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  {classInfo.title}
                </h3>
                <button onClick={() => setInfoOpen(false)} className="p-1">
                  <CloseIcon fontSize="small" />
                </button>
              </div>
              <p className="text-gray-700 mb-4">
                {classInfo.shortDescription ||
                  "Short description not available."}
              </p>
              <a
                href={`/classes/${classInfo.id}`}
                className="inline-block bg-brandGreen text-white px-4 py-2 rounded hover:bg-brandGreen-dark"
              >
                View Full Details
              </a>
            </div>
          </>
        )}
      </div>
    </Suspense>
  );
}
