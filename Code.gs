// Configura estos IDs antes de desplegar el proyecto.
const SHEET_ID = '1zv9nMeUSmQaYKiT76eJulDbxvAdIUhju2lnLnpg4b-c';
const SHEET_NAME = 'Inscripciones';
const DRIVE_FOLDER_ID = '1tx37tlONYKqJ8Q-esmSk3nhbkUwjtQ_f';
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function doGet(e) {
  const action = (e.parameter.action || '').toLowerCase();

  if (action === 'list') {
    return jsonOutput({
      success: true,
      data: getPublicPlayers_()
    });
  }

  return jsonOutput({
    success: true,
    message: 'Apps Script activo.'
  });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const action = (payload.action || '').toLowerCase();

    if (action === 'list') {
      return jsonOutput({
        success: true,
        data: getPublicPlayers_()
      });
    }

    if (action !== 'register') {
      return jsonOutput({
        success: false,
        message: 'Acción no válida.'
      });
    }

    validateConfiguration_();
    const clean = validatePayload_(payload);
    const sheet = getSheet_();

    if (isDuplicateCfn_(sheet, clean.cfn)) {
      return jsonOutput({
        success: false,
        message: 'Ya existe una inscripción registrada con este CFN.'
      });
    }

    if (isDuplicateNick_(sheet, clean.nickname)) {
      return jsonOutput({
        success: false,
        message: 'El Nick ya se encuentra registrado.'
      });
    }

    const fileUrl = saveReceipt_(clean);

    sheet.appendRow([
      new Date(),
      clean.fullName,
      clean.nickname,
      clean.cfn,
      clean.phone,
      clean.team,
      fileUrl,
      'Pendiente'
    ]);

    return jsonOutput({
      success: true,
      message: 'Inscripción registrada correctamente.'
    });
  } catch (error) {
    return jsonOutput({
      success: false,
      message: error.message || 'Error inesperado al procesar la solicitud.'
    });
  }
}

function validatePayload_(payload) {
  const fullName = sanitizeText_(payload.fullName);
  const nickname = sanitizeText_(payload.nickname);
  const cfn = sanitizeText_(payload.cfn).toUpperCase();
  const phone = sanitizePhone_(payload.phone);
  const team = sanitizeText_(payload.team);
  const receipt = String(payload.receipt || '');
  const receiptName = sanitizeFilename_(payload.receiptName || 'comprobante');
  const receiptType = String(payload.receiptType || '');

  if (!fullName || !nickname || !cfn || !phone || !receipt || !receiptType) {
    throw new Error('Faltan campos obligatorios en la solicitud.');
  }

  if (!/^\+?\d{7,15}$/.test(phone)) {
    throw new Error('El número celular no tiene un formato válido.');
  }

  if (ALLOWED_MIME_TYPES.indexOf(receiptType) === -1) {
    throw new Error('El archivo adjunto no tiene un formato permitido.');
  }

  const bytes = Utilities.base64Decode(receipt);
  if (bytes.length > MAX_FILE_SIZE_BYTES) {
    throw new Error('El archivo adjunto supera el tamaño máximo de 5 MB.');
  }

  return {
    fullName: fullName,
    nickname: nickname,
    cfn: cfn,
    phone: phone,
    team: team,
    receipt: receipt,
    receiptName: receiptName,
    receiptType: receiptType
  };
}

function saveReceipt_(data) {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const bytes = Utilities.base64Decode(data.receipt);
  const extension = getExtensionFromMime_(data.receiptType);
  const fileName = [
    data.cfn,
    data.nickname.replace(/\s+/g, '_'),
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss')
  ].join('_') + '.' + extension;

  const blob = Utilities.newBlob(bytes, data.receiptType, fileName);
  const file = folder.createFile(blob);

  return file.getUrl();
}

function getPublicPlayers_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, 8).getValues();

  return values
    .filter(function(row) {
      return row[2] && row[3];
    })
    .sort(function(a, b) {
      // La lista pública se muestra con las inscripciones más recientes primero.
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    })
    .map(function(row) {
      return {
        nickname: row[2],
        cfn: row[3],
        team: row[5] || '',
        status: row[7] || 'Pendiente'
      };
    });
}

function isDuplicateCfn_(sheet, cfn) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return false;
  }

  const values = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
  return values.some(function(row) {
    return String(row[0]).trim().toUpperCase() === cfn;
  });
}

function isDuplicateNick_(sheet, nickname) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return false;
  }

  const values = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
  return values.some(function(row) {
    return String(row[0]).trim().toLowerCase() === nickname.toLowerCase();
  });
}

function getSheet_() {
  validateConfiguration_();
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  // Si solo existe una pestaña, la usamos aunque el nombre no coincida exactamente.
  if (!sheet) {
    const sheets = spreadsheet.getSheets();
    if (sheets.length === 1) {
      sheet = sheets[0];
    }
  }

  if (!sheet) {
    const availableNames = spreadsheet.getSheets().map(function(item) {
      return item.getName();
    }).join(', ');
    throw new Error('No se encontró la hoja configurada. Pestañas disponibles: ' + availableNames);
  }

  return sheet;
}

function validateConfiguration_() {
  if (SHEET_ID.indexOf('PASTE_YOUR') !== -1 || DRIVE_FOLDER_ID.indexOf('PASTE_YOUR') !== -1) {
    throw new Error('Configura los IDs de Google Sheets y Google Drive antes de usar el sistema.');
  }
}

function sanitizeText_(value) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .trim();
}

function sanitizePhone_(value) {
  return String(value || '')
    .replace(/[^\d+]/g, '')
    .trim();
}

function sanitizeFilename_(value) {
  return String(value || 'archivo')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .trim();
}

function getExtensionFromMime_(mimeType) {
  switch (mimeType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
}

function jsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
