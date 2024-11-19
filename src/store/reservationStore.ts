import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Reservation {
  id: string;
  startDate: Date;
  endDate: Date;
  guestCount: number;
  status: 'pending' | 'approved' | 'rejected';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  discountApplied: boolean;
  paymentStatus: 'pending' | 'completed' | 'partial';
  paidAmount: number;
}

interface ReservationStore {
  reservations: Reservation[];
  blockedDates: Date[];
  showDiscount: boolean;
  discountEndTime: number | null;
  discountNotificationShown: boolean;
  addReservation: (reservation: Omit<Reservation, 'id' | 'status' | 'paymentStatus' | 'paidAmount' | 'discountApplied'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  updatePaymentStatus: (id: string, paymentStatus: Reservation['paymentStatus'], paidAmount: number) => void;
  addBlockedDate: (date: Date) => void;
  removeBlockedDate: (date: Date) => void;
  isDateAvailable: (date: Date) => boolean;
  setShowDiscount: (show: boolean) => void;
  setDiscountEndTime: (time: number | null) => void;
  setDiscountNotificationShown: (shown: boolean) => void;
}

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set, get) => ({
      reservations: [],
      blockedDates: [],
      showDiscount: false,
      discountEndTime: null,
      discountNotificationShown: false,

      addReservation: (reservation) => {
        const store = get();
        const discountApplied = store.showDiscount && store.discountEndTime && store.discountEndTime > Date.now();
        const totalPriceWithDiscount = discountApplied 
          ? reservation.totalPrice * 0.95 // %5 indirim
          : reservation.totalPrice;

        const newReservation: Reservation = {
          ...reservation,
          id: Date.now().toString(),
          status: 'pending',
          paymentStatus: 'pending',
          paidAmount: 0,
          discountApplied,
          totalPrice: totalPriceWithDiscount,
          startDate: new Date(reservation.startDate),
          endDate: new Date(reservation.endDate)
        };
        set((state) => ({
          reservations: [...state.reservations, newReservation]
        }));
      },

      updateReservationStatus: (id, status) => {
        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.id === id ? { ...res, status } : res
          )
        }));
      },

      updatePaymentStatus: (id, paymentStatus, paidAmount) => {
        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.id === id ? { ...res, paymentStatus, paidAmount } : res
          )
        }));
      },

      addBlockedDate: (date) => {
        set((state) => ({
          blockedDates: [...state.blockedDates, new Date(date)]
        }));
      },

      removeBlockedDate: (date) => {
        const timestamp = new Date(date).getTime();
        set((state) => ({
          blockedDates: state.blockedDates.filter(
            (d) => new Date(d).getTime() !== timestamp
          )
        }));
      },

      isDateAvailable: (date) => {
        const state = get();
        const checkDate = new Date(date).getTime();
        
        const isBlocked = state.blockedDates.some(
          (d) => new Date(d).getTime() === checkDate
        );
        
        const isReserved = state.reservations.some(
          (res) =>
            res.status === 'approved' &&
            checkDate >= new Date(res.startDate).getTime() &&
            checkDate <= new Date(res.endDate).getTime()
        );
        
        return !isBlocked && !isReserved;
      },

      setShowDiscount: (show) => set({ showDiscount: show }),
      setDiscountEndTime: (time) => set({ discountEndTime: time }),
      setDiscountNotificationShown: (shown) => set({ discountNotificationShown: shown })
    }),
    {
      name: 'voynhouse-reservations',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          return {
            ...data,
            state: {
              ...data.state,
              blockedDates: data.state.blockedDates.map((d: string) => new Date(d)),
              reservations: data.state.reservations.map((r: any) => ({
                ...r,
                startDate: new Date(r.startDate),
                endDate: new Date(r.endDate)
              }))
            }
          };
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);