// src/store/bookingStore.ts
"use client";

import { create } from "zustand";
import type {
  Booking,
  GuestInfo,
  PaymentMethod,
  PaymentOption,
} from "@/types/booking";

type BookingStore = {
  booking: Booking | null;
  paymentOption: PaymentOption;
  paymentMethod: PaymentMethod;
  guestInfo: GuestInfo;
  noteToHost: string;

  setBooking: (booking: Booking) => void;
  setPaymentOption: (option: PaymentOption) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  updateGuestInfo: (partial: Partial<GuestInfo>) => void;
  setNoteToHost: (note: string) => void;
  reset: () => void;
};

const defaultGuestInfo: GuestInfo = {
  adults: 1,
  children: 0,
  infants: 0,
};

export const useBookingStore = create<BookingStore>((set) => ({
  booking: null,
  paymentOption: "full",
  paymentMethod: "card",
  guestInfo: defaultGuestInfo,
  noteToHost: "",

  setBooking: (booking) =>
    set(() => ({
      booking,
      guestInfo: booking.guestInfo ?? defaultGuestInfo,
    })),

  setPaymentOption: (paymentOption) => set({ paymentOption }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  updateGuestInfo: (partial) =>
    set((state) => ({
      guestInfo: { ...state.guestInfo, ...partial },
    })),
  setNoteToHost: (noteToHost) => set({ noteToHost }),

  reset: () =>
    set({
      booking: null,
      paymentOption: "full",
      paymentMethod: "card",
      guestInfo: defaultGuestInfo,
      noteToHost: "",
    }),
}));
