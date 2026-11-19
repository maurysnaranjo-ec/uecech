/* Protege cada página interna. Va en el <head> de cada una:
   <script src="../guard.js" data-rol="docente" data-index="../index.html"></script>
   data-rol: docente | estudiante | administracion  (administración entra a todas) */
(function () {
  var t = document.currentScript, rol = t.dataset.rol, destino = t.dataset.index || "../index.html", s = null;
  document.documentElement.style.visibility = "hidden";
  try { s = JSON.parse(sessionStorage.getItem("ue_sesion") || "null"); } catch (e) {}
  if (!s || (rol && s.rol !== rol && s.rol !== "administracion")) { location.replace(destino); return; }
  document.documentElement.style.visibility = "visible";
})();
