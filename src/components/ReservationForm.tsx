import React, { useState } from 'react';
import { useReservationStore } from '../store/reservationStore';
import { differenceInDays } from 'date-fns';

interface ReservationFormProps {
  startDate: Date;
  endDate: Date;
  guestCount: number;
  onSuccess: () => void;
}

export function ReservationForm({ startDate, endDate, guestCount, onSuccess }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  const addReservation = useReservationStore((state) => state.addReservation);
  const dailyRate = 3500;
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const totalPrice = totalDays * dailyRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReservation({
      startDate,
      endDate,
      guestCount,
      totalPrice,
      ...formData
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
          Ad Soyad
        </label>
        <input
          type="text"
          id="customerName"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          value={formData.customerName}
          onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
          E-posta
        </label>
        <input
          type="email"
          id="customerEmail"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          value={formData.customerEmail}
          onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
          Telefon
        </label>
        <input
          type="tel"
          id="customerPhone"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          value={formData.customerPhone}
          onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        Rezervasyon Yap
      </button>
    </form>
  );
}