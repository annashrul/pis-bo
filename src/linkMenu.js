import IndexMember from "./components/App/masterdata/member/index";
import IndexUser from "./components/App/masterdata/pengguna/index";
import IndexUserLevel from "./components/App/masterdata/pengguna/level";
import IndexPaket from "./components/App/masterdata/paket/index";
import IndexKategoriPaket from "./components/App/masterdata/paket/kategori";
import IndexBerita from "./components/App/masterdata/berita/indexBerita";
import IndexKategoriBerita from "./components/App/masterdata/berita/kategoriBerita";
import IndexTestimoni from "./components/App/masterdata/testimoni/index";
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
  indexTestimoni: "/masterdata/testimoni",
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
  { link: LinkMenu.indexUserLevel, component: IndexUserLevel },
  { link: LinkMenu.indexPaket, component: IndexPaket },
  { link: LinkMenu.indexKategoriPaket, component: IndexKategoriPaket },
  { link: LinkMenu.indexBerita, component: IndexBerita },
  { link: LinkMenu.indexTestimoni, component: IndexTestimoni },
  { link: LinkMenu.indexDeposit, component: IndexDeposit },
  { link: LinkMenu.indexPenarikan, component: IndexPenarikan },
  { link: LinkMenu.indexLaporanMember, component: IndexLaporanMember },
  { link: LinkMenu.indexLaporanPenjualan, component: IndexLaporanPenjualan },
  { link: LinkMenu.indexPengaturanUmum, component: IndexPengaturanUmum },
  { link: LinkMenu.indexPengaturanBank, component: IndexPengaturaBank },
  { link: LinkMenu.indexPengaturanKurir, component: IndexPengaturanKurir },
  { link: LinkMenu.indexPengaturanLanding, component: IndexPengaturanLanding },
];

export const menu = () => {
  return [
    {
      id: 0,
      label: "member",
      path: LinkMenu.indexMember,
      isChecked: false,
      isToggle: false,
      sub: undefined,
      icons: "fa fa-user-o",
    },
    {
      id: 1000,
      label: "testimoni",
      path: LinkMenu.indexTestimoni,
      isChecked: false,
      isToggle: false,
      sub: undefined,
      icons: "fa fa-star-o",
    },

    {
      id: 20,
      label: "pengguna",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-credit-card",
      sub: [
        {
          id: 21,
          label: "list",
          path: LinkMenu.indexUser,
          parent: "pengguna",
          isChecked: false,
        },
        {
          id: 22,
          label: "akses",
          path: LinkMenu.indexUserLevel,
          parent: "pengguna",
          isChecked: false,
        },
      ],
    },

    {
      id: 500,
      label: "paket",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-credit-card",
      sub: [
        {
          id: 501,
          label: "list",
          path: LinkMenu.indexPaket,
          parent: "paket",
          isChecked: false,
        },
        {
          id: 502,
          label: "kategori",
          path: LinkMenu.indexKategoriPaket,
          parent: "paket",
          isChecked: false,
        },
      ],
    },

    {
      id: 10,
      label: "e-wallet",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-credit-card",
      sub: [
        {
          id: 11,
          label: "deposit",
          path: LinkMenu.indexDeposit,
          parent: "e-wallet",
          isChecked: false,
        },
        {
          id: 12,
          label: "penarikan",
          path: LinkMenu.indexPenarikan,
          parent: "e-wallet",
          isChecked: false,
        },
      ],
    },

    {
      id: 350,
      label: "berita",
      path: "",
      isChecked: false,
      icons: "fa fa-newspaper-o",
      sub: [
        {
          id: 351,
          label: "list",
          path: LinkMenu.indexBerita,
          parent: "berita",
          isChecked: false,
          sub: undefined,
        },
        {
          id: 352,
          label: "kategori",
          path: LinkMenu.indexKategoriBerita,
          parent: "berita",
          isChecked: false,
          sub: undefined,
        },
      ],
    },
    {
      id: 400,
      label: "laporan",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-book",
      sub: [
        {
          id: 401,
          label: "member",
          path: LinkMenu.indexLaporanMember,
          parent: "laporan",
          isChecked: false,
        },
        {
          id: 401,
          label: "penjualan",
          path: LinkMenu.indexLaporanPenjualan,
          parent: "laporan",
          isChecked: false,
        },
      ],
      otherSub: true,
    },
    {
      id: 15,
      label: "pengaturan",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-cogs",
      sub: [
        {
          id: 16,
          label: "umum",
          path: LinkMenu.indexPengaturanUmum,
          parent: "pengaturan",
          isChecked: false,
        },
        {
          id: 17,
          label: "bank",
          path: LinkMenu.indexPengaturanBank,
          parent: "pengaturan",
          isChecked: false,
        },
        {
          id: 18,
          label: "kurir",
          path: LinkMenu.indexPengaturanKurir,
          parent: "pengaturan",
          isChecked: false,
        },
        {
          id: 19,
          label: "landing",
          path: LinkMenu.indexPengaturanLanding,
          parent: "pengaturan",
          isChecked: false,
        },
      ],
      otherSub: true,
    },
  ];
};
