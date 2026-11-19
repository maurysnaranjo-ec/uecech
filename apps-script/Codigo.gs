/**
 * Portal U.E. “Cap. Edmundo Chiriboga.” — validación de usuarios con Google Sheets.
 * Pega este código en Extensiones → Apps Script de la hoja de cálculo.
 *
 * Hoja "Usuarios" (columnas):
 *   A usuario | B clave_nueva | C hash | D rol | E nombre | F activo
 * - Escribe la contraseña en la columna B y usa el menú  Portal → Procesar claves nuevas.
 *   El script la convierte en hash (columna C) y borra la clave en texto de la columna B.
 * - rol: docente | estudiante | administracion   (administracion entra a los tres perfiles)
 * - activo: SI | NO
 */
const HOJA = "Usuarios";
const MAX_INTENTOS = 5;      // intentos fallidos permitidos por usuario
const BLOQUEO_SEG = 300;     // tiempo de bloqueo en segundos (5 minutos)
const ROLES = ["docente", "estudiante", "administracion"];

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Portal")
    .addItem("1. Instalar / reparar hoja", "instalar")
    .addItem("2. Procesar claves nuevas", "procesarClaves")
    .addItem("Agregar usuario", "agregarUsuario")
    .addToUi();
}

/* ---------- Utilidades ---------- */
function sal_() {
  const p = PropertiesService.getScriptProperties();
  let s = p.getProperty("SAL");
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); p.setProperty("SAL", s); }
  return s;
}

function hash_(clave) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, sal_() + "|" + clave, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ("0" + (b & 0xff).toString(16)).slice(-2); }).join("");
}

function hoja_() {
  const h = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA);
  if (!h) throw new Error('No existe la hoja "' + HOJA + '". Usa el menú Portal → Instalar / reparar hoja.');
  return h;
}

/* ---------- Instalación ---------- */
function instalar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let h = ss.getSheetByName(HOJA);
  const nueva = !h;
  if (!h) h = ss.insertSheet(HOJA);

  h.getRange(1, 1, 1, 6).setValues([["usuario", "clave_nueva", "hash", "rol", "nombre", "activo"]])
    .setFontWeight("bold").setBackground("#D62612").setFontColor("#FFFFFF");
  h.setFrozenRows(1);
  h.setColumnWidths(1, 6, 150);
  h.getRange("C:C").setFontColor("#888888");
  h.getRange("D2:D").setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(ROLES, true).build());
  h.getRange("F2:F").setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(["SI", "NO"], true).build());
  sal_();

  if (nueva) {
    h.getRange(2, 1, 3, 6).setValues([
      ["docente",    "Docente2026",    "", "docente",        "Docente",        "SI"],
      ["estudiante", "Estudiante2026", "", "estudiante",     "Estudiante",     "SI"],
      ["admin",      "Admin2026",      "", "administracion", "Administración", "SI"]
    ]);
    procesarClaves();
  }
  SpreadsheetApp.getUi().alert("Hoja lista. Cambia las contraseñas de prueba: escribe la nueva en la columna B y usa Portal → Procesar claves nuevas.");
}

/* ---------- Gestión de usuarios ---------- */
function procesarClaves() {
  const h = hoja_();
  const ultima = h.getLastRow();
  if (ultima < 2) return;
  const rango = h.getRange(2, 1, ultima - 1, 6);
  const datos = rango.getValues();
  let n = 0;
  datos.forEach(function (f) {
    const clave = String(f[1]);
    if (clave !== "") {
      f[2] = hash_(clave);
      f[1] = "";
      if (!f[5]) f[5] = "SI";
      n++;
    }
  });
  rango.setValues(datos);
  SpreadsheetApp.getActiveSpreadsheet().toast(n + " clave(s) procesada(s).", "Portal", 5);
}

function agregarUsuario() {
  const ui = SpreadsheetApp.getUi();
  const pedir = function (t) { const r = ui.prompt(t); return r.getSelectedButton() === ui.Button.OK ? r.getResponseText().trim() : null; };
  const usuario = pedir("Usuario (sin espacios):"); if (!usuario) return;
  const clave = pedir("Contraseña:"); if (!clave) return;
  const rol = (pedir("Rol (docente, estudiante o administracion):") || "").toLowerCase();
  if (ROLES.indexOf(rol) < 0) { ui.alert("Rol no válido."); return; }
  const nombre = pedir("Nombre a mostrar:") || usuario;
  const h = hoja_();
  const existe = h.getRange(2, 1, Math.max(h.getLastRow() - 1, 1), 1).getValues().some(function (f) { return String(f[0]).toLowerCase() === usuario.toLowerCase(); });
  if (existe) { ui.alert("Ese usuario ya existe."); return; }
  h.appendRow([usuario.toLowerCase(), "", hash_(clave), rol, nombre, "SI"]);
}

/* ---------- Servicio web ---------- */
function responder_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return responder_({ ok: true, servicio: "Portal U.E. Chiriboga" });
}

function doPost(e) {
  let datos;
  try { datos = JSON.parse(e.postData.contents); } catch (err) { return responder_({ ok: false, mensaje: "Solicitud no válida." }); }
  const usuario = String(datos.usuario || "").trim().toLowerCase();
  const clave = String(datos.clave || "");
  if (!usuario || !clave) return responder_({ ok: false, mensaje: "Escribe usuario y contraseña." });

  const cache = CacheService.getScriptCache();
  const llave = "fallos_" + usuario;
  const fallos = Number(cache.get(llave) || 0);
  if (fallos >= MAX_INTENTOS) {
    return responder_({ ok: false, mensaje: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." });
  }

  const h = hoja_();
  const ultima = h.getLastRow();
  if (ultima >= 2) {
    const filas = h.getRange(2, 1, ultima - 1, 6).getValues();
    const hashIngresado = hash_(clave);
    for (let i = 0; i < filas.length; i++) {
      const f = filas[i];
      if (String(f[0]).trim().toLowerCase() !== usuario) continue;
      if (String(f[5]).toUpperCase() === "NO") break;
      if (f[2] && String(f[2]) === hashIngresado && ROLES.indexOf(String(f[3])) >= 0) {
        cache.remove(llave);
        return responder_({ ok: true, usuario: usuario, rol: String(f[3]), nombre: String(f[4] || usuario) });
      }
      break;
    }
  }
  cache.put(llave, String(fallos + 1), BLOQUEO_SEG);
  return responder_({ ok: false, mensaje: "Usuario o contraseña incorrectos." });
}
