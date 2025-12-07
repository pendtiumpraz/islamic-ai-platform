import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-[#0D5C3D] to-[#094A32]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Syarat & Ketentuan</h1>
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
                Dengan menggunakan layanan Tahfidz.ai, Anda menyetujui syarat dan ketentuan berikut.
                Harap baca dengan seksama sebelum menggunakan platform kami.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">1. Definisi</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>"Platform"</strong> mengacu pada aplikasi web dan mobile Tahfidz.ai
              </li>
              <li>
                <strong>"Pengguna"</strong> mengacu pada individu yang mendaftar dan menggunakan
                Platform
              </li>
              <li>
                <strong>"Tenant"</strong> mengacu pada lembaga/pesantren yang berlangganan Platform
              </li>
              <li>
                <strong>"Konten"</strong> mengacu pada materi hafalan, audio, dan data yang tersedia
                di Platform
              </li>
              <li>
                <strong>"Layanan"</strong> mengacu pada fitur-fitur yang disediakan oleh Platform
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">2. Penggunaan Layanan</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Kelayakan</h3>
            <p className="text-gray-700">
              Anda harus berusia minimal 13 tahun untuk menggunakan Platform. Jika Anda berusia di
              bawah 18 tahun, Anda harus mendapat izin dari orang tua atau wali.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Akun Pengguna</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Anda bertanggung jawab menjaga kerahasiaan akun dan kata sandi Anda</li>
              <li>Anda bertanggung jawab atas semua aktivitas yang terjadi di akun Anda</li>
              <li>
                Anda harus segera memberitahu kami jika ada penggunaan tidak sah atas akun Anda
              </li>
              <li>Satu perangkat hanya dapat didaftarkan untuk satu akun</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Penggunaan yang Dilarang</h3>
            <p className="text-gray-700">Anda dilarang untuk:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Menggunakan Platform untuk tujuan ilegal atau tidak sah</li>
              <li>Mencoba mengakses sistem atau data tanpa izin</li>
              <li>Mengganggu atau merusak operasi Platform</li>
              <li>Membuat akun palsu atau multiple account</li>
              <li>Menyalahgunakan fitur AI untuk tujuan selain hafalan</li>
              <li>Mendistribusikan ulang konten tanpa izin</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">3. Layanan dan Fitur</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Fitur AI</h3>
            <p className="text-gray-700">
              Platform menggunakan teknologi AI untuk membantu proses hafalan. Hasil analisis AI
              bersifat bantuan dan tidak menggantikan koreksi dari musyrif/ustadz. Kami tidak
              menjamin akurasi 100% dari hasil AI.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Konten Islami</h3>
            <p className="text-gray-700">
              Semua konten islami (Al-Quran, Hadits, Matan) disajikan berdasarkan sumber yang
              terpercaya. Untuk pertanyaan hukum syar'i, pengguna disarankan untuk berkonsultasi
              dengan ulama yang kompeten.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Ketersediaan Layanan</h3>
            <p className="text-gray-700">
              Kami berusaha menyediakan layanan 24/7, namun tidak menjamin ketersediaan tanpa
              gangguan. Maintenance dan update dapat dilakukan sewaktu-waktu dengan atau tanpa
              pemberitahuan.
            </p>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">
              4. Langganan dan Pembayaran
            </h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Paket Berlangganan</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Tersedia paket gratis dengan fitur terbatas</li>
              <li>Paket berbayar dikenakan biaya sesuai yang tercantum di halaman harga</li>
              <li>Pembayaran dilakukan di muka untuk periode tertentu</li>
              <li>Harga dapat berubah dengan pemberitahuan 30 hari sebelumnya</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              4.2 Pembatalan dan Pengembalian Dana
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Pengguna dapat membatalkan langganan kapan saja</li>
              <li>Tidak ada pengembalian dana untuk periode yang sudah dibayar</li>
              <li>Akses akan tetap aktif hingga akhir periode pembayaran</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">
              5. Hak Kekayaan Intelektual
            </h2>
            <p className="text-gray-700">
              Platform, termasuk desain, kode, logo, dan fitur-fiturnya adalah milik Tahfidz.ai dan
              dilindungi hukum hak cipta. Pengguna tidak diperkenankan untuk:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Menyalin, memodifikasi, atau mendistribusikan Platform</li>
              <li>Melakukan reverse engineering</li>
              <li>Menggunakan merek dagang tanpa izin tertulis</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">
              6. Batasan Tanggung Jawab
            </h2>
            <p className="text-gray-700">Tahfidz.ai tidak bertanggung jawab atas:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Kerugian tidak langsung yang timbul dari penggunaan Platform</li>
              <li>Kehilangan data akibat kelalaian pengguna</li>
              <li>Gangguan layanan di luar kendali kami</li>
              <li>Keakuratan hasil analisis AI</li>
              <li>Konten yang diunggah oleh pengguna lain</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">7. Penghentian Layanan</h2>
            <p className="text-gray-700">
              Kami berhak menghentikan atau menangguhkan akses Anda ke Platform tanpa pemberitahuan
              jika:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Anda melanggar syarat dan ketentuan ini</li>
              <li>Anda melakukan aktivitas yang merugikan Platform atau pengguna lain</li>
              <li>Atas permintaan pihak berwenang yang sah</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">
              8. Perubahan Syarat dan Ketentuan
            </h2>
            <p className="text-gray-700">
              Kami dapat mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan material akan
              diberitahukan melalui email atau notifikasi di Platform. Penggunaan Platform setelah
              perubahan dianggap sebagai persetujuan atas perubahan tersebut.
            </p>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">9. Hukum yang Berlaku</h2>
            <p className="text-gray-700">
              Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap perselisihan
              akan diselesaikan melalui musyawarah. Jika tidak tercapai kesepakatan, akan
              diselesaikan di Pengadilan Negeri Blitar.
            </p>

            <h2 className="text-2xl font-bold text-[#0D5C3D] mt-8 mb-4">10. Kontak</h2>
            <p className="text-gray-700">
              Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami:
            </p>
            <ul className="list-none pl-0 space-y-2 text-gray-700 mt-4">
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

          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link href="/privacy" className="text-[#0D5C3D] font-medium hover:underline">
              Baca Kebijakan Privasi →
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
