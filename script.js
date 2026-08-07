// Reemplaza esta URL por la del despliegue Web App de Google Apps Script.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxSsJowZXX_udmq-zAsvXBBYHffMRttvqmZ7RYiYjz-EnNWFhNJ7jjild41a8UAz0og/exec";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PHONE_REGEX = /^\+?\d{7,15}$/;

const form = document.getElementById("registrationForm");
const statusMessage = document.getElementById("statusMessage");
const previewWrapper = document.getElementById("previewWrapper");
const previewImage = document.getElementById("previewImage");
const receiptInput = document.getElementById("receipt");
const submitButton = document.getElementById("submitButton");
const submitLabel = submitButton.querySelector(".button__label");
const submitLoader = submitButton.querySelector(".button__loader");
const playersTableBody = document.getElementById("playersTableBody");
const emptyState = document.getElementById("emptyState");
const totalCount = document.getElementById("totalCount");
const searchNickname = document.getElementById("searchNickname");
const searchCfn = document.getElementById("searchCfn");

let allPlayers = [];

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  loadPlayers();
});

function bindEvents() {
  form.addEventListener("submit", handleSubmit);
  receiptInput.addEventListener("change", handleReceiptPreview);
  searchNickname.addEventListener("input", renderFilteredPlayers);
  searchCfn.addEventListener("input", renderFilteredPlayers);

  Array.from(form.elements).forEach((element) => {
    if (element.tagName === "INPUT" && element.type !== "file") {
      element.addEventListener("blur", () => validateField(element));
      element.addEventListener("input", () => clearFieldError(element));
    }
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  hideMessage();

  const isFormValid = validateForm();
  if (!isFormValid) {
    showMessage("Corrige los campos marcados antes de continuar.", "error");
    return;
  }

  if (APPS_SCRIPT_URL.includes("PASTE_YOUR")) {
    showMessage("Configura la URL del Web App de Google Apps Script antes de publicar.", "error");
    return;
  }

  const file = receiptInput.files[0];

  try {
    setLoading(true);

    const payload = {
      action: "register",
      fullName: sanitizeText(form.fullName.value),
      nickname: sanitizeText(form.nickname.value),
      cfn: sanitizeText(form.cfn.value).toUpperCase(),
      phone: sanitizePhone(form.phone.value),
      team: sanitizeText(form.team.value),
      receipt: await fileToBase64(file),
      receiptName: sanitizeFilename(file.name),
      receiptType: file.type
    };

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "No fue posible registrar la inscripción.");
    }

    form.reset();
    previewWrapper.classList.add("hidden");
    resetValidationState();
    showMessage("¡Inscripción registrada correctamente!", "success");
    await loadPlayers(true);
  } catch (error) {
    showMessage(error.message || "Ocurrió un error al enviar la información.", "error");
  } finally {
    setLoading(false);
  }
}

function validateForm() {
  const fields = [
    form.fullName,
    form.nickname,
    form.cfn,
    form.phone
  ];

  let valid = true;
  fields.forEach((field) => {
    if (!validateField(field)) {
      valid = false;
    }
  });

  if (!validateReceipt()) {
    valid = false;
  }

  return valid;
}

function validateField(field) {
  const value = field.value.trim();

  if (field.hasAttribute("required") && !value) {
    setFieldError(field, "Este campo es obligatorio.");
    return false;
  }

  if (field.id === "phone" && value && !PHONE_REGEX.test(sanitizePhone(value))) {
    setFieldError(field, "Ingresa un número válido de 7 a 15 dígitos.");
    return false;
  }

  clearFieldError(field);
  field.classList.add("is-valid");
  return true;
}

function validateReceipt() {
  const file = receiptInput.files[0];

  if (!file) {
    setFieldError(receiptInput, "Debes adjuntar el comprobante de pago.");
    return false;
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    setFieldError(receiptInput, "El archivo debe ser JPG, JPEG, PNG o WEBP.");
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    setFieldError(receiptInput, "El archivo supera el tamaño máximo permitido de 5 MB.");
    return false;
  }

  clearFieldError(receiptInput);
  receiptInput.classList.add("is-valid");
  return true;
}

