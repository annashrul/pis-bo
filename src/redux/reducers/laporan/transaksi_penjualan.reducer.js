import { REPORT_TRANSAKSI_PENJUALAN } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  meta: [],
  total: [],
  data: [],
  pagination: [],
};

export const reportTransaksiPenjualanReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case REPORT_TRANSAKSI_PENJUALAN.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.data,
        pagination: action.data.pagination,
      });
    case REPORT_TRANSAKSI_PENJUALAN.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    default:
      return state;
  }
};
