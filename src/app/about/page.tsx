import Image from 'next/image';
import Link from 'next/link';

const team = [
  {
    name: 'Galih',
    role: 'Founder & CEO',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    description: 'Penggagas Tahfidz.ai dengan visi memudahkan umat Islam dalam menghafal.',
  },
];

const supporters = [
  {
    name: 'Kesamben Mengaji',
    description: 'Komunitas mengaji di Kesamben yang aktif dalam dakwah dan pendidikan Al-Quran.',
  },
  {
    name: 'Blitar Mengaji',
    description: 'Gerakan mengaji se-Blitar yang menghimpun berbagai majelis ilmu.',
  },
  {
    name: 'Yayasan Sanggrahan Tunas Mulia',
    description: 'Yayasan pendidikan Islam yang fokus pada pembinaan generasi Qurani.',
  },
  {
    name: 'Yayasan Imam Syafii Blitar',
    description: 'Lembaga pendidikan dengan manhaj Ahlus Sunnah wal Jamaah.',
  },
];

const values = [
  {
    icon: '📖',
    title: 'Berpegang pada Dalil',
    description: 'Semua konten berdasarkan Al-Quran dan Sunnah dengan pemahaman Salafus Shalih.',
  },
  {
    icon: '🎯',
    title: 'Fokus pada Manfaat',
    description: 'Setiap fitur dirancang untuk memberikan manfaat nyata bagi penghafal.',
  },
  {
    icon: '🔒',
    title: 'Amanah & Transparan',
    description: 'Menjaga kepercayaan pengguna dengan transparansi dalam segala hal.',
  },
  {
    icon: '🤝',
    title: 'Kolaborasi',
    description: 'Bekerja sama dengan pesantren, ustadz, dan komunitas untuk hasil terbaik.',
  },
];

const milestones = [
  { year: '2024', event: 'Ide Tahfidz.ai lahir dari kebutuhan pesantren akan teknologi hafalan' },
  { year: '2024', event: 'Pengembangan MVP dengan dukungan komunitas Blitar Mengaji' },
  { year: '2025', event: 'Peluncuran versi beta dengan fitur hafalan Quran' },
  { year: '2025', event: 'Penambahan fitur hafalan Hadits dan Matan' },
];

export default function AboutPage() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#0D5C3D] to-[#094A32] relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Tentang Tahfidz.ai</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Kami adalah tim yang berdedikasi untuk memudahkan umat Islam dalam menghafal Al-Quran,
              Hadits, dan Matan dengan memanfaatkan teknologi AI modern.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#0D5C3D]/10 text-[#0D5C3D] px-4 py-2 rounded-full text-sm font-medium mb-4">
                Visi Kami
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Menjadi Platform Hafalan <span className="text-gradient">#1</span> di Dunia
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Kami bermimpi setiap Muslim di seluruh dunia memiliki akses mudah untuk menghafal
                Al-Quran, Hadits, dan ilmu-ilmu syar'i dengan bantuan teknologi terbaik.
              </p>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-[#C9A227]/10 text-[#C9A227] px-4 py-2 rounded-full text-sm font-medium mb-4">
                Misi Kami
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Memudahkan <span className="text-[#C9A227]">Penghafal</span> di Seluruh Dunia
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-[#0D5C3D] mt-1">✓</span>
                  Menyediakan platform hafalan yang mudah diakses dan terjangkau
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D5C3D] mt-1">✓</span>
                  Mengembangkan AI yang akurat untuk mengoreksi bacaan
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D5C3D] mt-1">✓</span>
                  Mendukung pesantren dan lembaga pendidikan Islam
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D5C3D] mt-1">✓</span>
                  Melestarikan ilmu-ilmu syar'i melalui digitalisasi
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#FAFDF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">
            Nilai-Nilai <span className="text-gradient">Kami</span>
          </h2>
          <p className="section-subtitle">
            Prinsip yang kami pegang teguh dalam membangun Tahfidz.ai.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">
            Perjalanan <span className="text-gradient">Kami</span>
          </h2>
          <p className="section-subtitle">
            Dari ide sederhana menjadi platform yang digunakan ribuan santri.
          </p>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#0D5C3D]/20" />
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-[#0D5C3D] flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm font-semibold text-[#0D5C3D]">{milestone.year}</span>
                      <p className="text-gray-700 mt-1">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#FAFDF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">
            Tim <span className="text-gradient">Kami</span>
          </h2>
          <p className="section-subtitle">Orang-orang di balik Tahfidz.ai.</p>
          <div className="flex justify-center">
            {team.map((member, index) => (
              <div key={index} className="card text-center max-w-sm">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-[#0D5C3D] font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supporters */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">
            Didukung <span className="text-gradient">Oleh</span>
          </h2>
          <p className="section-subtitle">
            Terima kasih kepada para pendukung yang telah mempercayai visi kami.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {supporters.map((supporter, index) => (
              <div key={index} className="card flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0D5C3D]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0D5C3D] font-bold text-xl">
                    {supporter.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{supporter.name}</h3>
                  <p className="text-gray-600 text-sm">{supporter.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0D5C3D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ingin Bergabung dengan Misi Kami?
          </h2>
          <p className="text-white/80 mb-8">
            Baik sebagai pengguna, mitra pesantren, atau pendukung - kami menyambut Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-gold">
              Daftar Sekarang
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-[#0D5C3D] font-semibold rounded-xl transition-all"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
