import { useEffect, useState } from "react";

type Availability = {
  capacity: number;
  booked: number;
  available: number;
};

function useAvailability(spaceId: number, date: string, timeSlotId?: string) {
  const [availability, setAvailability] = useState<Availability | null>(null);

  useEffect(() => {
    if (!date) {
      setAvailability(null);
      return;
    }

    const url = timeSlotId
      ? `${import.meta.env.VITE_API_URL ?? ""}/api/spaces/${spaceId}/availability?date=${date}&timeSlotId=${timeSlotId}`
      : `${import.meta.env.VITE_API_URL ?? ""}/api/spaces/${spaceId}/availability-by-date?date=${date}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) =>
        setAvailability({
          capacity: Number(data.capacity),
          booked: Number(data.booked),
          available: Number(data.available),
        }),
      )
      .catch(() => setAvailability(null));
  }, [spaceId, date, timeSlotId]);

  return availability;
}

export default useAvailability;
