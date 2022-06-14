import { combineReducers } from "redux";
import { modalReducer, modalTypeReducer } from "./modal.reducer";
import { dashboardReducer } from "./dashboard/dashboard.reducer";
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import { siteReducer } from "./site.reducer";
import { kategoriReducer } from "./kategori/kategori.reducer";
import { pinReducer } from "./paket/pin.reducer";
import { paketReducer } from "./paket/paket.reducer";
import { memberReducer } from "./masterdata/member.reducer";
import { alamatReducer } from "./masterdata/alamat.reducer";
import { bankReducer } from "./masterdata/bank.reducer";
import { contentReducer } from "./konten/konten.reducer";
import { userListReducer } from "./masterdata/user_list.reducer";
import { userLevelReducer } from "./masterdata/user_level.reducer";
import { depositReducer } from "./ewallet/deposit.reducer";
import { configWalletReducer } from "./ewallet/config_wallet.reducer";
import { penarikanReducer } from "./ewallet/penarikan.reducer";
import { reportTransaksiMemberReducer } from "./laporan/report_transaksi_member.reducer";
import { reportPaketReducer } from "./laporan/report_paket.reducer";
import { reportBarangReducer } from "./laporan/report_barang.reducer";
import { reportTiketReducer } from "./laporan/report_tiket.reducer";
import { reportRewardReducer } from "./laporan/report_reward.reducer";
import { laporanPenjualanReducer } from "./laporan/laporan_penjualan.reducer";
import { reportPinReducer } from "./laporan/report_pin.reducer";
import { generalReducer } from "./setting/general.reducer";
import { banksReducer } from "./setting/bank.reducer";
import { kurirReducer } from "./setting/kurir.reducer";
import { kategoriInvestasiReducer } from "./masterdata/investasi/kategori_investasi.reducer";
import { barangBinaryReducer } from "./masterdata/binary/barang_binary.reducer";
import { paketBinaryReducer } from "./masterdata/binary/paket_binary.reducer";
import { kategoriBinaryReducer } from "./masterdata/binary/kategori_binary.reducer";
import { kategoriBeritaReducer } from "./masterdata/berita/kategori_berita.reducer";
import { rewardReducer } from "./masterdata/reward/reward.reducer";

export default combineReducers({
  modalReducer,
  modalTypeReducer,
  dashboardReducer,
  siteReducer,
  pinReducer,
  barangBinaryReducer,
  paketBinaryReducer,
  kategoriBinaryReducer,
  rewardReducer,
  reportRewardReducer,
  paketReducer,
  kategoriBeritaReducer,
  memberReducer,
  kategoriInvestasiReducer,
  alamatReducer,
  bankReducer,
  userListReducer,
  userLevelReducer,
  kategoriReducer,
  contentReducer,
  depositReducer,
  configWalletReducer,
  penarikanReducer,
  reportTransaksiMemberReducer,
  reportPaketReducer,
  reportBarangReducer,
  reportTiketReducer,
  reportPinReducer,
  generalReducer,
  banksReducer,
  laporanPenjualanReducer,
  kurirReducer,
  auth: authReducer,
  errors: errorsReducer,
});
