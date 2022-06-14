import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../common/PrivateRoute";
import NotFound from "../common/notfound";
import Login from "../App/Auth/Login/Login";
import Dashboard from "../App/Dashboard/Dashboard";

import Member from "../App/masterdata/member";

import Deposit from "../App/ewallet/indexDeposit";
import Penarikan from "../App/ewallet/indexPenarikan";

import LaporanTransaksiMember from "../App/laporan/transaksi_member";
import LaporanPaket from "../App/laporan/penjualan/paket";
import LaporanPaketBarang from "../App/laporan/penjualan/paket_barang";
import LaporanTiket from "../App/laporan/penjualan/tiket";
import LaporanPin from "../App/laporan/laporan_pin";

import Bank from "../App/setting/bank";
import IndexSetting from "../App/setting/umum";
import IndexKurir from "../App/setting/kurir";
import IndexLanding from "../App/setting/website";

import UserList from "../App/masterdata/pengguna/indexUserList";
import UserLevel from "../App/masterdata/pengguna/indexUserLevel";
import PaketInvestasi from "../App/masterdata/investasi/paket";
import KategoriInvestasi from "../App/masterdata/investasi/kategori";
import PaketBinary from "../App/masterdata/binary/paket_binary";
import PaketBinaryOrder from "../App/masterdata/binary/index";
import BarangBinary from "../App/masterdata/binary/barang_binary";
import IndexBerita from "../App/masterdata/berita/indexBerita";
import KategoriBerita from "../App/masterdata/berita/kategoriBerita";
import Reward from "../App/masterdata/reward/indexReward";
import RewardClaim from "../App/masterdata/reward/indexRewardClaim";
import ProductClaim from "../App/masterdata/binary/indexProductClaim";
import PrintLaporanPenjualan from "../App/print/print_laporan_penjualan";

const Routes = (
  <div>
    <Switch>
      <Route path="/login" exact strict component={Login} />
      {/* DASHBOARD SECTION START */}
      <PrivateRoute path="/" exact strict component={Dashboard} />
      {/* DASHBOARD SECTION END */}

      {/* MASTERDATA SECTION START */}
      <PrivateRoute path="/masterdata/investasi/paket" exact strict component={PaketInvestasi} />
      <PrivateRoute path="/masterdata/investasi/kategori" exact strict component={KategoriInvestasi} />
      <PrivateRoute path="/masterdata/binary/paket" exact strict component={PaketBinary} />
      <PrivateRoute path="/masterdata/binary/paket/order" exact strict component={PaketBinaryOrder} />
      <PrivateRoute path="/masterdata/binary/barang" exact strict component={BarangBinary} />
      <PrivateRoute path="/masterdata/pengguna/list" exact strict component={UserList} />
      {/* <PrivateRoute path="/pengguna" exact strict component={UserLevel} /> */}
      <PrivateRoute path="/masterdata/pengguna/akses" exact strict component={UserLevel} />
      <PrivateRoute path="/masterdata/berita/list" exact strict component={IndexBerita} />
      <PrivateRoute path="/masterdata/berita/kategori" exact strict component={KategoriBerita} />
      <PrivateRoute path="/masterdata/reward" exact strict component={Reward} />
      <PrivateRoute path="/masterdata/reward/claim" exact strict component={RewardClaim} />
      <PrivateRoute path="/product/claim" exact strict component={ProductClaim} />
      <PrivateRoute path="/member" exact strict component={Member} />
      {/* MASTERDATA SECTION END */}
      {/* LAPORAN SECTION START */}
      <PrivateRoute path="/laporan/member" exact strict component={LaporanTransaksiMember} />
      <PrivateRoute path="/laporan/paket" exact strict component={LaporanPaket} />
      <PrivateRoute path="/laporan/paket_barang" exact strict component={LaporanPaketBarang} />
      <PrivateRoute path="/laporan/tiket" exact strict component={LaporanTiket} />
      <PrivateRoute path="/laporan/pin" exact strict component={LaporanPin} />
      {/* E-WALLET SECTION START */}
      <PrivateRoute path="/ewallet/deposit" exact strict component={Deposit} />
      <PrivateRoute path="/ewallet/penarikan" exact strict component={Penarikan} />
      {/* E-WALLET SECTION END */}
      {/* LAPORAN SECTION END */}
      <PrivateRoute path="/pengaturan/bank" exact strict component={Bank} />
      <PrivateRoute path="/pengaturan/umum" exact strict component={IndexSetting} />
      <PrivateRoute path="/pengaturan/kurir" exact strict component={IndexKurir} />
      <PrivateRoute path="/pengaturan/landing" exact strict component={IndexLanding} />

      {/* PRINT SECTION START */}
      <PrivateRoute path="/print_laporan_penjualan" exact strict component={PrintLaporanPenjualan} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

export default Routes;
