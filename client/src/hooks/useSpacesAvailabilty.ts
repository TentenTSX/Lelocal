import { useEffect, useState } from "react";
import type { SpaceAvailability } from "../types/availability";

export type AvailabilityMap = Record<number, SpaceAvailability | null>;

function useSpacesAvailability(
  spaceIds: number[],
  date: string,
  timeSlotId: string | number | undefined,
) {
  const [availabilities, setAvailabilities] = useState<AvailabilityMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date || !timeSlotId || spaceIds.length === 0) {
      setAvailabilities({});
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      date,
      timeSlotId: String(timeSlotId),
    });

    Promise.all(
      spaceIds.map((id) =>
        fetch(
          `${import.meta.env.VITE_API_URL ?? ""}/api/spaces/${id}/availability?${params.toString()}`,
          { signal: controller.signal },
        )
          .then((res) => {
            if (!res.ok) throw new Error("Erreur disponibilité");
            return res.json() as Promise<SpaceAvailability>;
          })
          .then((data) => ({ id, data }))
          .catch((err) => {
            if (err.name === "AbortError") return null;
            return { id, data: null };
          }),
      ),
    )
      .then((results) => {
        const map: AvailabilityMap = {};
        for (const result of results) {
          if (result) map[result.id] = result.data;
        }
        setAvailabilities(map);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceIds, date, timeSlotId]);

  return { availabilities, loading, error };
}

export default useSpacesAvailability;
