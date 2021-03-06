import React, { Component } from "react";
import ButtonActionTableCommon from "./ButtonActionTableCommon";
import Paginationq, { myDate, noData, generateNo } from "../../helper";

export default class TableCommon extends Component {
  // constructor(props) {
  //   super(props);
  // }
  checkTypeLabel(res, val) {
    if (val.date) return myDate(res);
    return res;
  }

  render() {
    let props = this.props;

    return (
      <div>
        <div style={{ overflowX: "auto" }}>
          <table className="table table-hover table-noborder">
            <thead>
              <tr>
                {props.head.map((res, index) => {
                  return (
                    <th
                      key={index}
                      className={`${res.colSpan > 1 && "text-center"} text-black middle nowrap ${res.className ? res.className : ""}`}
                      width={res.width ? res.width : "auto"}
                      rowSpan={res.rowSpan ? res.rowSpan : "1"}
                      colSpan={res.colSpan ? res.colSpan : "1"}
                    >
                      {res.label}
                    </th>
                  );
                })}
              </tr>
              {props.rowSpan && (
                <tr>
                  {props.rowSpan.map((res, index) => {
                    return (
                      <th className={`text-black middle nowrap ${res.className ? res.className : ""}`} key={index}>
                        {res.label}
                      </th>
                    );
                  })}
                </tr>
              )}
            </thead>
            <tbody>
              {props.renderRow === undefined
                ? typeof props.body
                  ? props.body.length > 0
                    ? props.body.map((res, index) => {
                        return (
                          <tr key={index}>
                            {props.meta !== undefined && <td className={`text-center middle nowrap`}>{generateNo(index, props.meta.current_page)}</td>}
                            {props.action && (
                              <td className={`text-center middle nowrap`}>
                                <ButtonActionTableCommon action={props.action} callback={(e) => props.callback(e, index)} />
                              </td>
                            )}
                            {props.label.map((val, key) => {
                              return (
                                <td key={key} className={`${val.isCurrency !== undefined && "text-right"} middle nowrap ${val.className && val.className}`}>
                                  {this.checkTypeLabel(res[val.label], val)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    : noData(props.head.length)
                  : noData(props.head.length)
                : props.renderRow}
            </tbody>
            {props.footer && (
              <tfoot style={{ border: "1px solid black" }}>
                {props.footer.map((val, key) => {
                  return (
                    <tr key={key}>
                      {val.data.map((res, index) => {
                        return (
                          <th key={index} colSpan={res.colSpan ? res.colSpan : ""} className={`middle nowrap ${res.className ? res.className : "text-right"}`}>
                            {res.label}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </tfoot>
            )}
          </table>
        </div>

        {props.meta !== undefined && (
          <div style={{ marginTop: "20px", float: "right" }}>
            <Paginationq current_page={props.meta.current_page} per_page={props.meta.per_page} total={props.meta.total} callback={(page) => props.callbackPage(page)} />
          </div>
        )}
      </div>
    );
  }
}
