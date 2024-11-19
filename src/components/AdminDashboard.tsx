import React, { useState } from 'react';
import { useReservationStore } from '../store/reservationStore';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import { differenceInDays } from 'date-fns';

export function AdminDashboard() {
  const {
    reservations,
    updateReservationStatus,
    updatePaymentStatus,
    blockedDates,
    addBlockedDate,
    removeBlockedDate
  } = useReservationStore();

  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const handleDateSelect = (date: Date) => {
    const isBlocked = blockedDates.some(d => d.getTime() === date.getTime());
    if (isBlocked) {
      removeBlockedDate(date);
    } else {
      addBlockedDate(date);
    }
  };

  const handlePaymentUpdate = (id: string) => {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;

    const paymentStatus = 
      paidAmount >= reservation.totalPrice 
        ? 'completed' 
        : paidAmount > 0 
          ? 'partial' 
          : 'pending';

    updatePaymentStatus(id, paymentStatus, paidAmount);
    setSelectedReservation(null);
    setPaidAmount(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Paneli</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rezervasyonlar */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Rezervasyonlar</h2>
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">{reservation.customerName}</span>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            reservation.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : reservation.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {reservation.status === 'approved'
                            ? 'Onaylandı'
                            : reservation.status === 'rejected'
                            ? 'Reddedildi'
                            : 'Beklemede'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        <strong>Tarih:</strong>{' '}
                        {format(new Date(reservation.startDate), 'd MMMM yyyy', {
                          locale: tr
                        })} -{' '}
                        {format(new Date(reservation.endDate), 'd MMMM yyyy', {
                          locale: tr
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Misafir Sayısı:</strong> {reservation.guestCount}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>E-posta:</strong> {reservation.customerEmail}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Telefon:</strong> {reservation.customerPhone}
                      </p>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium">Ödeme Durumu</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              reservation.paymentStatus === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : reservation.paymentStatus === 'partial'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {reservation.paymentStatus === 'completed'
                              ? 'Tamamlandı'
                              : reservation.paymentStatus === 'partial'
                              ? 'Kısmi Ödeme'
                              : 'Bekliyor'}
                          </span>
                          <span className="text-sm">
                            {reservation.paidAmount.toLocaleString('tr-TR')} ₺ / {reservation.totalPrice.toLocaleString('tr-TR')} ₺
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            onClick={() =>
                              updateReservationStatus(reservation.id, 'approved')
                            }
                            className="w-full px-3 py-1 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() =>
                              updateReservationStatus(reservation.id, 'rejected')
                            }
                            className="w-full px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                          >
                            Reddet
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setSelectedReservation(reservation.id);
                          setPaidAmount(reservation.paidAmount);
                        }}
                        className="w-full px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                      >
                        Ödeme Güncelle
                      </button>
                    </div>
                  </div>

                  {selectedReservation === reservation.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ödenen Tutar (₺)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(Number(e.target.value))}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <button
                          onClick={() => handlePaymentUpdate(reservation.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                          Kaydet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {reservations.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Henüz rezervasyon bulunmuyor.
                </p>
              )}
            </div>
          </div>

          {/* Takvim */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Müsaitlik Takvimi</h2>
            <p className="text-sm text-gray-600 mb-4">
              Tarihleri tıklayarak müsaitlik durumunu değiştirebilirsiniz.
            </p>
            <DayPicker
              mode="single"
              selected={blockedDates}
              onSelect={(date) => date && handleDateSelect(date)}
              locale={tr}
              modifiers={{
                blocked: blockedDates
              }}
              modifiersStyles={{
                blocked: { backgroundColor: '#fee2e2', color: '#991b1b' }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}