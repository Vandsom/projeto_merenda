function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var params = e.parameter || {};
  var matricula = '';

  if (params.matricula) {
    matricula = params.matricula.toString().trim();
  } else if (e.postData && e.postData.type === 'application/json' && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      matricula = (body.matricula || '').toString().trim();
    } catch (err) {
      // ignore parse error
    }
  }

  if (!matricula) {
    return jsonResponse({status: 'erro', mensagem: 'Parâmetro matricula ausente'});
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tz = ss.getSpreadsheetTimeZone();
  var now = new Date();
  var todayStr = Utilities.formatDate(now, tz, 'yyyy-MM-dd');

  var registrosSheet = ss.getSheetByName('Registros');
  if (!registrosSheet) {
    return jsonResponse({status: 'erro', mensagem: 'Aba Registros não encontrada'});
  }

  var registrosData = registrosSheet.getDataRange().getValues();
  for (var i = 0; i < registrosData.length; i++) {
    var row = registrosData[i];
    var mat = row[0] ? row[0].toString().trim() : '';
    var dateCell = row[1];
    var dateStr = '';

    if (dateCell instanceof Date) {
      dateStr = Utilities.formatDate(dateCell, tz, 'yyyy-MM-dd');
    } else if (dateCell) {
      var parsed = new Date(dateCell);
      if (!isNaN(parsed.getTime())) {
        dateStr = Utilities.formatDate(parsed, tz, 'yyyy-MM-dd');
      }
    }

    if (mat === matricula && dateStr === todayStr) {
      return jsonResponse({status: 'erro', mensagem: 'Refeição já realizada'});
    }
  }

  // Procurar nome do aluno na aba 'Alunos'
  var nomeAluno = '';
  var alunosSheet = ss.getSheetByName('Alunos');
  if (alunosSheet) {
    var alunosData = alunosSheet.getDataRange().getValues();
    for (var j = 0; j < alunosData.length; j++) {
      var arow = alunosData[j];
      var nome = arow[0] ? arow[0].toString() : '';
      var matA = arow[1] ? arow[1].toString().trim() : '';
      if (matA === matricula) {
        nomeAluno = nome;
        break;
      }
    }
  }

  var timeStr = Utilities.formatDate(now, tz, 'HH:mm:ss');
  // Armazenar a data como objeto Date (apenas data) e hora como string
  var dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  registrosSheet.appendRow([matricula, dateOnly, timeStr]);

  return jsonResponse({status: 'sucesso', mensagem: 'Liberado', nomeAluno: nomeAluno});
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
