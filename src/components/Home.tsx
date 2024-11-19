import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { tr } from 'date-fns/locale';
import { differenceInDays, format } from 'date-fns';
import { Home as HomeIcon, Users, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { useReservationStore } from '../store/reservationStore';
import { ReservationForm } from './ReservationForm';
import { DiscountNotification } from './DiscountNotification';
import 'react-day-picker/dist/style.css';

export function Home() {
  const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [guests, setGuests] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const dailyRate = 3500;

  const { isDateAvailable, showDiscount, discountEndTime } = useReservationStore();

  const totalDays = (range.from && range.to) ? differenceInDays(range.to, range.from) + 1 : 0;
  const basePrice = totalDays * dailyRate;
  const totalPrice = showDiscount && discountEndTime && discountEndTime > Date.now()
    ? basePrice * 0.95 // %5 indirim
    : basePrice;

  const handleReservationSuccess = () => {
    setShowForm(false);
    setRange({ from: undefined, to: undefined });
    setGuests(1);
    alert('Rezervasyon talebiniz alınmıştır. En kısa sürede size dönüş yapılacaktır.');
  };

  const disabledDays = (date: Date) => {
    return !isDateAvailable(date);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <DiscountNotification />
      {/* Hero Section */}
      <header
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=2940")'
        }}
      >
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">VoynHouse</h1>
            <p className="text-xl md:text-2xl text-white max-w-2xl">
              Doğanın kalbinde, üçgen bungalov konseptiyle unutulmaz bir konaklama deneyimi
            </p>
          </div>
        </div>
      </header>

      {/* Rezervasyon Bölümü */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-emerald-600" />
              Rezervasyon
            </h2>

            <div className="space-y-6">
              {!showForm ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarih Seçimi
                    </label>
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={(newRange: any) => setRange(newRange || { from: undefined, to: undefined })}
                      locale={tr}
                      className="border rounded-lg p-4"
                      disabled={disabledDays}
                      styles={{
                        caption: { color: '#059669' },
                        day_selected: { backgroundColor: '#059669' }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Misafir Sayısı
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                        className="px-3 py-1 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium">{guests}</span>
                      <button
                        onClick={() => setGuests((prev) => Math.min(6, prev + 1))}
                        className="px-3 py-1 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {range.from && range.to && (
                    <div className="bg-emerald-50 rounded-lg p-6 space-y-3">
                      <p className="text-lg">
                        <span className="font-medium">Konaklama Süresi:</span> {totalDays} gün
                      </p>
                      <p className="text-lg">
                        <span className="font-medium">Günlük Ücret:</span>{' '}
                        {dailyRate.toLocaleString('tr-TR')} ₺
                      </p>
                      {showDiscount && discountEndTime && discountEndTime > Date.now() && (
                        <p className="text-emerald-600 font-medium">
                          %5 İndirim Uygulandı!
                        </p>
                      )}
                      <p className="text-xl font-bold text-emerald-700">
                        Toplam: {totalPrice.toLocaleString('tr-TR')} ₺
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setShowForm(true)}
                    disabled={!range.from || !range.to}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Rezervasyon Yap
                  </button>
                </>
              ) : (
                <ReservationForm
                  startDate={range.from!}
                  endDate={range.to!}
                  guestCount={guests}
                  onSuccess={handleReservationSuccess}
                />
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2">
                <HomeIcon className="w-8 h-8 text-emerald-600" />
                Tesis Bilgileri
              </h2>
              <div className="space-y-4">
                <p className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Maksimum 6 kişi</span>
                </p>
                <p className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Doğa ile iç içe konum</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <span>+90 555 123 4567</span>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span>info@voynhouse.com</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-semibold mb-4">Özellikler</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Modern üçgen bungalov tasarımı</li>
                <li>Tam donanımlı mutfak</li>
                <li>Doğa manzaralı teras</li>
                <li>Klima</li>
                <li>Ücretsiz Wi-Fi</li>
                <li>24 saat sıcak su</li>
                <li>Güvenli park alanı</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}