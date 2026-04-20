/* ================================================
   Transporte Ecologico Compas - Main Script
   ================================================ */
(function () {
  "use strict";

  /* ---------- DOM refs ---------- */
  var tabBar = document.getElementById("tabBar");
  var contentArea = document.getElementById("contentArea");
  var exportMenuFull = document.getElementById("exportMenuFull");
  var btnExportCompleto = document.getElementById("btnExportCompleto");
  var pdfExportStatus = document.getElementById("pdfExportStatus");
  var pdfExportMessage = document.getElementById("pdfExportMessage");
  var pdfProgressWrap = document.getElementById("pdfProgressWrap");
  var pdfProgressBar = document.getElementById("pdfProgressBar");
  var pdfExportDetails = document.getElementById("pdfExportDetails");
  var btnCopyPdfDetails = document.getElementById("btnCopyPdfDetails");

  /* ---------- State ---------- */
  var loadedSections = {};
  var EXPORT_PREFIX = "[EXPORT]";

  /* ---------- Section meta ---------- */
  var sectionFiles = {
    "01": "sections/01-introduccion.html",
    "02": "sections/02-concepto-proyecto.html",
    "03": "sections/03-operativa-servicio.html",
    "04": "sections/04-calidad-servicio.html",
    "05": "sections/05-carta-servicios.html",
    "06": "sections/06-carta-negocios.html",
    "07": "sections/07-garantias-servicio.html",
    "08": "sections/08-reclamaciones-sugerencias.html",
    "09": "sections/09-encuesta-satisfaccion.html",
    "10": "sections/10-estudio-mercado.html",
    "11": "sections/11-analisis-estrategico.html",
    "12": "sections/12-normativa-cumplimiento.html",
    "13": "sections/13-organizacion-empresa.html",
    "14": "sections/14-plan-operativo-carnaval.html",
    "15": "sections/15-plan-sostenibilidad.html",
    "16": "sections/16-plan-economico-financiero.html",
    "17": "sections/17-politica-precios.html",
    "18": "sections/18-indicadores-kpi.html",
    "19": "sections/19-riesgos-contingencia.html",
    "20": "sections/20-accesibilidad-inclusion-linguistica.html",
    "21": "sections/21-libro-sostenibilidad.html",
    "22": "sections/22-conclusiones.html"
  };

  var sectionTitles = {
    "01": "1. Introducción",
    "02": "2. Concepto del Proyecto",
    "03": "3. Operativa del Servicio",
    "04": "4. Calidad del Servicio",
    "05": "5. Carta de Servicios",
    "06": "6. Carta de Negocios (versión simplificada)",
    "07": "7. Garantías del Servicio",
    "08": "8. Gestión de Reclamaciones y Sugerencias",
    "09": "9. Encuesta de Satisfacción del Cliente",
    "10": "10. Estudio de Mercado",
    "11": "11. Análisis Estratégico",
    "12": "12. Normativa y Cumplimiento Legal",
    "13": "13. Organización de la Empresa",
    "14": "14. Plan Operativo del Carnaval",
    "15": "15. Plan de Sostenibilidad",
    "16": "16. Plan Económico-Financiero",
    "17": "17. Política de Precios",
    "18": "18. Indicadores de Rendimiento (KPI)",
    "19": "19. Riesgos y Planes de Contingencia",
    "20": "20. Accesibilidad e Inclusión Lingüística",
    "21": "21. Libro de Sostenibilidad",
    "22": "22. Conclusiones"
  };

  function sortedSectionKeys() {
    return Object.keys(sectionFiles).sort(function (a, b) {
      return Number(a) - Number(b);
    });
  }

  var EXPECTED_SECTION_COUNT = 22;

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

  function loadSectionAsync(key) {
    return new Promise(function (resolve) {
      loadSection(key, resolve);
    });
  }

  function fetchSectionHtml(key) {
    var src = sectionFiles[key];
    if (!src) {
      return Promise.reject(createPdfExportError("load section", "No existe archivo para la seccion " + key, null, { section: key }));
    }

    return fetch(src)
      .then(function (res) {
        if (!res.ok) {
          throw createPdfExportError("load section", "Error HTTP " + res.status + " al cargar " + src, null, { section: key, status: res.status });
        }
        return res.text();
      })
      .catch(function (err) {
        if (err && err.pdfExportError) {
          throw err;
        }
        throw createPdfExportError("load section", "No se pudo cargar la seccion " + key, err, { section: key });
      });
  }

  function createPdfExportError(phase, message, cause, meta) {
    var detail = "phase=" + phase + " | message=" + message;
    if (meta) {
      detail += " | meta=" + JSON.stringify(meta);
    }
    if (cause && cause.message) {
      detail += " | cause=" + cause.message;
    }
    var err = new Error(message);
    err.phase = phase;
    err.details = detail;
    err.cause = cause || null;
    err.meta = meta || null;
    err.pdfExportError = true;
    return err;
  }

  function logPdfExportError(err) {
    if (!err) return;
    var detail = err.details || err.message || String(err);
    console.error(EXPORT_PREFIX, detail, err);
  }

  function setPdfStatus(message, detail, showProgress, progressPercent) {
    if (!pdfExportStatus) return;

    pdfExportStatus.hidden = false;
    if (pdfExportMessage) {
      pdfExportMessage.textContent = message || "";
    }

    if (pdfProgressWrap) {
      pdfProgressWrap.hidden = !showProgress;
    }

    if (pdfProgressBar) {
      var width = typeof progressPercent === "number" ? Math.max(0, Math.min(100, progressPercent)) : 0;
      pdfProgressBar.style.width = width + "%";
    }

    if (pdfExportDetails) {
      var hasDetail = !!detail;
      pdfExportDetails.hidden = !hasDetail;
      pdfExportDetails.value = hasDetail ? detail : "";
    }

    if (btnCopyPdfDetails) {
      btnCopyPdfDetails.hidden = !detail;
    }
  }

  function clearPdfStatus() {
    if (!pdfExportStatus) return;
    if (pdfProgressBar) {
      pdfProgressBar.style.width = "0%";
    }
    if (pdfExportDetails) {
      pdfExportDetails.value = "";
      pdfExportDetails.hidden = true;
    }
    if (btnCopyPdfDetails) {
      btnCopyPdfDetails.hidden = true;
    }
    if (pdfProgressWrap) {
      pdfProgressWrap.hidden = true;
    }
    pdfExportStatus.hidden = true;
  }

  function copyErrorDetails() {
    if (!pdfExportDetails || !pdfExportDetails.value) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pdfExportDetails.value).catch(function () {
        pdfExportDetails.select();
        document.execCommand("copy");
      });
      return;
    }
    pdfExportDetails.select();
    document.execCommand("copy");
  }

  function ensurePdfMake() {
    if (typeof pdfMake === "undefined" || typeof pdfMake.createPdf !== "function") {
      throw createPdfExportError("pdfmake createPdf", "La libreria pdfmake no se ha cargado correctamente.", null, null);
    }
  }

  function resolveLinkTarget(href) {
    if (!href) return null;

    var normalized = String(href).trim();
    if (!normalized) return null;

    if (normalized.charAt(0) === "#") {
      var anchor = normalized.slice(1).toLowerCase();
      if (anchor === "indice") {
        return { linkToDestination: "indice" };
      }
      if (/^\d{1,2}$/.test(anchor)) {
        var key = anchor.length === 1 ? "0" + anchor : anchor;
        if (sectionFiles[key]) {
          return { linkToDestination: "sec-" + key };
        }
      }
      return null;
    }

    if (/^(https?:|mailto:|tel:)/i.test(normalized)) {
      return { link: normalized };
    }

    return { link: normalized };
  }

  function parseInline(node, marks) {
    if (!node) return [];

    var currentMarks = marks || {};

    if (node.nodeType === 3) {
      var text = node.nodeValue || "";
      if (!text) return [];
      var fragment = { text: text };
      if (currentMarks.bold) fragment.bold = true;
      if (currentMarks.italics) fragment.italics = true;
      if (currentMarks.link) fragment.link = currentMarks.link;
      if (currentMarks.linkToDestination) fragment.linkToDestination = currentMarks.linkToDestination;
      if (currentMarks.decoration) fragment.decoration = currentMarks.decoration;
      if (currentMarks.color) fragment.color = currentMarks.color;
      return [fragment];
    }

    if (node.nodeType !== 1) {
      return [];
    }

    var tag = node.tagName.toUpperCase();
    if (tag === "IMG") {
      return [];
    }

    if (tag === "BR") {
      return [{ text: "\n" }];
    }

    var mergedMarks = {
      bold: currentMarks.bold,
      italics: currentMarks.italics,
      link: currentMarks.link,
      linkToDestination: currentMarks.linkToDestination,
      decoration: currentMarks.decoration,
      color: currentMarks.color
    };

    if (tag === "B" || tag === "STRONG") {
      mergedMarks.bold = true;
    }
    if (tag === "I" || tag === "EM") {
      mergedMarks.italics = true;
    }
    if (tag === "A") {
      var target = resolveLinkTarget(node.getAttribute("href"));
      if (target) {
        mergedMarks.link = target.link;
        mergedMarks.linkToDestination = target.linkToDestination;
        mergedMarks.decoration = "underline";
        mergedMarks.color = "#1b2d6b";
      }
    }

    var fragments = [];
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
      var sub = parseInline(children[i], mergedMarks);
      for (var j = 0; j < sub.length; j++) {
        fragments.push(sub[j]);
      }
    }
    return fragments;
  }

  function inlineFromChildren(node) {
    var fragments = [];
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
      var part = parseInline(children[i], {});
      for (var j = 0; j < part.length; j++) {
        fragments.push(part[j]);
      }
    }
    return fragments;
  }

  function cleanInlineFragments(fragments) {
    var cleaned = [];
    for (var i = 0; i < fragments.length; i++) {
      var item = fragments[i];
      if (!item || typeof item.text !== "string") continue;
      if (!item.text.replace(/\s+/g, "") && item.text !== "\n") {
        item = {
          text: " ",
          bold: item.bold,
          italics: item.italics,
          link: item.link,
          linkToDestination: item.linkToDestination,
          decoration: item.decoration,
          color: item.color
        };
      }
      cleaned.push(item);
    }
    return cleaned;
  }

  function convertListItem(li, context) {
    var inlineBuffer = [];
    var stack = [];
    var children = li.childNodes;

    function flushInline() {
      var cleaned = cleanInlineFragments(inlineBuffer);
      if (!cleaned.length) {
        inlineBuffer = [];
        return;
      }
      stack.push({ text: cleaned, margin: [0, 0, 0, 2] });
      inlineBuffer = [];
    }

    for (var i = 0; i < children.length; i++) {
      var node = children[i];

      if (node.nodeType === 3) {
        var textParts = parseInline(node, {});
        for (var tp = 0; tp < textParts.length; tp++) {
          inlineBuffer.push(textParts[tp]);
        }
        continue;
      }

      if (node.nodeType !== 1) {
        continue;
      }

      var tag = node.tagName.toUpperCase();
      if (tag === "UL" || tag === "OL" || tag === "TABLE" || tag === "P" || tag === "DIV") {
        flushInline();
        var nested = convertBlockNode(node, context);
        if (nested) {
          if (Array.isArray(nested)) {
            for (var n = 0; n < nested.length; n++) stack.push(nested[n]);
          } else {
            stack.push(nested);
          }
        }
      } else {
        var fragments = parseInline(node, {});
        for (var f = 0; f < fragments.length; f++) {
          inlineBuffer.push(fragments[f]);
        }
      }
    }

    flushInline();

    if (!stack.length) {
      return { text: "" };
    }
    if (stack.length === 1) {
      return stack[0];
    }
    return { stack: stack };
  }

  function convertTableCell(cell, context, isHeader) {
    var blocks = convertChildren(cell.childNodes, context);
    var cellContent;

    if (!blocks.length) {
      cellContent = { text: "" };
    } else if (blocks.length === 1) {
      cellContent = blocks[0];
    } else {
      cellContent = { stack: blocks };
    }

    if (isHeader) {
      cellContent.bold = true;
      cellContent.color = "#ffffff";
      cellContent.fillColor = "#1b2d6b";
    }

    var colSpan = parseInt(cell.getAttribute("colspan"), 10) || 1;
    var rowSpan = parseInt(cell.getAttribute("rowspan"), 10) || 1;

    if (colSpan > 1) {
      cellContent.colSpan = colSpan;
    }
    if (rowSpan > 1) {
      cellContent.rowSpan = rowSpan;
    }

    return {
      value: cellContent,
      colSpan: colSpan,
      rowSpan: rowSpan
    };
  }

  function convertTable(table, context) {
    var rows = table.querySelectorAll("tr");
    if (!rows.length) return null;

    var body = [];
    var maxCols = 0;

    for (var r = 0; r < rows.length; r++) {
      if (!body[r]) body[r] = [];
      var row = rows[r];
      var cells = row.querySelectorAll("th, td");
      var colIndex = 0;

      function advanceCol() {
        while (typeof body[r][colIndex] !== "undefined") {
          colIndex++;
        }
      }

      for (var c = 0; c < cells.length; c++) {
        advanceCol();

        var cell = cells[c];
        var isHeader = cell.tagName.toUpperCase() === "TH";
        var prepared = convertTableCell(cell, context, isHeader);

        body[r][colIndex] = prepared.value;

        for (var cs = 1; cs < prepared.colSpan; cs++) {
          body[r][colIndex + cs] = "";
        }

        for (var rs = 1; rs < prepared.rowSpan; rs++) {
          if (!body[r + rs]) body[r + rs] = [];
          body[r + rs][colIndex] = "";
          for (var cs2 = 1; cs2 < prepared.colSpan; cs2++) {
            body[r + rs][colIndex + cs2] = "";
          }
        }

        colIndex += prepared.colSpan;
      }

      if (body[r].length > maxCols) {
        maxCols = body[r].length;
      }
    }

    for (var rr = 0; rr < body.length; rr++) {
      for (var cc = 0; cc < maxCols; cc++) {
        if (typeof body[rr][cc] === "undefined") {
          body[rr][cc] = "";
        }
      }
    }

    var headerRows = table.querySelectorAll("thead tr").length;

    return {
      table: {
        headerRows: headerRows,
        widths: Array(maxCols + 1).join("*").split("").slice(0, maxCols),
        body: body
      },
      layout: "lightHorizontalLines",
      margin: [0, 8, 0, 14]
    };
  }

  function convertBlockNode(node, context) {
    if (!node) return null;

    if (node.nodeType === 3) {
      if (!node.nodeValue || !node.nodeValue.replace(/\s+/g, "")) return null;
      return { text: node.nodeValue, style: "paragraph" };
    }

    if (node.nodeType !== 1) {
      return null;
    }

    var tag = node.tagName.toUpperCase();

    if (tag === "IMG") {
      return null;
    }

    if (tag === "TABLE") {
      return convertTable(node, context);
    }

    if (tag === "UL" || tag === "OL") {
      var listItems = [];
      var children = node.children;
      for (var i = 0; i < children.length; i++) {
        if (children[i].tagName && children[i].tagName.toUpperCase() === "LI") {
          listItems.push(convertListItem(children[i], context));
        }
      }
      if (!listItems.length) return null;
      var listObj = {};
      if (tag === "UL") {
        listObj.ul = listItems;
      } else {
        listObj.ol = listItems;
      }
      listObj.margin = [0, 4, 0, 10];
      return listObj;
    }

    if (tag === "DIV" || tag === "SECTION" || tag === "ARTICLE" || tag === "MAIN") {
      return convertChildren(node.childNodes, context);
    }

    if (tag === "H1" || tag === "H2" || tag === "H3" || tag === "H4") {
      var headingFragments = cleanInlineFragments(inlineFromChildren(node));
      if (!headingFragments.length) return null;
      var styleName = "heading3";
      if (tag === "H1") styleName = "heading1";
      if (tag === "H2") styleName = "heading2";
      if (tag === "H3") styleName = "heading3";
      if (tag === "H4") styleName = "heading4";
      return { text: headingFragments, style: styleName };
    }

    if (tag === "P" || tag === "A") {
      var paragraphFragments = cleanInlineFragments(inlineFromChildren(node));
      if (!paragraphFragments.length) return null;
      return { text: paragraphFragments, style: "paragraph" };
    }

    var genericFragments = cleanInlineFragments(inlineFromChildren(node));
    if (genericFragments.length) {
      return { text: genericFragments, style: "paragraph" };
    }

    return convertChildren(node.childNodes, context);
  }

  function convertChildren(nodes, context) {
    var out = [];

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      try {
        var converted = convertBlockNode(node, context);
        if (!converted) continue;
        if (Array.isArray(converted)) {
          for (var j = 0; j < converted.length; j++) {
            if (converted[j]) out.push(converted[j]);
          }
        } else {
          out.push(converted);
        }
      } catch (err) {
        var tag = node && node.tagName ? node.tagName.toLowerCase() : "unknown";
        throw createPdfExportError("convert node type", "No se pudo convertir el nodo <" + tag + ">", err, context || null);
      }
    }

    return out;
  }

  function convertSectionHtml(key, title, html, options) {
    var opts = options || {};
    var parser = new DOMParser();
    var doc;

    try {
      doc = parser.parseFromString(html, "text/html");
    } catch (err) {
      throw createPdfExportError("parse DOM", "No se pudo parsear el HTML de la seccion " + key, err, { section: key });
    }

    var nodes = [];
    var bodyNodes = doc.body.childNodes;
    for (var i = 0; i < bodyNodes.length; i++) {
      nodes.push(bodyNodes[i]);
    }

    if (opts.includeSectionHeader) {
      while (nodes.length && nodes[0].nodeType === 3 && !nodes[0].nodeValue.replace(/\s+/g, "")) {
        nodes.shift();
      }
      if (nodes.length && nodes[0].nodeType === 1) {
        var firstTag = nodes[0].tagName.toUpperCase();
        if (firstTag === "H1" || firstTag === "H2") {
          nodes.shift();
        }
      }
    }

    var content = [];

    if (opts.includeSectionHeader) {
      content.push({
        columns: [
          { text: title, style: "sectionTitle" },
          { text: "Volver al Indice", style: "backToIndex", linkToDestination: "indice", alignment: "right", width: "auto" }
        ],
        destination: "sec-" + key,
        pageBreak: "before",
        margin: [0, 0, 0, 10]
      });
    }

    var blocks = convertChildren(nodes, { section: key });
    for (var b = 0; b < blocks.length; b++) {
      content.push(blocks[b]);
    }

    return content;
  }

  function makeCoverContent() {
    return {
      stack: [
        { text: "Transporte Ecologico Compas", style: "coverTitle" },
        { text: "Proyecto de transporte sostenible para el Carnaval de Santa Cruz de Tenerife", style: "coverSubtitle" },
        { text: "Documento generado automaticamente", style: "coverMeta" }
      ],
      margin: [0, 120, 0, 0],
      pageBreak: "after"
    };
  }

  function makeIndexContent() {
    var keys = sortedSectionKeys();
    var list = [];

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      list.push({
        text: sectionTitles[key],
        linkToDestination: "sec-" + key,
        style: "tocItem"
      });
    }

    return {
      stack: [
        { text: "Indice", style: "tocTitle", destination: "indice" },
        { ul: list, margin: [0, 12, 0, 0] }
      ],
      margin: [0, 0, 0, 12]
    };
  }

  function baseDocDefinition() {
    return {
      pageSize: "A4",
      pageMargins: [40, 48, 40, 56],
      defaultStyle: {
        font: "Roboto",
        fontSize: 10,
        lineHeight: 1.45,
        color: "#2c3040"
      },
      styles: {
        coverTitle: { fontSize: 28, bold: true, color: "#1b2d6b", alignment: "center", margin: [0, 0, 0, 10] },
        coverSubtitle: { fontSize: 14, color: "#5a6170", alignment: "center", margin: [0, 0, 0, 8] },
        coverMeta: { fontSize: 10, color: "#5a6170", alignment: "center" },
        tocTitle: { fontSize: 20, bold: true, color: "#1b2d6b", margin: [0, 0, 0, 6] },
        tocItem: { color: "#1b2d6b", margin: [0, 0, 0, 4] },
        sectionTitle: { fontSize: 18, bold: true, color: "#1b2d6b", margin: [0, 0, 0, 8] },
        backToIndex: { fontSize: 9, color: "#1b2d6b", decoration: "underline" },
        heading1: { fontSize: 18, bold: true, color: "#1b2d6b", margin: [0, 12, 0, 8] },
        heading2: { fontSize: 16, bold: true, color: "#1b2d6b", margin: [0, 12, 0, 8] },
        heading3: { fontSize: 13, bold: true, color: "#1b2d6b", margin: [0, 10, 0, 6] },
        heading4: { fontSize: 11, bold: true, color: "#2472c8", margin: [0, 8, 0, 5] },
        paragraph: { margin: [0, 0, 0, 8] },
        footerLink: { fontSize: 9, color: "#1b2d6b", decoration: "underline" }
      },
      footer: function () {
        return {
          columns: [
            { text: "" },
            { text: "Volver al Indice", linkToDestination: "indice", style: "footerLink", alignment: "right" }
          ],
          margin: [40, 0, 40, 20]
        };
      }
    };
  }

  function createSectionDocDefinition(content) {
    var definition = baseDocDefinition();
    definition.content = content;
    definition.footer = null;
    return definition;
  }

  function createFullDocDefinition(content) {
    var definition = baseDocDefinition();
    definition.content = content;
    return definition;
  }

  function downloadPdf(docDefinition, filename) {
    return new Promise(function (resolve, reject) {
      try {
        ensurePdfMake();
        pdfMake.createPdf(docDefinition).getBlob(function (blob) {
          try {
            var blobUrl = URL.createObjectURL(blob);
            var anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            setTimeout(function () {
              URL.revokeObjectURL(blobUrl);
            }, 1000);
            resolve();
          } catch (err) {
            reject(createPdfExportError("pdfmake createPdf", "No se pudo descargar el PDF generado.", err, null));
          }
        });
      } catch (err) {
        if (err && err.pdfExportError) {
          reject(err);
          return;
        }
        reject(createPdfExportError("pdfmake createPdf", "Error al crear el PDF.", err, null));
      }
    });
  }

  function ensureDocxLib() {
    if (typeof window.docx === "undefined" || typeof window.docx.Document !== "function") {
      throw createPdfExportError("docx init", "La libreria DOCX no se ha cargado correctamente.", null, null);
    }
    return window.docx;
  }

  function sanitizeFilePart(text) {
    return String(text || "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }

  function downloadBlob(blob, filename) {
    var blobUrl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(function () {
      URL.revokeObjectURL(blobUrl);
    }, 1000);
  }

  function normalizeText(text) {
    return String(text || "").replace(/\u00a0/g, " ").replace(/\r/g, "").trim();
  }

  function inlineRunsFromNode(node, marks) {
    if (!node) return [];
    var active = marks || {};

    if (node.nodeType === 3) {
      var value = node.nodeValue || "";
      if (!value) return [];
      return [{ text: value, bold: !!active.bold, italics: !!active.italics, link: active.link || null }];
    }

    if (node.nodeType !== 1) return [];
    var tag = node.tagName.toUpperCase();
    if (tag === "IMG") return [];
    if (tag === "BR") return [{ text: "\n", bold: !!active.bold, italics: !!active.italics, link: active.link || null }];

    var next = { bold: !!active.bold, italics: !!active.italics, link: active.link || null };
    if (tag === "B" || tag === "STRONG") next.bold = true;
    if (tag === "I" || tag === "EM") next.italics = true;
    if (tag === "A") {
      var href = normalizeText(node.getAttribute("href"));
      if (/^(https?:|mailto:|tel:)/i.test(href)) {
        next.link = href;
      } else {
        next.link = null;
      }
    }

    var runs = [];
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
      var childRuns = inlineRunsFromNode(children[i], next);
      for (var j = 0; j < childRuns.length; j++) {
        runs.push(childRuns[j]);
      }
    }
    return runs;
  }

  function inlineRunsFromChildren(node) {
    var out = [];
    var children = node.childNodes || [];
    for (var i = 0; i < children.length; i++) {
      var runs = inlineRunsFromNode(children[i], {});
      for (var j = 0; j < runs.length; j++) out.push(runs[j]);
    }
    return out;
  }

  function normalizeRuns(runs) {
    var out = [];
    for (var i = 0; i < runs.length; i++) {
      var run = runs[i];
      if (!run || typeof run.text !== "string") continue;
      if (!run.text.length) continue;
      out.push(run);
    }
    return out;
  }

  function textFromRuns(runs) {
    var text = "";
    for (var i = 0; i < runs.length; i++) {
      text += runs[i].text;
    }
    return normalizeText(text);
  }

  function parseTableBlockForExport(tableNode) {
    var rows = tableNode.querySelectorAll("tr");
    if (!rows.length) return null;
    var data = [];
    for (var r = 0; r < rows.length; r++) {
      var row = [];
      var cells = rows[r].querySelectorAll("th, td");
      for (var c = 0; c < cells.length; c++) {
        row.push(normalizeText(cells[c].innerText || cells[c].textContent || ""));
      }
      if (row.length) data.push(row);
    }
    if (!data.length) return null;
    return { type: "table", rows: data };
  }

  function parseBlocksForExport(nodes) {
    var blocks = [];

    function pushParagraphFromNode(node) {
      var runs = normalizeRuns(inlineRunsFromChildren(node));
      if (!runs.length) return;
      blocks.push({ type: "paragraph", runs: runs });
    }

    function walk(nodeList) {
      for (var i = 0; i < nodeList.length; i++) {
        var node = nodeList[i];
        if (!node) continue;

        if (node.nodeType === 3) {
          var value = normalizeText(node.nodeValue || "");
          if (value) blocks.push({ type: "paragraph", runs: [{ text: value }] });
          continue;
        }
        if (node.nodeType !== 1) continue;

        var tag = node.tagName.toUpperCase();
        if (tag === "IMG") continue;
        if (tag === "TABLE") {
          var table = parseTableBlockForExport(node);
          if (table) blocks.push(table);
          continue;
        }
        if (tag === "H1" || tag === "H2" || tag === "H3" || tag === "H4") {
          var headingRuns = normalizeRuns(inlineRunsFromChildren(node));
          if (headingRuns.length) {
            blocks.push({ type: "heading", level: Number(tag.slice(1)), runs: headingRuns });
          }
          continue;
        }
        if (tag === "UL" || tag === "OL") {
          var items = [];
          var children = node.children;
          for (var liIdx = 0; liIdx < children.length; liIdx++) {
            var li = children[liIdx];
            if (!li.tagName || li.tagName.toUpperCase() !== "LI") continue;
            var itemRuns = normalizeRuns(inlineRunsFromChildren(li));
            var itemText = textFromRuns(itemRuns);
            if (itemText) {
              items.push({ runs: itemRuns.length ? itemRuns : [{ text: itemText }] });
            }
          }
          if (items.length) {
            blocks.push({ type: "list", ordered: tag === "OL", items: items });
          }
          continue;
        }
        if (tag === "P" || tag === "A") {
          pushParagraphFromNode(node);
          continue;
        }
        if (tag === "DIV" || tag === "SECTION" || tag === "ARTICLE" || tag === "MAIN") {
          walk(node.childNodes || []);
          continue;
        }

        var genericRuns = normalizeRuns(inlineRunsFromChildren(node));
        if (genericRuns.length) {
          blocks.push({ type: "paragraph", runs: genericRuns });
        } else {
          walk(node.childNodes || []);
        }
      }
    }

    walk(nodes || []);
    return blocks;
  }

  function convertSectionToExportModel(key, title, html) {
    var parser = new DOMParser();
    var doc;
    try {
      doc = parser.parseFromString(html, "text/html");
    } catch (err) {
      throw createPdfExportError("parse DOM", "No se pudo parsear el HTML de la seccion " + key, err, { section: key });
    }
    var blocks = parseBlocksForExport(doc.body.childNodes || []);
    return {
      key: key,
      title: title,
      html: html,
      blocks: blocks
    };
  }

  function exportModelTextLength(model) {
    if (!model || !model.blocks) return 0;
    var length = 0;
    for (var i = 0; i < model.blocks.length; i++) {
      var block = model.blocks[i];
      if (block.type === "heading" || block.type === "paragraph") {
        length += textFromRuns(block.runs || []).length;
      } else if (block.type === "list") {
        for (var j = 0; j < block.items.length; j++) {
          length += textFromRuns(block.items[j].runs || []).length;
        }
      } else if (block.type === "table") {
        for (var r = 0; r < block.rows.length; r++) {
          for (var c = 0; c < block.rows[r].length; c++) {
            length += normalizeText(block.rows[r][c]).length;
          }
        }
      }
    }
    return length;
  }

  function validateFullExportModels(models) {
    var keys = sortedSectionKeys();
    if (keys.length !== EXPECTED_SECTION_COUNT) {
      throw createPdfExportError("self-check", "Self-check fallido: se esperaban " + EXPECTED_SECTION_COUNT + " secciones.", null, { expected: EXPECTED_SECTION_COUNT, actual: keys.length });
    }
    if (models.length !== keys.length) {
      throw createPdfExportError("self-check", "Self-check fallido: cantidad de secciones cargadas no coincide.", null, { expected: keys.length, actual: models.length });
    }
    var tocEntries = 0;
    for (var i = 0; i < models.length; i++) {
      var model = models[i];
      if (!model || model.key !== keys[i]) {
        throw createPdfExportError("self-check", "Self-check fallido: orden de secciones incorrecto.", null, { expected: keys[i], actual: model ? model.key : null, index: i });
      }
      tocEntries++;
      var textLength = exportModelTextLength(model);
      if (textLength <= 0) {
        throw createPdfExportError("self-check", "Self-check fallido: seccion sin contenido tras conversion.", null, { section: model.key, title: model.title });
      }
    }
    if (tocEntries !== EXPECTED_SECTION_COUNT) {
      throw createPdfExportError("self-check", "Self-check fallido: el indice no contiene " + EXPECTED_SECTION_COUNT + " entradas.", null, { expected: EXPECTED_SECTION_COUNT, actual: tocEntries });
    }
  }

  function escapeMarkdownText(text) {
    return String(text || "")
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\*/g, "\\*")
      .replace(/_/g, "\\_")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]");
  }

  function escapeMarkdownTableCell(text) {
    return String(text || "").replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>").trim();
  }

  function runsToMarkdown(runs) {
    var parts = [];
    for (var i = 0; i < runs.length; i++) {
      var run = runs[i];
      var txt = escapeMarkdownText(run.text || "");
      if (!txt) continue;
      if (run.link) {
        txt = "[" + txt + "](" + run.link + ")";
      }
      if (run.bold) txt = "**" + txt + "**";
      if (run.italics) txt = "*" + txt + "*";
      parts.push(txt);
    }
    return parts.join("").trim();
  }

  function tableToMarkdown(rows) {
    if (!rows || !rows.length) return "";
    var maxCols = 0;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].length > maxCols) maxCols = rows[i].length;
    }
    if (!maxCols) return "";

    function rowToLine(row) {
      var cells = [];
      for (var c = 0; c < maxCols; c++) {
        cells.push(escapeMarkdownTableCell(row[c] || ""));
      }
      return "| " + cells.join(" | ") + " |";
    }

    var lines = [];
    lines.push(rowToLine(rows[0]));
    var sep = [];
    for (var c2 = 0; c2 < maxCols; c2++) sep.push("---");
    lines.push("| " + sep.join(" | ") + " |");
    for (var r = 1; r < rows.length; r++) {
      lines.push(rowToLine(rows[r]));
    }
    return lines.join("\n");
  }

  function blocksToMarkdown(blocks) {
    var lines = [];
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (block.type === "heading") {
        var level = Math.max(1, Math.min(4, block.level || 2));
        lines.push(Array(level + 1).join("#") + " " + runsToMarkdown(block.runs || []));
        lines.push("");
      } else if (block.type === "paragraph") {
        var paragraph = runsToMarkdown(block.runs || []);
        if (paragraph) {
          lines.push(paragraph);
          lines.push("");
        }
      } else if (block.type === "list") {
        for (var j = 0; j < block.items.length; j++) {
          var listText = runsToMarkdown(block.items[j].runs || []);
          if (!listText) continue;
          if (block.ordered) {
            lines.push((j + 1) + ". " + listText);
          } else {
            lines.push("- " + listText);
          }
        }
        lines.push("");
      } else if (block.type === "table") {
        var tableMd = tableToMarkdown(block.rows || []);
        if (tableMd) {
          lines.push(tableMd);
          lines.push("");
        }
      }
    }
    return lines.join("\n").trim() + "\n";
  }

  function modelsToFullMarkdown(models) {
    var md = [];
    md.push("# Transporte Ecologico Compas");
    md.push("");
    md.push("## Indice");
    md.push("");
    for (var i = 0; i < models.length; i++) {
      md.push("- " + models[i].title);
    }
    md.push("");

    for (var j = 0; j < models.length; j++) {
      md.push("## " + models[j].title);
      md.push("");
      md.push(blocksToMarkdown(models[j].blocks || []));
    }
    return md.join("\n").trim() + "\n";
  }

  function runsToDocxChildren(runs, docxLib) {
    var children = [];
    for (var i = 0; i < runs.length; i++) {
      var run = runs[i];
      var text = run.text || "";
      if (!text) continue;
      var textRun = new docxLib.TextRun({
        text: text,
        bold: !!run.bold,
        italics: !!run.italics
      });
      if (run.link) {
        children.push(new docxLib.ExternalHyperlink({
          children: [textRun],
          link: run.link
        }));
      } else {
        children.push(textRun);
      }
    }
    if (!children.length) children.push(new docxLib.TextRun(""));
    return children;
  }

  function blocksToDocxNodes(blocks, docxLib) {
    var nodes = [];
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (block.type === "heading") {
        var heading = docxLib.HeadingLevel.HEADING_2;
        if (block.level === 1) heading = docxLib.HeadingLevel.HEADING_1;
        if (block.level === 2) heading = docxLib.HeadingLevel.HEADING_2;
        if (block.level === 3) heading = docxLib.HeadingLevel.HEADING_3;
        if (block.level >= 4) heading = docxLib.HeadingLevel.HEADING_4;
        nodes.push(new docxLib.Paragraph({
          heading: heading,
          spacing: { after: 160 },
          children: runsToDocxChildren(block.runs || [], docxLib)
        }));
      } else if (block.type === "paragraph") {
        nodes.push(new docxLib.Paragraph({
          spacing: { after: 140 },
          children: runsToDocxChildren(block.runs || [], docxLib)
        }));
      } else if (block.type === "list") {
        for (var j = 0; j < block.items.length; j++) {
          var paragraphOptions = {
            spacing: { after: 100 },
            children: runsToDocxChildren(block.items[j].runs || [], docxLib)
          };
          if (block.ordered) {
            paragraphOptions.numbering = { reference: "ordered-list", level: 0 };
          } else {
            paragraphOptions.bullet = { level: 0 };
          }
          nodes.push(new docxLib.Paragraph(paragraphOptions));
        }
      } else if (block.type === "table") {
        var tableRows = [];
        for (var r = 0; r < block.rows.length; r++) {
          var cells = [];
          for (var c = 0; c < block.rows[r].length; c++) {
            cells.push(new docxLib.TableCell({
              children: [new docxLib.Paragraph({ children: [new docxLib.TextRun(block.rows[r][c] || "")] })]
            }));
          }
          tableRows.push(new docxLib.TableRow({ children: cells }));
        }
        nodes.push(new docxLib.Table({
          rows: tableRows,
          width: { size: 100, type: docxLib.WidthType.PERCENTAGE }
        }));
        nodes.push(new docxLib.Paragraph({ text: "" }));
      }
    }
    return nodes;
  }

  async function generateSectionPdf(sectionKey) {
    await loadSectionAsync(sectionKey);
    var html = await fetchSectionHtml(sectionKey);
    var title = sectionTitles[sectionKey] || ("Seccion " + sectionKey);
    var filename = "TEC_" + sectionKey + "_" + sanitizeFilePart(title) + ".pdf";
    var content = convertSectionHtml(sectionKey, title, html, { includeSectionHeader: false });
    var docDefinition = createSectionDocDefinition(content);
    await downloadPdf(docDefinition, filename);
  }

  async function generateSectionMd(sectionKey) {
    await loadSectionAsync(sectionKey);
    var html = await fetchSectionHtml(sectionKey);
    var title = sectionTitles[sectionKey] || ("Seccion " + sectionKey);
    var model = convertSectionToExportModel(sectionKey, title, html);
    var md = "# " + title + "\n\n" + blocksToMarkdown(model.blocks || []);
    downloadBlob(new Blob([md], { type: "text/markdown;charset=utf-8" }), "TEC_" + sectionKey + "_" + sanitizeFilePart(title) + ".md");
  }

  async function generateSectionDocx(sectionKey) {
    await loadSectionAsync(sectionKey);
    var html = await fetchSectionHtml(sectionKey);
    var title = sectionTitles[sectionKey] || ("Seccion " + sectionKey);
    var model = convertSectionToExportModel(sectionKey, title, html);
    var docxLib = ensureDocxLib();
    var children = [new docxLib.Paragraph({ heading: docxLib.HeadingLevel.HEADING_1, text: title })];
    var content = blocksToDocxNodes(model.blocks || [], docxLib);
    for (var i = 0; i < content.length; i++) children.push(content[i]);
    var doc = new docxLib.Document({
      numbering: {
        config: [{
          reference: "ordered-list",
          levels: [{ level: 0, format: docxLib.LevelFormat.DECIMAL, text: "%1.", alignment: docxLib.AlignmentType.START }]
        }]
      },
      sections: [{ children: children }]
    });
    var blob = await docxLib.Packer.toBlob(doc);
    downloadBlob(blob, "TEC_" + sectionKey + "_" + sanitizeFilePart(title) + ".docx");
  }

  async function collectFullExportModels(updateProgress) {
    var keys = sortedSectionKeys();
    var totalSteps = keys.length * 2;
    var doneSteps = 0;
    var models = [];

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var title = sectionTitles[key] || ("Seccion " + key);
      if (updateProgress) updateProgress("Cargando seccion " + key, doneSteps, totalSteps);
      var html = await fetchSectionHtml(key);
      doneSteps++;
      if (updateProgress) updateProgress("Convirtiendo seccion " + key, doneSteps, totalSteps);
      models.push(convertSectionToExportModel(key, title, html));
      doneSteps++;
    }

    validateFullExportModels(models);
    if (updateProgress) updateProgress("Validando estructura de exportacion", totalSteps, totalSteps);
    return models;
  }

  async function generateFullProjectPdf(models) {
    var content = [];
    content.push(makeCoverContent());
    content.push(makeIndexContent());
    for (var i = 0; i < models.length; i++) {
      var sectionContent = convertSectionHtml(models[i].key, models[i].title, models[i].html, { includeSectionHeader: true });
      for (var c = 0; c < sectionContent.length; c++) {
        content.push(sectionContent[c]);
      }
    }
    var docDefinition = createFullDocDefinition(content);
    await downloadPdf(docDefinition, "Transporte_Ecologico_Compas_Proyecto_Completo.pdf");
  }

  async function generateFullProjectMd(models) {
    var md = modelsToFullMarkdown(models);
    downloadBlob(new Blob([md], { type: "text/markdown;charset=utf-8" }), "Transporte_Ecologico_Compas_Proyecto_Completo.md");
  }

  async function generateFullProjectDocx(models) {
    var docxLib = ensureDocxLib();
    var children = [];
    children.push(new docxLib.Paragraph({
      text: "Transporte Ecologico Compas",
      heading: docxLib.HeadingLevel.HEADING_1,
      spacing: { after: 240 }
    }));
    children.push(new docxLib.Paragraph({
      text: "Proyecto de transporte sostenible para el Carnaval de Santa Cruz de Tenerife",
      spacing: { after: 320 }
    }));
    children.push(new docxLib.Paragraph({ text: "Indice", heading: docxLib.HeadingLevel.HEADING_1, spacing: { after: 180 } }));
    for (var i = 0; i < models.length; i++) {
      children.push(new docxLib.Paragraph({ text: models[i].title, spacing: { after: 80 } }));
    }
    children.push(new docxLib.Paragraph({ text: "", pageBreakBefore: true }));

    for (var j = 0; j < models.length; j++) {
      children.push(new docxLib.Paragraph({
        text: models[j].title,
        heading: docxLib.HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 180 }
      }));
      var nodes = blocksToDocxNodes(models[j].blocks || [], docxLib);
      for (var n = 0; n < nodes.length; n++) children.push(nodes[n]);
    }

    var doc = new docxLib.Document({
      numbering: {
        config: [{
          reference: "ordered-list",
          levels: [{ level: 0, format: docxLib.LevelFormat.DECIMAL, text: "%1.", alignment: docxLib.AlignmentType.START }]
        }]
      },
      sections: [{ children: children }]
    });
    var blob = await docxLib.Packer.toBlob(doc);
    downloadBlob(blob, "Transporte_Ecologico_Compas_Proyecto_Completo.docx");
  }

  async function generateFullProjectExport(format) {
    var formatLabel = String(format || "pdf").toUpperCase();
    var models = [];
    function updateProgress(label, doneSteps, totalSteps) {
      var percent = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 100;
      if (btnExportCompleto) {
        btnExportCompleto.textContent = "Generando " + formatLabel + "... " + percent + "%";
      }
      setPdfStatus(label + " (" + percent + "%)", null, true, percent);
    }

    setPdfStatus("Preparando exportacion completa en " + formatLabel + "...", null, true, 0);
    if (btnExportCompleto) {
      btnExportCompleto.textContent = "Generando " + formatLabel + "... 0%";
    }

    models = await collectFullExportModels(updateProgress);
    if (format === "docx") {
      await generateFullProjectDocx(models);
    } else if (format === "md") {
      await generateFullProjectMd(models);
    } else {
      await generateFullProjectPdf(models);
    }
    setPdfStatus("Exportacion completa en " + formatLabel + " generada correctamente.", null, false, 100);
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

  if (btnCopyPdfDetails) {
    btnCopyPdfDetails.addEventListener("click", copyErrorDetails);
  }

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

  /* ---------- Export generation ---------- */
  contentArea.addEventListener("click", function (e) {
    var option = e.target.closest(".export-option");
    if (!option) return;

    var format = option.getAttribute("data-export-format");
    var scope = option.getAttribute("data-export-scope");
    var sectionKey = option.getAttribute("data-section");
    var menu = option.closest("details");
    if (menu) menu.open = false;

    if (scope === "section") {
      option.disabled = true;
      var originalLabel = option.textContent;
      option.textContent = "Generando...";

      var sectionExportPromise;
      if (format === "docx") {
        sectionExportPromise = generateSectionDocx(sectionKey);
      } else if (format === "md") {
        sectionExportPromise = generateSectionMd(sectionKey);
      } else {
        sectionExportPromise = generateSectionPdf(sectionKey);
      }

      sectionExportPromise
        .catch(function (err) {
          logPdfExportError(err);
          var detail = err && err.details ? err.details : "phase=unknown | message=No se pudo generar la exportacion de la seccion";
          setPdfStatus("Error al exportar la seccion " + sectionKey + " en " + String(format || "").toUpperCase() + ".", detail, false, 0);
          alert("No se pudo exportar esta seccion. Puede copiar los detalles para soporte.");
        })
        .finally(function () {
          option.disabled = false;
          option.textContent = originalLabel;
        });
      return;
    }

    if (scope === "full") {
      option.disabled = true;
      if (exportMenuFull) exportMenuFull.open = false;

      generateFullProjectExport(format)
        .catch(function (err) {
          logPdfExportError(err);
          var detail = err && err.details ? err.details : "phase=unknown | message=No se pudo generar la exportacion completa";
          setPdfStatus("No se pudo generar la exportacion completa en " + String(format || "").toUpperCase() + ".", detail, false, 0);
          alert("No se pudo generar la exportacion completa. Puede copiar los detalles para soporte.");
        })
        .finally(function () {
          option.disabled = false;
          if (btnExportCompleto) {
            btnExportCompleto.textContent = "Exportar completo";
          }
        });
    }
  });

  /* ---------- Init ---------- */
  clearPdfStatus();
  handleHash();
})();