function handleReceiptPreview() {
  if (!validateReceipt()) {
    previewWrapper.classList.add("hidden");
    return;
  }

  const [file] = receiptInput.files;
  const reader = new FileReader();

  reader.onload = () => {
    previewImage.src = reader.result;
    previewWrapper.classList.remove("hidden");
  };

  reader.readAsDataURL(file);
}

async function loadPlayers(scrollToList = false) {
  if (APPS_SCRIPT_URL.includes("PASTE_YOUR")) {
    renderPlayers([]);
    return;
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({ action: "list" })
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "No se pudo cargar la lista pública.");
    }

    allPlayers = Array.isArray(result.data) ? result.data : [];
    renderFilteredPlayers();

    if (scrollToList) {
      document.getElementById("list-title").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (error) {
    showMessage("La inscripción se guardó, pero no fue posible refrescar la lista pública.", "error");
  }
}

function renderFilteredPlayers() {
  const nicknameTerm = sanitizeText(searchNickname.value).toLowerCase();
  const cfnTerm = sanitizeText(searchCfn.value).toLowerCase();

  const filtered = allPlayers.filter((player) => {
    const nickname = String(player.nickname || "").toLowerCase();
    const cfn = String(player.cfn || "").toLowerCase();

    const byNick = nickname.includes(nicknameTerm);
    const byCfn = cfn.includes(cfnTerm);

    return byNick && byCfn;
  });

  renderPlayers(filtered);
}

function renderPlayers(players) {
  playersTableBody.innerHTML = "";
  totalCount.textContent = String(allPlayers.length);

  if (!players.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  players.forEach((player) => {
    const row = document.createElement("tr");
    const badgeClass = player.status === "Verificado" ? "status-badge--verified" : "status-badge--pending";

    row.innerHTML = `
      <td>${escapeHtml(player.nickname)}</td>
      <td>${escapeHtml(player.cfn)}</td>
      <td>${escapeHtml(player.team || "-")}</td>
      <td><span class="status-badge ${badgeClass}">${escapeHtml(player.status)}</span></td>
    `;

    playersTableBody.appendChild(row);
  });
}

function setFieldError(field, message) {
  field.classList.add("is-invalid");
  field.classList.remove("is-valid");
  const errorNode = field.parentElement.querySelector(".field__error");
  if (errorNode) {
    errorNode.textContent = message;
  }
}

function clearFieldError(field) {
  field.classList.remove("is-invalid");
  const errorNode = field.parentElement.querySelector(".field__error");
  if (errorNode) {
    errorNode.textContent = "";
  }
}

function resetValidationState() {
  Array.from(form.querySelectorAll("input")).forEach((input) => {
    input.classList.remove("is-invalid", "is-valid");
    const errorNode = input.parentElement.querySelector(".field__error");
    if (errorNode) {
      errorNode.textContent = "";
    }
  });
}

function showMessage(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `alert alert--${type}`;
}

function hideMessage() {
  statusMessage.textContent = "";
  statusMessage.className = "alert hidden";
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitLoader.classList.toggle("hidden", !isLoading);
  submitLabel.textContent = isLoading ? "Procesando..." : "Registrar inscripción";
}

function sanitizeText(value) {
  return value.replace(/[<>]/g, "").trim();
}

function sanitizePhone(value) {
  return value.replace(/[^\d+]/g, "").trim();
}

function sanitizeFilename(value) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      // El backend espera solo el contenido base64, sin el prefijo data URL.
      const base64 = String(reader.result).split(",")[1];
      resolve(base64);
    };

    reader.onerror = () => reject(new Error("No se pudo procesar la imagen seleccionada."));
    reader.readAsDataURL(file);
  });
}
