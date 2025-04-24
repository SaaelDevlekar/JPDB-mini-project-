const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIRL = "/api/irl";
const jpdbIML = "/api/iml";
const DB_NAME = "EMP-DB";
const REL_NAME = "EmpData";
const TOKEN = "90934745|-31949209102049503|90955935";  // Use your own token if needed

function saveRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", data.rec_no);
}

function getEmpIdAsJsonObj() {
    let empid = $("#empid").val();
    return JSON.stringify({ id: empid });
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#empName").val(record.empName);
    $("#empsal").val(record.empsal);
    $("#hra").val(record.hra);
    $("#da").val(record.da);
}

function resetForm() {
    $("#empid").val("").prop("disabled", false);
    $("#empName").val("");
    $("#empsal").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
}

function validateData() {
    let empid = $("#empid").val();
    let empName = $("#empName").val();
    let empsal = $("#empsal").val();
    let hra = $("#hra").val();
    let da = $("#da").val();

    if (!empid || !empName || !empsal || !hra || !da) {
        alert("All fields are required");
        return "";
    }

    return JSON.stringify({ id: empid, empName, empsal, hra, da });
}

function getEmp() {
    let empidJsonObj = getEmpIdAsJsonObj();
    let getRequest = createGET_BY_KEYRequest(TOKEN, DB_NAME, REL_NAME, empidJsonObj);
    jQuery.ajaxSetup({ async: false });
    let resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empName").focus();
    } else if (resJsonObj.status === 200) {
        $("#empid").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empName").focus();
    }
}

function saveData() {
    let jsonStr = validateData();
    if (jsonStr === "") return;

    let putRequest = createPUTRequest(TOKEN, jsonStr, DB_NAME, REL_NAME);
    jQuery.ajaxSetup({ async: false });
    let resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    resetForm();
    $("#empid").focus();
}

function changeData() {
    let jsonChg = validateData();
    if (jsonChg === "") return;

    let updateRequest = createUPDATERecordRequest(
        TOKEN,
        jsonChg,
        DB_NAME,
        REL_NAME,
        localStorage.getItem("recno")
    );

    jQuery.ajaxSetup({ async: false });
    let resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    resetForm();
    $("#empid").focus();
}
