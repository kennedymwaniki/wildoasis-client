"use client";
import { useOptimistic } from "react";
import { deleteReservation } from "../_lib/actions";
import ReservationCard from "./ReservationCard";

function RerservationList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (currBookings, bookingId) => {
      //!we render bookings that do not match the id we pass in
      return currBookings.filter((booking) => booking.id !== bookingId);
      //!if we were adding a newe item we would return
      // [...currBookings, newBooking]
    }
  );

  async function handleDelete(bookingId) {
    //!optimistic deletion
    optimisticDelete(bookingId);
    //!actual deletion
    await deleteReservation(bookingId);
  }
  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

export default RerservationList;
