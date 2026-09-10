var SHEET_NAME = "Comments";

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Page", "Name", "Text"]);
  }
  return sheet;
}

function doGet(e) {
  var page = (e.parameter && e.parameter.page) || "";
  var sheet = getSheet_();
  var rows = sheet.getDataRange().getValues();
  var comments = [];
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var rowPage = String(row[1] || "");
    if (!page || rowPage === page) {
      comments.push({
        timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
        page: rowPage, name: row[2] || "Anonymous", text: row[3] || ""
      });
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ comments: comments })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = {};
  try { data = JSON.parse(e.postData.contents); }
  catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "Invalid request body" })).setMimeType(ContentService.MimeType.JSON);
  }
  var page = String(data.page || "").slice(0, 200);
  var name = String(data.name || "Anonymous").slice(0, 100);
  var text = String(data.text || "").slice(0, 2000);
  if (!text) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "Comment text is required" })).setMimeType(ContentService.MimeType.JSON);
  }
  getSheet_().appendRow([new Date(), page, name, text]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
