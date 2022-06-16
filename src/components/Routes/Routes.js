import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../common/PrivateRoute";
import NotFound from "../common/notfound";
import Login from "../App/Auth/Login/Login";
import Dashboard from "../App/Dashboard/Dashboard";
import Deposit from "../App/ewallet/indexDeposit";
import Penarikan from "../App/ewallet/indexPenarikan";
import LaporanPenjualan from "../App/laporan/transaksi/penjualan";
import LaporanMember from "../App/laporan/transaksi/member";
import Bank from "../App/setting/bank";
import IndexSetting from "../App/setting/umum";
import IndexKurir from "../App/setting/kurir";
import IndexLanding from "../App/setting/website";
import Member from "../App/masterdata/member/index";
import ListPaket from "../App/masterdata/paket/index";
import KategoriPaket from "../App/masterdata/paket/kategori";
import UserList from "../App/masterdata/pengguna/index";
import UserLevel from "../App/masterdata/pengguna/level";
import IndexBerita from "../App/masterdata/berita/indexBerita";
import KategoriBerita from "../App/masterdata/berita/kategoriBerita";
import PrintLaporanPenjualan from "../App/print/print_laporan_penjualan";

const Routes = (
  <div>
    <Switch>
      <Route path="/login" exact strict component={Login} />
      {/* DASHBOARD SECTION START */}
      <PrivateRoute path="/" exact strict component={Dashboard} />
      {/* DASHBOARD SECTION END */}

      {/* MASTERDATA SECTION START */}
      <PrivateRoute
        path="/masterdata/pengguna"
        exact
        strict
        component={UserList}
      />
      <PrivateRoute
        path="/masterdata/pengguna/akses"
        exact
        strict
        component={UserLevel}
      />
      <PrivateRoute
        path="/masterdata/berita"
        exact
        strict
        component={IndexBerita}
      />
      <PrivateRoute
        path="/masterdata/berita/kategori"
        exact
        strict
        component={KategoriBerita}
      />
      <PrivateRoute
        path="/masterdata/paket"
        exact
        strict
        component={ListPaket}
      />
      <PrivateRoute
        path="/masterdata/paket/kategori"
        exact
        strict
        component={KategoriPaket}
      />
      <PrivateRoute path="/masterdata/member" exact strict component={Member} />
      {/* MASTERDATA SECTION END */}
      {/* LAPORAN SECTION START */}
      <PrivateRoute
        path="/laporan/transaksi/member"
        exact
        strict
        component={LaporanMember}
      />
      <PrivateRoute
        path="/laporan/transaksi/penjualan"
        exact
        strict
        component={LaporanPenjualan}
      />

      {/* E-WALLET SECTION START */}
      <PrivateRoute path="/ewallet/deposit" exact strict component={Deposit} />
      <PrivateRoute
        path="/ewallet/penarikan"
        exact
        strict
        component={Penarikan}
      />
      {/* E-WALLET SECTION END */}
      {/* LAPORAN SECTION END */}
      <PrivateRoute path="/pengaturan/bank" exact strict component={Bank} />
      <PrivateRoute
        path="/pengaturan/umum"
        exact
        strict
        component={IndexSetting}
      />
      <PrivateRoute
        path="/pengaturan/kurir"
        exact
        strict
        component={IndexKurir}
      />
      <PrivateRoute
        path="/pengaturan/landing"
        exact
        strict
        component={IndexLanding}
      />

      {/* PRINT SECTION START */}
      <PrivateRoute
        path="/print_laporan_penjualan"
        exact
        strict
        component={PrintLaporanPenjualan}
      />
      <Route component={NotFound} />
    </Switch>
  </div>
);

export default Routes;
