$(function () {
  $("#jqGrid").jqGrid({
    url: "/admin/orders/list",
    datatype: "json",
    colModel: [
      {
        label: "id",
        name: "orderId",
        index: "orderId",
        width: 50,
        key: true,
        hidden: true,
      },
      { label: "Order number", name: "orderNo", index: "orderNo", width: 120 },
      {
        label: "Total price",
        name: "totalPrice",
        index: "totalPrice",
        width: 60,
      },
      {
        label: "Order status",
        name: "orderStatus",
        index: "orderStatus",
        width: 80,
        formatter: orderStatusFormatter,
      },
      {
        label: "Payment type",
        name: "payType",
        index: "payType",
        width: 80,
        formatter: payTypeFormatter,
      },
      {
        label: "User address",
        name: "userAddress",
        index: "userAddress",
        width: 10,
        hidden: true,
      },
      {
        label: "Create time",
        name: "createTime",
        index: "createTime",
        width: 120,
      },
      {
        label: "Operation",
        name: "createTime",
        index: "createTime",
        width: 120,
        formatter: operateFormatter,
      },
    ],
    height: 760,
    rowNum: 20,
    rowList: [20, 50, 80],
    styleUI: "Bootstrap",
    loadtext: "Loading...",
    rownumbers: false,
    rownumWidth: 20,
    autowidth: true,
    multiselect: true,
    pager: "#jqGridPager",
    region: "center",
    local: "en",
    jsonReader: {
      root: "data.list",
      page: "data.currPage",
      total: "data.totalPage",
      records: "data.totalCount",
    },
    prmNames: {
      page: "page",
      rows: "limit",
      order: "order",
    },
    gridComplete: function () {
      //隐藏grid底部滚动条
      $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x": "hidden" });
    },
  });

  $(window).resize(function () {
    $("#jqGrid").setGridWidth($(".card-body").width());
  });

  function operateFormatter(cellvalue, rowObject) {
    return (
      "<a href='##' style='border: 1px solid red;' onclick=openOrderItems(" +
      rowObject.rowId +
      ")>Order information</a>" +
      "<br>" +
      "<a href='##' style='border: 1px solid red; margin-top: 5px;' onclick=openExpressInfo(" +
      rowObject.rowId +
      ")>Recipient information</a>"
    );
  }

  function orderStatusFormatter(cellvalue) {
    //订单状态:0.待支付 1.已支付 2.配货完成 3:Out stock successfully 4.交易成功 -1.手动关闭 -2.超时关闭 -3.商家关闭
    if (cellvalue == 0) {
      return "To be paid";
    }
    if (cellvalue == 1) {
      return "Paid";
    }
    if (cellvalue == 2) {
      return "Delivery completed";
    }
    if (cellvalue == 3) {
      return "Out of stock";
    }
    if (cellvalue == 4) {
      return "Transaction successful";
    }
    if (cellvalue == -1) {
      return "Manual closure";
    }
    if (cellvalue == -2) {
      return "Timeout closed";
    }
    if (cellvalue == -3) {
      return "Business closed";
    }
  }

  function payTypeFormatter(cellvalue) {
    //支付类型:0.无 1.支付宝支付 2.微信支付
    if (cellvalue == 0) {
      return "No payment";
    }
    if (cellvalue == 1) {
      return "Alipay payment";
    }
    if (cellvalue == 2) {
      return "WeChat payment";
    }
  }

  $(window).resize(function () {
    $("#jqGrid").setGridWidth($(".card-body").width());
  });
});

/**
 * jqGrid重新加载
 */
function reload() {
  initFlatPickr();
  var page = $("#jqGrid").jqGrid("getGridParam", "page");
  $("#jqGrid")
    .jqGrid("setGridParam", {
      page: page,
    })
    .trigger("reloadGrid");
}

/**
 * 查看订单项信息
 * @param orderId
 */
function openOrderItems(orderId) {
  $(".modal-title").html("Order details");
  $.ajax({
    type: "GET", //方法类型
    url: "/admin/order-items/" + orderId,
    contentType: "application/json",
    success: function (result) {
      if (result.resultCode == 200) {
        $("#orderItemModal").modal("show");
        var itemString = "";
        for (i = 0; i < result.data.length; i++) {
          itemString +=
            result.data[i].goodsName +
            " x " +
            result.data[i].goodsCount +
            " Item ID " +
            result.data[i].goodsId +
            ";<br>";
        }
        $("#orderItemString").html(itemString);
      } else {
        swal(result.message, {
          icon: "error",
        });
      }
    },
    error: function () {
      swal("The operation failed", {
        icon: "error",
      });
    },
  });
}

/**
 * 查看收件人信息
 * @param orderId
 */
function openExpressInfo(orderId) {
  var rowData = $("#jqGrid").jqGrid("getRowData", orderId);
  $(".modal-title").html("Receiving information");
  $("#expressInfoModal").modal("show");
  $("#userAddressInfo").html(rowData.userAddress);
}

/**
 * Order editing
 */
