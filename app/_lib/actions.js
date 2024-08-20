"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBooking, getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfile(formData) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  console.log(nationalID);
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("please provide a valid national Id");

  const updateData = { nationality, nationalID, countryFlag };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");
  revalidatePath("/account/profile");

  // console.log("this is the", updateData);
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You are nowt permitted to do this ");
  const guestBookings = await getBookings(session.user.guestId);

  //!to prevent a user from deleting a booking that is not associated with their id
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId)) {
    throw new Error(
      "You do not have a booking with this id and are not allowed to delete it"
    );
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");
  revalidatePath("/account/profile");
}

export async function createReservation(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBookingData = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: formData.get("numGuests"),
    observations: formData.get("observations").slice(0, 1000),
    extraPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };
  const { error } = await supabase
    .from("bookings")
    .insert([newBookingData])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) throw new Error("Booking could not be created");
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function updateReservation(formData) {
  const bookingId = Number(formData.get("reservationId"));
  //!check if there is a currently authenticated user
  const session = await auth();
  if (!session) throw new Error("You are not permitted to do this ");
  const guestBookings = await getBookings(session.user.guestId);

  //!building update data
  const observations = formData.get("observations").slice(0, 1000);
  const numGuests = Number(formData.get("numGuests"));

  //!to prevent a user from deleting a reservation/booking that is not associated with their id
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId)) {
    throw new Error(
      "You do not have a booking with this id and are not allowed to delete it"
    );
  }
  //!data to be updated
  const updatedFields = { numGuests, observations };

  //!mutation
  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) throw new Error("Reservation could not be updated");
  //!revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");
  redirect("/account/reservations");
}
