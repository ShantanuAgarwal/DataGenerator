const btnAdd = $("#btnAddDataOption");
const btnRemove = $("#btnRemoveDataOption");
const sb = $("#dataOptionsList");
const dataOptionField = $("#addDataOption");

$(document).ready(function () {
  //$("#table_id").DataTable();
  HideAllOptionFields();
  $("#dataAttributeDisplayTable").DataTable({
    searching: false,
    paging: false,
    info: false,
    ordering: false,
  });
  // $("#btnGenerateData").click(function () {
  //   var data = GetTableDataAsJson();
  //   var totalCount = $("#totalCount").val();
  //   var requestObj = new Object();
  //   requestObj.Data = data;
  //   requestObj.totalCount = totalCount;
  //   $.ajax({
  //     type: "POST",
  //     url: "/generateData",
  //     contentType: "application/json",
  //     data: JSON.stringify(requestObj),
  //     dataType: "json",
  //     success: function (result) {
  //       //console.log(result);
  //       var obj = JSON.parse(result);
  //       var columnData = JSON.parse(obj["Columns"]);
  //       var outputData = JSON.stringify(obj["Output"]);
  //       ManageResultTable(columnData, outputData);
  //       console.log(outputData);
  //     },
  //     error: function () {
  //       console.log("Fail");
  //     },
  //   });
  // });
  $("#attributeType").change(function () {
    changedValue = $(this).val();
    HideAllOptionFields();
    if (changedValue == "Categorical") {
      $(".dataOptionsRow").show();
    } else if (
      changedValue == "Continous (int)" ||
      changedValue == "Continous (float)"
    ) {
      $(".numberOptionRow").show();
    }
  });
  $("#btnAddDataAttribute").click(function () {
    GetAllDataFields();
    var json = GetTableDataAsJson();
    $("#dataQuery").val(JSON.stringify(json));
  });
  btnAdd.click(function (e) {
    selectedValue = $("#addDataOption").val();
    // validate the option
    if (selectedValue == "") {
      alert("Please enter the name.");
      return;
    }
    splitString = selectedValue.split("|");
    for (i = 0; i < splitString.length; i++) {
      $("#dataOptionsList").append(new Option(splitString[i], splitString[i]));
    }
    $("#addDataOption").val("");
    $("#addDataOption").focus();
  });
  $("#btnRemoveDataOption").click(function (e) {
    $("#dataOptionsList option:selected").each(function () {
      var $this = $(this);
      $this.remove();
    });
  });
  //ManageResultTable();
});
function GetAllDataFields() {
  var t = $("#dataAttributeDisplayTable").DataTable();
  var options = $("#dataOptionsList option");
  var values = $.map(options, function (option) {
    return option.value;
  });
  var dataObj = new Object();
  dataObj.Id = $("#rowId").val();
  dataObj.AttributeName = $("#attributeName").val();
  dataObj.AttributeType = $("#attributeType").val();
  dataObj.DataTypeValues = values;
  dataObj.LowerBound = $("#lowerBoundText").val();
  dataObj.UpperBound = $("#upperBoundText").val();
  t.row
    .add([
      dataObj.AttributeName,
      dataObj.AttributeType,
      dataObj.DataTypeValues.join("|"),
      dataObj.LowerBound,
      dataObj.UpperBound,
      "",
    ])
    .draw(false);
  ResetAllValues();
}
function HideAllOptionFields() {
  $(".dataOptionsRow").hide();
  $(".numberOptionRow").hide();
}
function ResetAllValues() {
  $("#rowId").val(uuidv4());
  $("#attributeName").val("");
  $("#attributeType").val("");
  $("#addDataOption").val("");
  $("#lowerBoundText").val("");
  $("#upperBoundText").val("");
  $("#dataOptionsList").find("option").remove().end();
}
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function GetTableDataAsJson() {
  var heads = [];
  $("#dataAttributeDisplayTable>thead")
    .find("th")
    .each(function () {
      heads.push($(this).text().trim());
    });
  var rows = [];
  $("#dataAttributeDisplayTable>tbody tr").each(function () {
    cur = {};
    $(this)
      .find("td")
      .each(function (i, v) {
        cur[heads[i]] = $(this).text().trim();
      });
    rows.push(cur);
    cur = {};
  });
  return rows;
}
function ManageResultTable(columnData, data) {
  //var columnData = [{ data: "Gender" }, { data: "Age" }];
  $("#table_id").DataTable({
    bDestroy: true,
    columns: columnData,
  });
  // for (i = 0; i < data.length; i++) {
  //   $("#table_id").DataTable().row.add(data[i]);
  // }
  //$("#table_id").DataTable().destroy();
  // $("#table_id").DataTable({
  //   columns: columnData,
  //   data: data,
  //   scrollX: true,
  // });
}
