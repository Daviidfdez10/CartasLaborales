// generador.js — usa jsPDF (cargado via CDN en cada HTML)
// Función principal que genera el PDF de cualquier carta

function generarPDF(datos) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const margenIzq = 25;
  const margenDer = 185;
  const anchoPagina = margenDer - margenIzq;
  let y = 30;

  // Fuente base
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);

  // --- Datos del trabajador (arriba izquierda) ---
  doc.setFont('helvetica', 'bold');
  doc.text(datos.nombre, margenIzq, y);
  doc.setFont('helvetica', 'normal');
  y += 6;
  doc.text(`DNI: ${datos.dni}`, margenIzq, y);
  y += 6;
  if (datos.puesto) { doc.text(datos.puesto, margenIzq, y); y += 6; }
  if (datos.telefono) { doc.text(datos.telefono, margenIzq, y); y += 6; }
  if (datos.email) { doc.text(datos.email, margenIzq, y); y += 6; }

  y += 8;

  // --- Datos de la empresa ---
  doc.setFont('helvetica', 'bold');
  doc.text(datos.empresa, margenIzq, y);
  doc.setFont('helvetica', 'normal');
  y += 6;
  if (datos.responsable) { doc.text(`A/A: ${datos.responsable}`, margenIzq, y); y += 6; }

  y += 8;

  // --- Fecha ---
  doc.text(datos.fecha, margenIzq, y);
  y += 14;

  // --- Asunto (opcional) ---
  if (datos.asunto) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Asunto: ${datos.asunto}`, margenIzq, y);
    doc.setFont('helvetica', 'normal');
    y += 10;
  }

  // --- Saludo ---
  doc.text('Estimados señores/as:', margenIzq, y);
  y += 10;

  // --- Cuerpo de la carta (con saltos de línea automáticos) ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const lineas = doc.splitTextToSize(datos.cuerpo, anchoPagina);
  lineas.forEach(linea => {
    if (y > 270) {
      doc.addPage();
      y = 25;
    }
    doc.text(linea, margenIzq, y);
    y += 6.5;
  });

  y += 10;

  // --- Cierre ---
  doc.text('Atentamente,', margenIzq, y);
  y += 18;

  // Línea de firma
  doc.setDrawColor(180, 180, 180);
  doc.line(margenIzq, y, margenIzq + 60, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.text(datos.nombre, margenIzq, y);
  doc.setFont('helvetica', 'normal');
  y += 6;
  doc.text(`DNI: ${datos.dni}`, margenIzq, y);

  // --- Pie de página discreto ---
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text('Documento generado en cartaslaborales.es', 105, 290, { align: 'center' });

  // --- Descargar ---
  const nombreArchivo = datos.nombreArchivo || 'carta-laboral';
  doc.save(`${nombreArchivo}.pdf`);
}

// Formatea una fecha tipo "2025-01-15" a "15 de enero de 2025"
function formatearFecha(fechaISO) {
  if (!fechaISO) return '___';
  const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(fechaISO + 'T12:00:00').toLocaleDateString('es-ES', opciones);
}

// Añade N días a una fecha ISO y devuelve la nueva fecha formateada
function sumarDias(fechaISO, dias) {
  if (!fechaISO) return '___';
  const fecha = new Date(fechaISO + 'T12:00:00');
  fecha.setDate(fecha.getDate() + parseInt(dias));
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}