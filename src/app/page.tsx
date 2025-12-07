import Link from 'next/link';
import Image from 'next/image';

// Pricing data
const pricingPlans = [
  {
    name: 'Gratis',
    price: '0',
    period: 'selamanya',
    description: 'Untuk individu yang ingin mencoba',
    features: [
      'Maksimal 5 pengguna',
      '50 setoran AI / bulan',
      'Hafalan Quran (Juz 30)',
      'Progress tracking dasar',
      'Dukungan komunitas',
    ],
    cta: 'Mulai Gratis',
    popular: false,
  },
  {
    name: 'Starter',
    price: '299.000',
    period: '/bulan',
    description: 'Untuk sekolah & TPA kecil',
    features: [
      'Maksimal 30 pengguna',
      '200 setoran AI / user / bulan',
      'Hafalan Quran lengkap',
      "Hafalan Hadits (Arba'in)",
      'Dashboard musyrif',
      'Laporan progress',
      'Subdomain custom',
    ],
    cta: 'Pilih Starter',
    popular: false,
  },
  {
    name: 'Growth',
    price: '799.000',
    period: '/bulan',
    description: 'Untuk pesantren & madrasah',
    features: [
      'Maksimal 100 pengguna',
      '300 setoran AI / user / bulan',
      'Semua jenis hafalan',
      'Hafalan Matan lengkap',
      'Analytics lanjutan',
      'Export laporan PDF',
      'Prioritas support',
      'API access',
    ],
    cta: 'Pilih Growth',
    popular: true,
  },
  {
    name: 'Pro',
    price: '2.499.000',
    period: '/bulan',
    description: 'Untuk lembaga besar',
    features: [
      'Maksimal 500 pengguna',
      '500 setoran AI / user / bulan',
      'Semua fitur Growth',
      'Custom branding',
      'Multi-halaqah',
      'Dedicated support',
      'SLA 99.9%',
      'Training tim',
    ],
    cta: 'Pilih Pro',
    popular: false,
  },
];

// Features data
const features = [
  {
    icon: '📖',
    title: 'Hafalan Al-Quran',
    description:
      '30 Juz lengkap dengan tajweed color-coded, audio murottal, dan setoran AI yang akurat.',
  },
  {
    icon: '📜',
    title: 'Hafalan Hadits',
    description: "Arba'in Nawawi, Bulughul Maram, Riyadhus Shalihin dengan takhrij dan syarah.",
  },
  {
    icon: '📝',
    title: 'Hafalan Matan',
    description: "Jazariyyah, Alfiyah, Ajrumiyyah, dan matan-matan ilmu syar'i lainnya.",
  },
  {
    icon: '🎤',
    title: 'Setoran AI',
    description: 'Rekam bacaan, AI analisis kesalahan per ayat/hadits/bait dengan feedback detail.',
  },
  {
    icon: '🔄',
    title: "Muroja'ah Otomatis",
    description: "Spaced repetition algorithm untuk jadwal muroja'ah yang optimal.",
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Dashboard lengkap untuk santri dan musyrif dengan analytics real-time.',
  },
];

