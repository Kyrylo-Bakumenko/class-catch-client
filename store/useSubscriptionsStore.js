// store/useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const useSubscriptionsStore = create(
  persist(
    (set, get) => ({
      subscriptions: [],
      loadingSubs: false,
      errorSubs: null,

      // 1) fetch all subscriptions for the logged-in user
      // GET /api/subscriptions/
      async fetchSubscriptions() {
        const token = useAuthStore.getState().token;
        if (!token) return; // can't fetch if no token
        set({ loadingSubs: true, errorSubs: null });
        try {
          const res = await fetch(
            `${BASE_URL}/api/user/subscriptions/`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Failed to fetch subscriptions");
          const data = await res.json();
          set({ subscriptions: data.results || [] });
        } catch (err) {
          set({ errorSubs: err.message });
        } finally {
          set({ loadingSubs: false });
        }
      },

      // 2) subscribe
      // POST /api/subscriptions/
      async subscribeToClass(classId, email) {
        const token = useAuthStore.getState().token;
        if (!token) {
          throw new Error("No token found. Please log in.");
        }
        const body = {
          subscribed_class_id: classId,
          email: email
        };
        const res = await fetch(`${BASE_URL}/api/subscriptions/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          let errData;
          try {
            errData = await res.json();
          } catch (parseError) {
            console.error("Failed to parse JSON error response:", parseError);
            throw new Error(res.statusText);
          }
        
          // <<--- ADD THIS LOG
          console.log("Detailed error from server:", errData);
        
          // Then throw the error
          throw new Error(errData.detail || res.statusText);
        }
        // If success, re-fetch or patch state
        await get().fetchSubscriptions();
      },

      // 3) unsubscribe
      // DELETE /api/subscriptions/:id
      async unsubscribeFromClass(classId) {
        const token = useAuthStore.getState().token;
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        // find the subscription with subscribed_class.id = classId
        const sub = get().subscriptions.find(
          (s) => s.subscribed_class.id === classId
        );
        if (!sub) {
          throw new Error("No subscription found for that class");
        }

        const subscriptionId = sub.id;

        const res = await fetch(
          `${BASE_URL}/api/subscriptions/${subscriptionId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || res.statusText);
        }

        // re-fetch or manually remove from state
        await get().fetchSubscriptions();
      },

      // 4) helper to see if a given class is subscribed
      isClassSubscribed(classId) {
        return get().subscriptions.some(
          (sub) => sub.subscribed_class.id === classId
        );
      },
    }),
    {
      name: "subscription-store", // key for localStorage or any storage
    }
  )
);
