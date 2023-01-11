$(function () {
  $("#jqGrid").jqGrid({
    url: "/admin/users/list",
    datatype: "json",
    colModel: [
      {
        label: "id",
        name: "userId",
        index: "userId",
        width: 50,
        key: true,
        hidden: true,
      },
      { label: "Nick Name", name: "nickName", index: "nickName", width: 180 },
      {
        label: "Login Name",
        name: "loginName",
        index: "loginName",
        width: 120,
      },
      {
        label: "Status",
        name: "lockedFlag",
        index: "lockedFlag",
        width: 60,
        formatter: lockedFormatter,
      },
      {
        label: "Deleted",
        name: "isDeleted",
        index: "isDeleted",
        width: 60,
        formatter: deletedFormatter,
      },
      {
        label: "Registration time",
        name: "createTime",
        index: "createTime",
        width: 120,
      },
    ],
    height: 560,
    rowNum: 10,
    rowList: [10, 20, 50],
    styleUI: "Bootstrap",
    loadtext: "loading...",
    rownumbers: false,
    rownumWidth: 20,
    autowidth: true,
    multiselect: true,
    pager: "#jqGridPager",
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

  function lockedFormatter(cellvalue) {
    if (cellvalue == 1) {
      return '<button type="button" class="btn btn-block btn-secondary btn-sm" style="width: 50%;">Locked</button>';
    } else if (cellvalue == 0) {
      return '<button type="button" class="btn btn-block btn-success btn-sm" style="width: 50%;">Normal</button>';
    }
  }

  function deletedFormatter(cellvalue) {
    if (cellvalue == 1) {
      return '<button type="button" class="btn btn-block btn-secondary btn-sm" style="width: 50%;">Logout</button>';
    } else if (cellvalue == 0) {
      return '<button type="button" class="btn btn-block btn-success btn-sm" style="width: 50%;">Normal</button>';
    }
  }
});

/**
 * jqGrid重新加载
 */
function reload() {
  var page = $("#jqGrid").jqGrid("getGridParam", "page");
  $("#jqGrid")
    .jqGrid("setGridParam", {
      page: page,
    })
    .trigger("reloadGrid");
}

function lockUser(lockStatus) {
  var ids = getSelectedRows();
  if (ids == null) {
    return;
  }
  if (lockStatus != 0 && lockStatus != 1) {
    swal("Illegal operation", {
      icon: "error",
    });
  }
  swal({
    title: "Confirm the pop-up box",
    text: "Confirm that you want to change the account status?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((flag) => {
    if (flag) {
      $.ajax({
        type: "POST",
        url: "/admin/users/lock/" + lockStatus,
        contentType: "application/json",
        data: JSON.stringify(ids),
        success: function (r) {
          if (r.resultCode == 200) {
            swal("The operation succeeded", {
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
