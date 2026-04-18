/* ================================================
   Transporte Ecologico Compas - Main Script
   ================================================ */
(function () {
  "use strict";

  /* ---------- DOM refs ---------- */
  var tabBar = document.getElementById("tabBar");
  var contentArea = document.getElementById("contentArea");
  var btnPdfCompleto = document.getElementById("btnPdfCompleto");

  /* ---------- State ---------- */
  var loadedSections = {};
  var PDF_A4_WIDTH = "210mm";
  var PDF_STAGING_LEFT = "-9999px";

  /* ---------- Section meta ---------- */
  var sectionFiles = {
    "01": "sections/01-introduccion.html",
    "02": "sections/02-marco-conceptual.html",
    "03": "sections/03-descripcion-proyecto.html",
    "04": "sections/04-estudio-mercado.html",
    "05": "sections/05-analisis-entorno.html",
    "06": "sections/06-analisis-estrategico.html",
    "07": "sections/07-organizacion-empresarial.html",
    "08": "sections/08-plan-operativo.html",
    "09": "sections/09-flota-logistica.html",
    "10": "sections/10-experiencia-usuario.html",
    "11": "sections/11-carta-servicios.html",
    "12": "sections/12-gestion-calidad.html",
    "13": "sections/13-plan-sostenibilidad.html",
    "14": "sections/14-plan-marketing.html",
    "15": "sections/15-plan-economico.html",
    "16": "sections/16-indicadores-kpi.html",
    "17": "sections/17-riesgos-contingencia.html",
    "18": "sections/18-libro-sostenibilidad.html",
    "19": "sections/19-conclusiones.html",
    "20": "sections/20-anexos.html"
  };

  var sectionTitles = {
    "01": "1. Introduccion",
    "02": "2. Marco conceptual y contextual",
    "03": "3. Descripcion del proyecto",
    "04": "4. Estudio de mercado",
    "05": "5. Analisis del entorno",
    "06": "6. Analisis estrategico",
    "07": "7. Organizacion empresarial",
    "08": "8. Plan operativo del servicio",
    "09": "9. Flota y logistica",
    "10": "10. Experiencia del usuario",
    "11": "11. Carta de servicios",
    "12": "12. Gestion de calidad y satisfaccion",
    "13": "13. Plan de sostenibilidad",
    "14": "14. Plan de marketing y comunicacion",
    "15": "15. Plan economico-financiero",
    "16": "16. Indicadores de rendimiento (KPI)",
    "17": "17. Riesgos y planes de contingencia",
    "18": "18. Libro de sostenibilidad",
    "19": "19. Conclusiones",
    "20": "20. Anexos"
  };

  /* ---------- Helpers ---------- */

  /** Load section HTML into its .section-body container */
  function loadSection(key, callback) {
    if (loadedSections[key]) {
      if (callback) callback();
      return;
    }
    var panel = document.getElementById("panel-" + key);
    if (!panel) return;
    var body = panel.querySelector(".section-body");
    if (!body) return;
    var src = body.getAttribute("data-src");
    if (!src) return;

    body.innerHTML = '<p class="loading-msg">Cargando contenido...</p>';

    fetch(src)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (html) {
        body.innerHTML = html;
        loadedSections[key] = true;
        if (callback) callback();
      })
      .catch(function () {
        body.innerHTML = '<p class="loading-msg">No se pudo cargar el contenido de esta seccion.</p>';
        if (callback) callback();
      });
  }

  /* ---------- Tab switching ---------- */

  function activateTab(tabKey) {
    /* Update buttons */
    var btns = tabBar.querySelectorAll(".tab-btn");
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i];
      var isActive = btn.getAttribute("data-tab") === tabKey;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
      if (isActive) {
        btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }

    /* Update panels */
    var panels = contentArea.querySelectorAll(".tab-panel");
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.remove("active");
    }
    var target = document.getElementById("panel-" + tabKey);
    if (target) {
      target.classList.add("active");
    }

    /* Lazy-load section content */
    if (tabKey !== "indice" && sectionFiles[tabKey]) {
      loadSection(tabKey);
    }

    /* Scroll to top of content */
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- Tab click handler ---------- */
  tabBar.addEventListener("click", function (e) {
    var btn = e.target.closest(".tab-btn");
    if (!btn) return;
    var tabKey = btn.getAttribute("data-tab");
    if (!tabKey) return;
    history.pushState(null, "", "#" + tabKey);
    activateTab(tabKey);
  });

  /* ---------- Indice card click ---------- */
  contentArea.addEventListener("click", function (e) {
    var card = e.target.closest(".indice-card");
    if (!card) return;
    e.preventDefault();
    var gotoKey = card.getAttribute("data-goto");
    if (!gotoKey) return;
    history.pushState(null, "", "#" + gotoKey);
    activateTab(gotoKey);
  });

  /* ---------- Hash navigation ---------- */
  function handleHash() {
    var hash = location.hash.replace("#", "");
    if (hash && (hash === "indice" || sectionFiles[hash])) {
      activateTab(hash);
    } else {
      activateTab("indice");
    }
  }

  window.addEventListener("hashchange", handleHash);
  window.addEventListener("popstate", handleHash);

  /* ---------- PDF generation ---------- */

  function generatePdf(element, filename) {
    if (typeof html2pdf === "undefined") {
      alert("La libreria de PDF no se ha cargado. Intente de nuevo en unos segundos.");
      return Promise.reject(new Error("html2pdf not loaded"));
    }

    var opt = {
      margin: [12, 12, 12, 12],
      filename: filename,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] }
    };

    return html2pdf().set(opt).from(element).save();
  }

  function createBackToIndiceLink() {
    var backLink = document.createElement("a");
    backLink.href = "#indice";
    backLink.textContent = "Volver al Índice";
    backLink.setAttribute("aria-label", "Volver al Índice");
    backLink.style.position = "absolute";
    backLink.style.top = "8px";
    backLink.style.right = "8px";
    backLink.style.fontSize = "11px";
    backLink.style.fontWeight = "600";
    backLink.style.color = "#1b2d6b";
    backLink.style.background = "rgba(255,255,255,0.9)";
    backLink.style.padding = "2px 8px";
    backLink.style.borderRadius = "999px";
    backLink.style.textDecoration = "none";
    backLink.style.zIndex = "1";
    return backLink;
  }

  function waitForRenderReadiness(root) {
    var tasks = [];

    if (document.fonts && document.fonts.ready) {
      tasks.push(
        document.fonts.ready.catch(function (err) {
          console.warn("PDF fonts readiness warning:", err);
        })
      );
    }

    var images = root.querySelectorAll("img");
    for (var i = 0; i < images.length; i++) {
      (function (img) {
        tasks.push(
          new Promise(function (resolve) {
            function done() {
              if (typeof img.decode === "function") {
                img.decode().catch(function (err) {
                  console.warn("PDF image decode warning:", err);
                }).then(resolve);
              } else {
                resolve();
              }
            }

            if (img.complete) {
              done();
            } else {
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", resolve, { once: true });
            }
          })
        );
      })(images[i]);
    }

    return Promise.all(tasks);
  }

  /* Section PDF buttons */
  contentArea.addEventListener("click", function (e) {
    var btn = e.target.closest(".btn-pdf-section");
    if (!btn) return;
    var sectionKey = btn.getAttribute("data-section");
    if (!sectionKey) return;

    btn.disabled = true;
    btn.textContent = "Generando PDF...";

    loadSection(sectionKey, function () {
      var panel = document.getElementById("panel-" + sectionKey);
      if (!panel) {
        btn.disabled = false;
        btn.textContent = "Descargar PDF";
        return;
      }
      var title = sectionTitles[sectionKey] || "Seccion " + sectionKey;
      var filename = "TEC_" + sectionKey + "_" + title.replace(/[^a-zA-Z0-9]/g, "_") + ".pdf";
      generatePdf(panel, filename)
        .then(function () {
          btn.disabled = false;
          btn.textContent = "Descargar PDF";
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = "Descargar PDF";
        });
    });
  });

  /* Full project PDF */
  if (btnPdfCompleto) {
    btnPdfCompleto.addEventListener("click", function () {
      btnPdfCompleto.disabled = true;
      btnPdfCompleto.textContent = "Preparando PDF completo...";

      var keys = Object.keys(sectionFiles);
      var pending = keys.length;

      function onAllLoaded() {
        /* Build a combined element */
        var wrapper = document.createElement("div");
        wrapper.style.width = PDF_A4_WIDTH;
        wrapper.style.maxWidth = PDF_A4_WIDTH;
        wrapper.style.background = "#ffffff";
        wrapper.style.fontFamily = "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif";
        wrapper.style.color = "#2c3040";
        wrapper.style.lineHeight = "1.65";
        wrapper.style.position = "relative";

        /* Cover */
        var cover = document.createElement("div");
        cover.style.textAlign = "center";
        cover.style.position = "relative";
        cover.style.padding = "60px 20px";
        cover.innerHTML =
          '<h1 style="color:#1b2d6b;font-size:28px;margin-bottom:12px;">Transporte Ecologico Compas</h1>' +
          '<p style="font-size:16px;color:#5a6170;">Proyecto de transporte sostenible para el Carnaval de Santa Cruz de Tenerife</p>' +
          '<p style="font-size:14px;color:#5a6170;margin-top:8px;">Transporte Ecologico Compas S.A. | C. Pi y Margall, 23, Santa Cruz de Tenerife</p>';
        cover.appendChild(createBackToIndiceLink());
        wrapper.appendChild(cover);

        /* Each section */
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var panel = document.getElementById("panel-" + key);
          if (!panel) continue;
          var sectionClone = panel.cloneNode(true);
          sectionClone.style.display = "block";
          sectionClone.style.pageBreakBefore = "always";
          sectionClone.style.paddingTop = "16px";
          sectionClone.style.position = "relative";
          /* Remove PDF buttons from clone */
          var btns = sectionClone.querySelectorAll(".btn-pdf");
          for (var b = 0; b < btns.length; b++) {
            btns[b].parentNode.removeChild(btns[b]);
          }
          sectionClone.appendChild(createBackToIndiceLink());
          wrapper.appendChild(sectionClone);
        }

        var staging = document.createElement("div");
        staging.id = "pdf-staging";
        staging.style.position = "fixed";
        staging.style.left = PDF_STAGING_LEFT;
        staging.style.top = "0";
        staging.style.width = PDF_A4_WIDTH;
        staging.style.background = "#ffffff";
        staging.style.visibility = "hidden";
        staging.style.pointerEvents = "none";

        staging.appendChild(wrapper);
        document.body.appendChild(staging);

        waitForRenderReadiness(wrapper)
          .then(function () {
            return generatePdf(wrapper, "Transporte_Ecologico_Compas_Proyecto_Completo.pdf");
          })
          .catch(function (err) {
            console.error("Error al generar PDF completo:", err);
            alert("No se pudo generar el PDF completo. Intente de nuevo.");
          })
          .finally(function () {
            if (staging.parentNode) {
              staging.parentNode.removeChild(staging);
            }
            btnPdfCompleto.disabled = false;
            btnPdfCompleto.textContent = "Descargar proyecto completo en PDF";
          });
      }

      keys.forEach(function (key) {
        loadSection(key, function () {
          pending--;
          if (pending <= 0) {
            onAllLoaded();
          }
        });
      });
    });
  }

  /* ---------- Init ---------- */
  handleHash();
})();
