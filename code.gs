/**//* ======================================================== *//**/
/**/                                                              /**/
/**/   // Make changes only to this segment                       /**/
/**/                                                              /**/
/**/   var ID = "ID SHEET";   /**/
/**/   var lock;                                          /**/
/**/                                                              /**/
/**//* ======================================================== *//**/
function sendPasscode(email) {
  lock = generatePasscode(); // Hàm để tạo passcode ngẫu nhiên
  const subject = 'Passcode Login - Dashboard';
  const body = `Passcode của bạn là: ${lock}. Vui lòng không chia sẻ Passcode này.`;
  try {
    // Gửi email
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
      name: 'PASSCODE LOGIN'
    });
    // Lưu passcode vào ô Lock trên bảng tính
    setLockValue(lock);

    return { success: true}; // Trả về cả giá trị của lock để lưu tạm
  } catch (error) {
    console.error(error);
    return { success: false}; // Trả về null nếu có lỗi
  }
}

function generatePasscode() {
  // Hàm để tạo passcode ngẫu nhiên (ví dụ)
  const characters = '0123456789';
  let passcode = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    passcode += characters.charAt(randomIndex);
  }
  return passcode;
}
/* ==================== DO NOT CHANGE ANYTHING BELOW THIS LINE  ======================== */

var conf = 'config'
var ss = SpreadsheetApp.openById(ID)

function doGet(e) {
  if (Object.keys(e.parameter).length === 0) {
    var htmlFile
    var sheetName = conf
    var activeSheet = ss.getSheetByName(sheetName)
    if (activeSheet !== null) {
      var values = activeSheet.getDataRange().getValues();
      for(var i=0, iLen=values.length; i<iLen; i++) {
        if(values[i][0] == 'Passcode') {
          var passCheck = activeSheet.getRange(i+1, 2).getValues()
          if(passCheck == getLockValue()) {
            htmlFile = 'Dashboard'
            activeSheet.getRange(i+1, 2).clearContent()
          } else {
            htmlFile = 'Login'
          }
        }
      }
    } else {
      config();
      htmlFile = 'Login'
    }
    return HtmlService.createHtmlOutputFromFile(htmlFile).setTitle('DASHBOARD BINHDINH');
  }
}

function removeEmptyColumns(sheetName) {
  var activeSheet = ss.getSheetByName(sheetName)
  var maxColumns = activeSheet.getMaxColumns(); 
  var lastColumn = activeSheet.getLastColumn();
  if (maxColumns-lastColumn != 0){
    activeSheet.deleteColumns(lastColumn+1, maxColumns-lastColumn);
  }
}

function validateUser(passcode) {
  if (passcode == getLockValue()) {
    var successMessage = 'Logging you in!';
    config(passcode)
    return successMessage
  } else {
    var errorMessage = 'Incorrect passcode :(';
    return errorMessage
  }
}

function config(passcode) {
  var sheetName = conf
  var activeSheet = ss.getSheetByName(sheetName)
  if (activeSheet == null) {
    activeSheet = ss.insertSheet().setName(sheetName);
    activeSheet.appendRow (["Config"])
    activeSheet.appendRow (["Lock"])
    activeSheet.appendRow (["Passcode"])
    removeEmptyColumns(sheetName);
    activeSheet.setFrozenRows(1)
    if (passcode !== undefined) {
      var values = activeSheet.getDataRange().getValues();
      var sheetRow;
      for(var i=0, iLen=values.length; i<iLen; i++) {
        if(values[i][0] == 'Passcode') {
          sheetRow = i+1
          activeSheet.getRange(sheetRow, 2).setValue(passcode)
        }
      }
    }
  } else {
    var values = activeSheet.getDataRange().getValues();
    var sheetRow;
    for(var i=0, iLen=values.length; i<iLen; i++) {
      if(values[i][0] == 'Passcode') {
        sheetRow = i+1
        activeSheet.getRange(sheetRow, 2).setValue(passcode)
      }
    }
  }
}
function getPasscodeFromSheet() {
  var sheetName = conf;
  var activeSheet = ss.getSheetByName(sheetName);

  if (activeSheet !== null) {
    var values = activeSheet.getDataRange().getValues();
    for (var i = 0, iLen = values.length; i < iLen; i++) {
      if (values[i][0] == 'Passcode') {
        return activeSheet.getRange(i + 1, 2).getValues();
      }
    }
  }

  return null;
}
function webAppURL(linkAddr) {
  var linkAddr = ScriptApp.getService().getUrl()
  return linkAddr
}
//
// Hàm để lưu giá trị vào ô Lock trên bảng tính
function setLockValue(lock) {
  var sheetName = conf;
  var activeSheet = ss.getSheetByName(sheetName);

  if (activeSheet !== null) {
    var values = activeSheet.getDataRange().getValues();
    for (var i = 0, iLen = values.length; i < iLen; i++) {
      if (values[i][0] == 'Lock') {
        activeSheet.getRange(i + 1, 2).setValue(lock);
        break;
      }
    }
  }
}
// Hàm để lấy giá trị của ô Lock từ bảng tính
function getLockValue() {
  var sheetName = conf;
  var activeSheet = ss.getSheetByName(sheetName);

  if (activeSheet !== null) {
    var values = activeSheet.getDataRange().getValues();
    for (var i = 0, iLen = values.length; i < iLen; i++) {
      if (values[i][0] == 'Lock') {
        return activeSheet.getRange(i + 1, 2).getValue();
      }
    }
  }

  return null;
}
