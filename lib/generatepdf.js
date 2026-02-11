"use client";

import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import html2canvas from "html2canvas";

const BASE_URL = "https://validation-site-skilleducation-1.netlify.app/profile?id=";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}

function formatDatePlusYears(timestamp, yearsToAdd) {
  if (typeof timestamp !== "number" || typeof yearsToAdd !== "number") {
    throw new TypeError("Both timestamp and yearsToAdd must be numbers.");
  }

  const date = new Date(timestamp);
  date.setFullYear(date.getFullYear() + yearsToAdd);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const getOrdinalSuffix = (day) => {
  switch (day) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatDateDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
};

const formatScore = (score) => {
  return String(score).slice(0, 2);
};

const getBestScores = (profile) => {
  let bestScores = {
    listening: 0,
    structure: 0,
    reading: 0,
    total: 0,
  };

  for (let i = 1; i <= 4; i++) {
    const suffix = i === 1 ? "" : i;
    const currentTotal = profile[`total_score${suffix}`] || 0;

    if (currentTotal > bestScores.total) {
      bestScores = {
        listening: profile[`score_listening${suffix}`] || 0,
        structure: profile[`score_structure${suffix}`] || 0,
        reading: profile[`score_reading${suffix}`] || 0,
        total: currentTotal,
      };
    }
  }

  return {
    listening: formatScore(bestScores.listening),
    structure: formatScore(bestScores.structure),
    reading: formatScore(bestScores.reading),
    total: bestScores.total,
  };
};

const mmToPx = (mm) => mm * 3.78;
const VERTICAL_OFFSET = -10;

const generateCertificateCanvas = async (profile) => {
  const container = document.createElement("div");
  const widthPx = mmToPx(297);
  const heightPx = mmToPx(210);

  container.style.width = `${widthPx}px`;
  container.style.height = `${heightPx}px`;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.backgroundColor = "white";
  document.body.appendChild(container);

  const bg = document.createElement("img");
  // Ubah path ke public folder Next.js
  bg.src = "/images/background-sertifikat.png";
  bg.style.width = "100%";
  bg.style.height = "100%";
  bg.style.position = "absolute";
  bg.style.top = "0";
  bg.style.left = "0";
  container.appendChild(bg);

  const qrData = `${BASE_URL}${profile.id}`;
  const qrCodeDataUrl = await QRCode.toDataURL(qrData);

  const bestScores = getBestScores(profile);

  const adjustY = (y) => mmToPx(y + VERTICAL_OFFSET);

  const content = document.createElement("div");
  content.style.position = "absolute";
  content.style.top = "0";
  content.style.left = "0";
  content.style.width = "100%";
  content.style.height = "100%";
  content.style.zIndex = "1";
  content.style.color = "#000000";

  const baseStyle = `
    position: absolute;
    transform-origin: left top;
    white-space: nowrap;
  `;

  const smallTextStyle = `
    ${baseStyle}
    font-family: 'TimesCondensed', 'Times New Roman', serif;
    font-size: ${mmToPx(3.5)}px;
    font-stretch: condensed;
  `;

  const regisTextStyle = `
    ${baseStyle}
    font-family: 'TimesCondensed', 'Times New Roman', serif;
    font-size: ${mmToPx(3.2)}px;
    font-stretch: condensed;
  `;

  const npsnTextStyle = `
    ${baseStyle}
    font-family: 'TimesCondensed', 'Times New Roman', serif;
    font-size: ${mmToPx(3.1)}px;
    font-stretch: condensed;
  `;

  const normalTextStyle = `
    ${baseStyle}
    font-family: 'TimesCondensed', 'Times New Roman', serif;
    font-size: ${mmToPx(4.2)}px;
    font-stretch: condensed;
  `;

  const nameTextStyle = `
    ${baseStyle}
    font-family: 'Garamond', 'EB Garamond', serif;
    font-size: ${mmToPx(5.6)}px;
    font-weight: bold;
    text-decoration: underline;
  `;

  const scoreValueStyle = `
    ${baseStyle}
    font-family: 'Times New Roman MT Condensed', serif;
    font-size: ${mmToPx(4.1)}px;
    font-stretch: condensed;
    font-weight: bold;
  `;

  const scoreRangeStyle = `
    ${baseStyle}
    font-family: 'IBM Plex Sans Condensed', serif;
    font-size: ${mmToPx(4.1)}px;
    font-stretch: condensed;
    font-weight: normal;
  `;

  const scoreTotalStyle = `
    ${baseStyle}
    font-family: 'IBM Plex Sans Condensed', serif;
    font-size: ${mmToPx(4.1)}px;
    font-stretch: condensed;
    font-weight: bold;
  `;

  const tempatLahirStyle = `
    ${baseStyle}
    font-family: 'Times New Roman MT Condensed', serif;
    font-size: ${mmToPx(4.3)}px;
    font-stretch: condensed;
    font-weight: normal;
  `;

  const tanggalCetakStyle = `
    ${baseStyle}
    font-family: 'Times New Roman MT Condensed', serif;
    font-size: ${mmToPx(3.7)}px;
    font-stretch: condensed;
    font-weight: normal;
  `;

  const scoreValues = `
    <div style="${scoreValueStyle} left: ${mmToPx(150)}px; top: ${adjustY(130.2)}px;">: ${bestScores.listening}</div>
    <div style="${scoreValueStyle} left: ${mmToPx(150)}px; top: ${adjustY(136.2)}px;">: ${bestScores.structure}</div>
    <div style="${scoreValueStyle} left: ${mmToPx(150)}px; top: ${adjustY(142.1)}px;">: ${bestScores.reading}</div>
    <div style="${scoreTotalStyle} left: ${mmToPx(150)}px; top: ${adjustY(147.2)}px;">: ${bestScores.total}</div>
    <div style="${scoreRangeStyle} left: ${mmToPx(133)}px; top: ${adjustY(153.2)}px;">: 271-677</div>
  `;

  content.innerHTML = `
    <div style="${smallTextStyle} left: ${mmToPx(32)}px; top: ${adjustY(84)}px;">
      ${formatDate(profile.expired)}
    </div>
    <div style="${regisTextStyle} left: ${mmToPx(232)}px; top: ${adjustY(81)}px;">
      ${profile.nomor_registrasi}/${formatDateDDMMYYYY(profile.tanggal_selesai_ujian)}
    </div>
    <div style="${npsnTextStyle} left: ${mmToPx(232)}px; top: ${adjustY(87)}px;">
      <b>NPSN:</b> K9999499
    </div>
    <div style="${nameTextStyle} left: ${mmToPx(148.5)}px; top: ${adjustY(98)}px; transform: translateX(-50%);">
      ${profile.nama.toUpperCase()}
    </div>
    <div style="${tempatLahirStyle} left: ${mmToPx(133)}px; top: ${adjustY(105)}px;">
      ${toTitleCase(profile.tempat_lahir)}, ${formatDate(profile.tanggal_lahir)}
    </div>
    <div style="${tempatLahirStyle} left: ${mmToPx(133)}px; top: ${adjustY(111)}px;">
      ${formatDate(profile.tanggal_selesai_ujian)}
    </div>
    ${scoreValues}
    <div style="${tanggalCetakStyle} left: ${mmToPx(146.5)}px; top: ${adjustY(159)}px;">
      Pare, ${formatDate(Date.now())}
    </div>
    <img src="${qrCodeDataUrl}" style="position: absolute; left: ${mmToPx(33)}px; top: ${adjustY(140)}px; width: ${mmToPx(30)}px; height: ${mmToPx(30)}px;" />
  `;

  container.appendChild(content);

  await Promise.all([
    new Promise((resolve) => (bg.onload = resolve)),
    new Promise((resolve) => {
      const qrImg = content.querySelector("img");
      if (qrImg.complete) resolve();
      else qrImg.onload = resolve;
    }),
  ]);

  const canvas = await html2canvas(container, {
    width: widthPx,
    height: heightPx,
    scale: 2,
    useCORS: true,
  });

  document.body.removeChild(container);
  return canvas;
};

const generateCertificate = async (profile) => {
  if (!profile) {
    console.error("No profile selected");
    return;
  }

  try {
    const canvas = await generateCertificateCanvas(profile);

    // Save PDF
    const doc = new jsPDF("landscape", "mm", [297, 210]);
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    doc.addImage(imgData, "JPEG", 0, 0, 297, 210);
    doc.save(`certificate-${profile.nama}.pdf`);

    // Generate PNG
    const pngUrl = canvas.toDataURL("image/png", 2.0);

    // Create download link for PNG
    const link = document.createElement("a");
    link.download = `certificate-${profile.nama}.png`;
    link.href = pngUrl;
    link.click();
  } catch (error) {
    console.error("Error generating certificate:", error);
  }
};

export default generateCertificate;
