import { useEffect, useState } from "react";
import type { Activity } from "../types/activity";
import { apiFetch } from "./apiFetch";

function useUpcomingEvents(refreshKey = 0) {
  const [upcomingEvents, setUpcomingEvents] = useState<Activity[]>([]);

  useEffect(() => {
    void refreshKey;

    apiFetch("/api/events")
      .then((res) => res.json())
      .then((data) => setUpcomingEvents(data));
  }, [refreshKey]);

  return upcomingEvents;
}

export default useUpcomingEvents;