// Testimonials
const testimonials = [
  {
    name: 'Ustadz Ahmad',
    role: 'Musyrif Tahfidz, Pesantren Darussalam',
    content:
      'Dengan Tahfidz.ai, saya bisa memantau progress 50 santri dengan mudah. Setoran AI sangat membantu ketika saya tidak bisa hadir.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Fatimah',
    role: 'Santriwati, Kelas 3 Aliyah',
    content:
      "Muroja'ah jadi lebih teratur dengan reminder harian. Alhamdulillah sudah hafal 10 juz dalam setahun!",
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Bapak Hendra',
    role: 'Kepala TPA Nurul Iman',
    content:
      'Orang tua santri sangat terbantu bisa melihat progress anak-anaknya. Fitur laporan sangat profesional.',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
];

// FAQ
const faqs = [
  {
    question: 'Apakah bisa digunakan offline?',
    answer:
      'Ya, Tahfidz.ai mendukung mode offline untuk membaca mushaf dan materi. Setoran AI memerlukan koneksi internet.',
  },
  {
    question: 'Bagaimana akurasi AI dalam mengoreksi bacaan?',
    answer:
      'AI kami menggunakan Gemini 2.0 yang dilatih khusus untuk mengenali bacaan Al-Quran dengan akurasi tinggi. Namun, untuk setoran resmi tetap disarankan ke musyrif.',
  },
  {
    question: 'Apakah data santri aman?',
    answer:
      'Keamanan data adalah prioritas kami. Semua data dienkripsi dan disimpan di server yang aman. Kami tidak menjual data ke pihak ketiga.',
  },
  {
    question: 'Bisakah pesantren punya subdomain sendiri?',
    answer:
      'Ya! Mulai dari paket Starter, setiap pesantren bisa memiliki subdomain sendiri seperti pesantren-anda.tahfidz.ai',
  },
  {
    question: 'Bagaimana cara upgrade atau downgrade paket?',
    answer:
      'Anda bisa upgrade atau downgrade kapan saja melalui dashboard. Perubahan akan berlaku di periode billing berikutnya.',
  },
];

export default function HomePage() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center hero-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D5C3D]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#0D5C3D]/10 text-[#0D5C3D] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-[#0D5C3D] rounded-full animate-pulse" />
                Platform Hafalan #1 di Indonesia
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Hafal <span className="text-gradient">Quran, Hadits & Matan</span> dengan{' '}
                <span className="text-[#C9A227]">AI</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Platform hafalan cerdas untuk santri dan pesantren. Setoran otomatis dengan AI,
                muroja'ah terjadwal, dan tracking progress real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="btn-primary text-center">
                  Mulai Gratis Sekarang
                </Link>
                <Link href="/#fitur" className="btn-secondary text-center">
                  Lihat Fitur
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 pt-8 border-t">
                <div>
                  <p className="text-2xl font-bold text-[#0D5C3D]">10,000+</p>
                  <p className="text-sm text-gray-500">Santri Aktif</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-[#0D5C3D]">500+</p>
                  <p className="text-sm text-gray-500">Pesantren</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-[#0D5C3D]">1M+</p>
                  <p className="text-sm text-gray-500">Setoran</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=600&fit=crop"
                  alt="Santri membaca Al-Quran"
                  width={800}
                  height={600}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D5C3D]">Setoran Diterima!</p>
                    <p className="text-sm text-gray-500">Al-Mulk: 1-10 • Nilai: 95</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#C9A227]/20 flex items-center justify-center">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <p className="font-semibold">Streak 30 Hari!</p>
                    <p className="text-sm text-gray-500">Istiqomah muroja'ah</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">
            Fitur <span className="text-gradient">Lengkap</span> untuk Hafalan
          </h2>
          <p className="section-subtitle">
            Semua yang Anda butuhkan untuk menghafal Al-Quran, Hadits, dan Matan dalam satu
            platform.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-[#0D5C3D]/10 flex items-center justify-center text-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#FAFDF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">
            Cara <span className="text-gradient">Kerja</span>
          </h2>
          <p className="section-subtitle">
            Mulai menghafal dengan mudah dalam 3 langkah sederhana.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Pilih Materi',
                description: 'Pilih surah, hadits, atau matan yang ingin dihafal.',
                image:
                  'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400&h=300&fit=crop',
              },
              {
                step: '2',
                title: 'Rekam Setoran',
                description: 'Baca hafalan Anda dan rekam dengan fitur setoran AI.',
                image:
                  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop',
              },
              {
                step: '3',
                title: 'Dapatkan Feedback',
                description: 'AI menganalisis bacaan dan memberikan feedback detail.',
                image:
                  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="rounded-xl shadow-lg mx-auto"
                  />
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full gradient-primary text-white font-bold text-xl flex items-center justify-center shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="harga" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">
            Pilih <span className="text-gradient">Paket</span> Anda
          </h2>
          <p className="section-subtitle">
            Mulai gratis, upgrade sesuai kebutuhan. Tanpa biaya tersembunyi.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-6 ${
                  plan.popular
                    ? 'bg-[#0D5C3D] text-white ring-4 ring-[#C9A227] scale-105'
                    : 'bg-white border-2 border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C9A227] text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Paling Populer
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : ''}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : ''}`}>
                    {plan.price === '0' ? 'Rp 0' : `Rp ${plan.price}`}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2">
                      <svg
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          plan.popular ? 'text-[#C9A227]' : 'text-[#0D5C3D]'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span
                        className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 px-4 rounded-xl font-semibold transition-all ${
                    plan.popular ? 'bg-white text-[#0D5C3D] hover:bg-gray-100' : 'btn-primary'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-8">
            Butuh lebih dari 500 pengguna?{' '}
            <Link href="/contact" className="text-[#0D5C3D] font-semibold hover:underline">
              Hubungi kami
            </Link>{' '}
            untuk paket Enterprise.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0D5C3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-white">
            Dipercaya oleh <span className="text-[#C9A227]">Ribuan</span> Santri
          </h2>
          <p className="section-subtitle text-white/70">Apa kata mereka tentang Tahfidz.ai?</p>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-[#C9A227]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">
            Pertanyaan <span className="text-gradient">Umum</span>
          </h2>
          <p className="section-subtitle">Temukan jawaban untuk pertanyaan yang sering diajukan.</p>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-gray-50 rounded-xl">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold">
                  {faq.question}
                  <svg
                    className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0D5C3D] to-[#094A32] relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Memulai Perjalanan Hafalan Anda?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Bergabung dengan ribuan santri dan pesantren yang sudah merasakan kemudahan menghafal
            dengan Tahfidz.ai
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-gold text-center">
              Daftar Gratis Sekarang
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-[#0D5C3D] font-semibold rounded-xl transition-all text-center"
            >
              Hubungi Sales
            </Link>
          </div>
          <p className="text-white/60 text-sm mt-6">
            Tidak perlu kartu kredit • Setup dalam 5 menit • Batalkan kapan saja
          </p>
        </div>
      </section>
    </div>
  );
}
