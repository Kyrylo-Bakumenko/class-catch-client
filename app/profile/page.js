"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import { useAuthStore } from "@/store/useAuthStore";
import { useSubscriptionsStore } from "@/store/useSubscriptionsStore";
import { useStoreHydration } from "@/lib/hydration";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    subscriptions,
    loadingSubs,
    errorSubs,
    fetchSubscriptions,
    unsubscribeFromClass,
  } = useSubscriptionsStore();

  const hydrated = useStoreHydration();
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    if (!hydrated) return; // use global check
    if (!token) router.push("/login");
    fetchSubscriptions();
  }, [token, hydrated, router]);

  const handleRetry = () => {
    fetchSubscriptions();
  };

  // On unsubscribe:
  const handleUnsubscribe = async (classToUnsubscribe) => {
    try {
      await unsubscribeFromClass(classToUnsubscribe.id);
      alert(`Unsubscribed from ${classToUnsubscribe.title} successfully!`);
    } catch (e) {
      alert("Unsubscribe failed: " + e.message);
    }
  };

  if (!token && !loading) {
    return null;
  }
  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-900">
      <h1 className="text-2xl font-bold">Your Subscriptions</h1>

      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="mt-2 bg-brandGreen text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      )}

      {!error && subscriptions.length === 0 && (
        <p className="mt-4 text-gray-600">You have no subscriptions yet.</p>
      )}

      {!error && subscriptions.length > 0 && (
        <div className="mt-4 space-y-4">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {sub.subscribed_class.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {sub.subscribed_class.class_code}{" "}
                  {sub.subscribed_class.course_number}
                </p>
                <p className="text-sm text-gray-600">
                  Instructor: {sub.subscribed_class.instructor || "TBA"}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnsubscribe(sub.subscribed_class);
                }}
                className="unsubscribe-button p-1 rounded-full hover:bg-gray-100"
                aria-label="Unsubscribe"
              >
                <NotificationsOffIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
