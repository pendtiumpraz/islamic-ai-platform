import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-[#0D5C3D] to-[#094A32]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Kebijakan Privasi</h1>
          <p className="text-white/80">
            Terakhir diperbarui:{' '}
            {new Date().toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-[#FAFDF8] rounded-xl p-6 mb-8">
              <p className="text-gray-600 m-0">
                Kebijakan privasi ini menjelaskan bagaimana Tahfidz.ai mengumpulkan, menggunakan,
                dan melindungi data pribadi Anda. Kami berkomitmen untuk menjaga privasi dan
                keamanan data Anda.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">
              1. Data yang Kami Kumpulkan
            </h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Data yang Anda Berikan</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Data Akun:</strong> Nama, email, nomor telepon, kata sandi (terenkripsi)
              </li>
              <li>
                <strong>Data Profil:</strong> Foto profil, tanggal lahir, jenis kelamin (opsional)
              </li>
              <li>
                <strong>Data Lembaga:</strong> Nama pesantren/lembaga, alamat (untuk tenant)
              </li>
              <li>
                <strong>Data Hafalan:</strong> Progress hafalan, riwayat setoran, nilai
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Data yang Dikumpulkan Otomatis</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Data Perangkat:</strong> Device fingerprint, tipe perangkat, sistem operasi
              </li>
              <li>
                <strong>Data Penggunaan:</strong> Fitur yang digunakan, waktu akses, durasi sesi
              </li>
              <li>
                <strong>Data Teknis:</strong> Alamat IP, browser, lokasi umum (negara/kota)
              </li>
              <li>
                <strong>Cookies:</strong> Session cookies untuk autentikasi
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.3 Data Audio Setoran</h3>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 my-4">
              <p className="text-green-800 m-0">
                <strong>Penting:</strong> Audio rekaman setoran Anda <strong>TIDAK</strong> disimpan
                di server kami. Audio hanya diproses sementara oleh AI untuk analisis, kemudian
                langsung dihapus. Yang tersimpan hanya hasil analisis (teks dan skor).
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">2. Penggunaan Data</h2>
            <p className="text-gray-700">Kami menggunakan data Anda untuk:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Menyediakan dan mengoperasikan layanan Platform</li>
              <li>Memproses setoran hafalan dengan AI</li>
              <li>Menyimpan dan menampilkan progress hafalan</li>
              <li>Mengirim notifikasi terkait layanan (reminder muroja'ah, dll)</li>
              <li>Memproses pembayaran langganan</li>
              <li>Meningkatkan kualitas layanan</li>
              <li>Mencegah penyalahgunaan dan spam</li>
              <li>Mematuhi kewajiban hukum</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">3. Pembagian Data</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Dengan Siapa Kami Berbagi</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Tenant/Lembaga:</strong> Musyrif dan admin lembaga dapat melihat data
                progress santri yang terdaftar di lembaga mereka
              </li>
              <li>
                <strong>Penyedia Layanan:</strong> Google (Gemini AI), penyedia hosting, payment
                gateway
              </li>
              <li>
                <strong>Pihak Berwenang:</strong> Jika diwajibkan oleh hukum
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Yang TIDAK Kami Lakukan</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Menjual data pribadi Anda ke pihak ketiga</li>
              <li>Menggunakan data untuk iklan yang tidak relevan</li>
              <li>Membagikan data ke pihak yang tidak berwenang</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">4. Keamanan Data</h2>
            <p className="text-gray-700">Kami menerapkan langkah-langkah keamanan berikut:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Enkripsi:</strong> Semua data sensitif dienkripsi saat transit (HTTPS) dan
                saat disimpan
              </li>
              <li>
                <strong>Kata Sandi:</strong> Disimpan dalam bentuk hash yang tidak dapat dibaca
              </li>
              <li>
                <strong>API Key:</strong> Dienkripsi dengan AES-256
              </li>
              <li>
                <strong>Akses Terbatas:</strong> Hanya personel yang berwenang yang dapat mengakses
                data
              </li>
              <li>
                <strong>Monitoring:</strong> Pemantauan aktivitas mencurigakan secara real-time
              </li>
              <li>
                <strong>Backup:</strong> Data di-backup secara berkala dengan enkripsi
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">5. Penyimpanan Data</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Lokasi Penyimpanan</h3>
            <p className="text-gray-700">
              Data disimpan di server yang berlokasi di Asia Tenggara (Singapore/Indonesia)
              menggunakan layanan cloud yang terpercaya.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Retensi Data</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Data Akun:</strong> Selama akun aktif + 30 hari setelah penghapusan
              </li>
              <li>
                <strong>Data Hafalan:</strong> Selama akun aktif
              </li>
              <li>
                <strong>Data Pembayaran:</strong> Sesuai kewajiban hukum (minimal 5 tahun)
              </li>
              <li>
                <strong>Log Aktivitas:</strong> 90 hari
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">6. Hak Anda</h2>
            <p className="text-gray-700">Anda memiliki hak untuk:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Akses:</strong> Meminta salinan data pribadi Anda
              </li>
              <li>
                <strong>Koreksi:</strong> Memperbarui data yang tidak akurat
              </li>
              <li>
                <strong>Penghapusan:</strong> Meminta penghapusan akun dan data Anda
              </li>
              <li>
                <strong>Portabilitas:</strong> Mengekspor data hafalan Anda
              </li>
              <li>
                <strong>Penarikan Persetujuan:</strong> Menarik persetujuan untuk komunikasi
                marketing
              </li>
              <li>
                <strong>Keberatan:</strong> Mengajukan keberatan atas pemrosesan tertentu
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Untuk menggunakan hak-hak ini, hubungi kami di pendtiumpraz@gmail.com
            </p>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">7. Cookies</h2>
            <p className="text-gray-700">Kami menggunakan cookies untuk:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Essential Cookies:</strong> Untuk autentikasi dan keamanan (wajib)
              </li>
              <li>
                <strong>Preference Cookies:</strong> Menyimpan preferensi pengguna
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Memahami penggunaan Platform (opsional)
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Anda dapat mengatur preferensi cookies melalui pengaturan browser.
            </p>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">8. Privasi Anak</h2>
            <p className="text-gray-700">
              Platform dapat digunakan oleh anak di bawah 13 tahun dengan pengawasan orang tua/wali.
              Untuk akun santri di bawah umur, orang tua/wali atau pihak lembaga bertanggung jawab
              atas persetujuan pengumpulan data.
            </p>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">9. Perubahan Kebijakan</h2>
            <p className="text-gray-700">
              Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan material akan
              diberitahukan melalui:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Email ke alamat yang terdaftar</li>
              <li>Notifikasi di dalam aplikasi</li>
              <li>Banner di website</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">10. Kontak</h2>
            <p className="text-gray-700">
              Untuk pertanyaan tentang kebijakan privasi atau data Anda, hubungi:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mt-4">
              <p className="font-semibold text-lg mb-2">Data Protection Contact</p>
              <ul className="list-none pl-0 space-y-2 text-gray-700">
                <li>
                  <strong>Nama:</strong> Galih
                </li>
                <li>
                  <strong>Email:</strong> pendtiumpraz@gmail.com
                </li>
                <li>
                  <strong>Telepon:</strong> 081319504441
                </li>
                <li>
                  <strong>Alamat:</strong> Blitar, Jawa Timur, Indonesia
                </li>
              </ul>
            </div>

            <div className="bg-[#0D5C3D]/5 rounded-xl p-6 mt-8">
              <p className="text-gray-700 m-0 text-center font-arabic text-xl">
                وَاللَّهُ يَعْلَمُ مَا تُسِرُّونَ وَمَا تُعْلِنُونَ
              </p>
              <p className="text-gray-500 text-center text-sm mt-2 m-0">
                "Dan Allah mengetahui apa yang kamu rahasiakan dan apa yang kamu nyatakan." (QS.
                An-Nahl: 19)
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link href="/terms" className="text-[#0D5C3D] font-medium hover:underline">
              ← Baca Syarat & Ketentuan
            </Link>
            <Link href="/contact" className="btn-secondary">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