function orderEdit() {
  reset();
  var id = getSelectedRow();
  if (id == null) {
    return;
  }
  var rowData = $("#jqGrid").jqGrid("getRowData", id);
  $(".modal-title").html("Order editing");
  $("#orderInfoModal").modal("show");
  $("#orderId").val(id);
  $("#userAddress").val(rowData.userAddress);
  $("#totalPrice").val(rowData.totalPrice);
}

//绑定modal上的保存按钮
$("#saveButton").click(function () {
  var totalPrice = $("#totalPrice").val();
  var userName = $("#userName").val();
  var userPhone = $("#userPhone").val();
  var userAddress = $("#userAddress").val();
  var id = getSelectedRowWithoutAlert();
  var url = "/admin/orders/update";
  var data = {
    orderId: id,
    totalPrice: totalPrice,
    userName: userName,
    userPhone: userPhone,
    userAddress: userAddress,
  };
  $.ajax({
    type: "POST", //方法类型
    url: url,
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (result) {
      if (result.resultCode == 200) {
        $("#orderInfoModal").modal("hide");
        swal("保存成功", {
          icon: "success",
        });
        reload();
      } else {
        $("#orderInfoModal").modal("hide");
        swal(result.message, {
          icon: "error",
        });
      }
    },
    error: function () {
      swal("The operation failed", {
        icon: "error",
      });
    },
  });
});

/**
 * 订单拣货完成
 */
function orderCheckDone() {
  var ids = getSelectedRows();
  if (ids == null) {
    return;
  }
  var orderNos = "";
  for (i = 0; i < ids.length; i++) {
    var rowData = $("#jqGrid").jqGrid("getRowData", ids[i]);
    if (rowData.orderStatus != "Paid") {
      orderNos += rowData.orderNo + " ";
    }
  }
  if ((orderNos.length > 0) & (orderNos.length < 100)) {
    swal(
      orderNos +
        "The status of the order is not Payment successful, and the Pick Complete operation cannot be performed",
      {
        icon: "error",
      }
    );
    return;
  }
  if (orderNos.length >= 100) {
    swal(
      "You have selected too many states that are not paid successfully for the order and cannot perform the Pick Complete operation",
      {
        icon: "error",
      }
    );
    return;
  }
  swal({
    title: "Confirm the pop-up box",
    text: "Confirm that you want to perform the Pick Complete operation?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((flag) => {
    if (flag) {
      $.ajax({
        type: "POST",
        url: "/admin/orders/checkDone",
        contentType: "application/json",
        data: JSON.stringify(ids),
        success: function (r) {
          if (r.resultCode == 200) {
            swal("Delivery complete", {
              icon: "success",
            });
            $("#jqGrid").trigger("reloadGrid");
          } else {
            swal(r.message, {
              icon: "error",
            });
          }
        },
      });
    }
  });
}

/**
 * 订单出库
 */
function orderCheckOut() {
  var ids = getSelectedRows();
  if (ids == null) {
    return;
  }
  var orderNos = "";
  for (i = 0; i < ids.length; i++) {
    var rowData = $("#jqGrid").jqGrid("getRowData", ids[i]);
    if (
      rowData.orderStatus != "Paid" &&
      rowData.orderStatus != "Delivery completed"
    ) {
      orderNos += rowData.orderNo + " ";
    }
  }
  if ((orderNos.length > 0) & (orderNos.length < 100)) {
    swal(
      orderNos +
        "The status of the order is not Payment Successful or Picking Complete, Outbound operation cannot be performed",
      {
        icon: "error",
      }
    );
    return;
  }
  if (orderNos.length >= 100) {
    swal(
      "You have selected too many orders whose status is not Payment Successful or Picking Complete to perform outbound operations",
      {
        icon: "error",
      }
    );
    return;
  }
  swal({
    title: "Confirm the pop-up box",
    text: "Are you sure you want to perform an out of stock operation?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((flag) => {
    if (flag) {
      $.ajax({
        type: "POST",
        url: "/admin/orders/checkOut",
        contentType: "application/json",
        data: JSON.stringify(ids),
        success: function (r) {
          if (r.resultCode == 200) {
            swal("Out stock successfully", {
              icon: "success",
            });
            $("#jqGrid").trigger("reloadGrid");
          } else {
            swal(r.message, {
              icon: "error",
            });
          }
        },
      });
    }
  });
}

function closeOrder() {
  var ids = getSelectedRows();
  if (ids == null) {
    return;
  }
  swal({
    title: "Confirm the pop-up box",
    text: "Confirm that you want to close the order?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((flag) => {
    if (flag) {
      $.ajax({
        type: "POST",
        url: "/admin/orders/close",
        contentType: "application/json",
        data: JSON.stringify(ids),
        success: function (r) {
          if (r.resultCode == 200) {
            swal("Order close successful", {
              icon: "success",
            });
            $("#jqGrid").trigger("reloadGrid");
          } else {
            swal(r.message, {
              icon: "error",
            });
          }
        },
      });
    }
  });
}

function reset() {
  $("#totalPrice").val(0);
  $("#userAddress").val("");
  $("#edit-error-msg").css("display", "none");
}
