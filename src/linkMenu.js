import IndexMember from "./components/App/masterdata/member/index";
import IndexUser from "./components/App/masterdata/pengguna/index";
import IndexUserLevel from "./components/App/masterdata/pengguna/level";
import IndexPaket from "./components/App/masterdata/paket/index";
import IndexKategoriPaket from "./components/App/masterdata/paket/kategori";
import IndexBerita from "./components/App/masterdata/berita/indexBerita";
import IndexKategoriBerita from "./components/App/masterdata/berita/kategoriBerita";
import IndexDeposit from "./components/App/ewallet/indexDeposit";
import IndexPenarikan from "./components/App/ewallet/indexPenarikan";
import IndexLaporanPenjualan from "./components/App/laporan/transaksi/penjualan";
import IndexLaporanMember from "./components/App/laporan/transaksi/member";
import IndexPengaturaBank from "./components/App/setting/bank";
import IndexPengaturanUmum from "./components/App/setting/umum";
import IndexPengaturanKurir from "./components/App/setting/kurir";
import IndexPengaturanLanding from "./components/App/setting/website";

export const LinkMenu = {
  dashboard: "/",
  indexMember: "/masterdata/member",
  indexUser: "/masterdata/pengguna",
  indexUserLevel: "/masterdata/pengguna/akses",
  indexPaket: "/masterdata/paket",
  indexKategoriPaket: "/masterdata/paket/kategori",
  indexBerita: "/masterdata/berita",
  indexKategoriBerita: "/masterdata/berita/kategori",
  indexDeposit: "/ewallet/deposit",
  indexPenarikan: "/ewallet/penarikan",
  indexLaporanMember: "/laporan/transaksi/member",
  indexLaporanPenjualan: "/laporan/transaksi/penjualan",
  indexPengaturanUmum: "/pengatura/umum",
  indexPengaturanBank: "/pengaturan/bank",
  indexPengaturanKurir: "/pengaturan/kurir",
  indexPengaturanLanding: "/pengaturan/landing",
};

export const menuItem = [
  { link: LinkMenu.indexMember, component: IndexMember },
  { link: LinkMenu.indexUser, component: IndexUser },
  { component: IndexUserLevel },
  { link: LinkMenu.indexPaket, component: IndexPaket },
  { link: LinkMenu.indexKategoriPaket, component: IndexKategoriPaket },
  { link: LinkMenu.indexBerita, component: IndexBerita },
  { link: LinkMenu.indexKategoriBerita, component: IndexKategoriBerita },
  { link: LinkMenu.indexDeposit, component: IndexDeposit },
  { link: LinkMenu.indexPenarikan, component: IndexPenarikan },
  { link: LinkMenu.indexLaporanMember, component: IndexLaporanMember },
  { link: LinkMenu.indexLaporanPenjualan, component: IndexLaporanPenjualan },
  { link: LinkMenu.indexPengaturanUmum, component: IndexPengaturanUmum },
  { link: LinkMenu.indexPengaturanBank, component: IndexPengaturaBank },
  { link: LinkMenu.indexPengaturanKurir, component: IndexPengaturanKurir },
  { link: LinkMenu.indexPengaturanLanding, component: IndexPengaturanLanding },
];
