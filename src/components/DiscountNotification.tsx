import React, { useEffect, useState } from 'react';
import { useReservationStore } from '../store/reservationStore';

export function DiscountNotification() {
  const { showDiscount, discountEndTime, setShowDiscount, setDiscountEndTime, discountNotificationShown, setDiscountNotificationShown } = useReservationStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // 120 saniye sonra indirim teklifini göster
    if (!discountNotificationShown) {
      const timer = setTimeout(() => {
        setShowDiscount(true);
        setDiscountEndTime(Date.now() + 4 * 60 * 1000); // 4 dakika
        setDiscountNotificationShown(true);
      }, 120 * 1000);

      return () => clearTimeout(timer);
    }
  }, [discountNotificationShown]);

  useEffect(() => {
    if (discountEndTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, discountEndTime - Date.now());
        if (remaining === 0) {
          setShowDiscount(false);
          setDiscountEndTime(null);
          clearInterval(interval);
        }
        setTimeLeft(remaining);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [discountEndTime]);

  if (!showDiscount || !timeLeft) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const handleAccept = () => {
    setIsMinimized(true);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-emerald-600 text-white p-3 rounded-lg shadow-lg cursor-pointer"
           onClick={() => setIsMinimized(false)}>
        <div className="text-sm">
          %5 İndirim Aktif! ({minutes}:{seconds.toString().padStart(2, '0')})
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-white p-6 rounded-xl shadow-2xl z-50 w-96 border-2 border-emerald-500">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">Özel İndirim Fırsatı!</h3>
        <p className="text-gray-600">
          Rezervasyonunuza özel %5 indirim kazandınız! Bu fırsat sadece:
        </p>
        <div className="text-3xl font-bold text-emerald-600">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
        <p className="text-sm text-gray-500">
          süre boyunca geçerlidir.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            İndirimi Kullan
          </button>
          <button
            onClick={() => {
              setShowDiscount(false);
              setDiscountEndTime(null);
            }}
            className="flex-1 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}