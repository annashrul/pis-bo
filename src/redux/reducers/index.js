import { combineReducers } from "redux";
import { modalReducer, modalTypeReducer } from "./modal.reducer";
import { dashboardReducer } from "./dashboard/dashboard.reducer";
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import { siteReducer } from "./site.reducer";
import { kategoriReducer } from "./kategori/kategori.reducer";
import { memberReducer } from "./masterdata/member.reducer";
import { alamatReducer } from "./masterdata/alamat.reducer";
import { paketReducer } from "./masterdata/paket.reducer";
import { kategoriPaketReducer } from "./masterdata/kategori_paket.reducer";
import { bankReducer } from "./masterdata/bank.reducer";
import { contentReducer } from "./konten/konten.reducer";
import { userListReducer } from "./masterdata/user_list.reducer";
import { userLevelReducer } from "./masterdata/user_level.reducer";
import { depositReducer } from "./ewallet/deposit.reducer";
import { configWalletReducer } from "./ewallet/config_wallet.reducer";
import { penarikanReducer } from "./ewallet/penarikan.reducer";
import { reportTransaksiMemberReducer } from "./laporan/transaksi_member.reducer";
import { reportTransaksiPenjualanReducer } from "./laporan/transaksi_penjualan.reducer";
import { generalReducer } from "./setting/general.reducer";
import { banksReducer } from "./setting/bank.reducer";
import { kurirReducer } from "./setting/kurir.reducer";

export default combineReducers({
  modalReducer,
  modalTypeReducer,
  dashboardReducer,
  siteReducer,
  paketReducer,
  kategoriPaketReducer,
  memberReducer,
  alamatReducer,
  bankReducer,
  userListReducer,
  userLevelReducer,
  kategoriReducer,
  contentReducer,
  depositReducer,
  configWalletReducer,
  penarikanReducer,
  generalReducer,
  banksReducer,
  kurirReducer,
  reportTransaksiMemberReducer,
  reportTransaksiPenjualanReducer,
  auth: authReducer,
  errors: errorsReducer,
});
