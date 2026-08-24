from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph, Table, TableStyle


OUT = Path(__file__).with_name("motovax-monthly-progress-report-2026-08.pdf")
PAGE = landscape(A4)
W, H = PAGE
BLUE = colors.HexColor("#155EEF")
NAVY = colors.HexColor("#102A56")
CYAN = colors.HexColor("#00A7C4")
GREEN = colors.HexColor("#16A36A")
AMBER = colors.HexColor("#F59E0B")
RED = colors.HexColor("#D92D20")
INK = colors.HexColor("#172033")
MUTED = colors.HexColor("#667085")
LIGHT = colors.HexColor("#F2F5FA")
BORDER = colors.HexColor("#D9E0EA")
WHITE = colors.white

styles = getSampleStyleSheet()
BODY = ParagraphStyle("body", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.4, leading=11, textColor=INK)
SMALL = ParagraphStyle("small", parent=BODY, fontSize=7.2, leading=9, textColor=MUTED)
CELL = ParagraphStyle("cell", parent=BODY, fontSize=7.5, leading=9.3)
CELL_BOLD = ParagraphStyle("cellb", parent=CELL, fontName="Helvetica-Bold")
CELL_WHITE = ParagraphStyle("cellw", parent=CELL_BOLD, textColor=WHITE)
RIGHT = ParagraphStyle("right", parent=CELL, alignment=TA_RIGHT)


def p(text, style=CELL):
    return Paragraph(text, style)


def draw_paragraph(c, text, style, x, y, width, height):
    para = Paragraph(text, style)
    para.wrapOn(c, width, height)
    para.drawOn(c, x, y)


def header(c, page_no, section):
    c.setFillColor(NAVY)
    c.rect(0, H - 17 * mm, W, 17 * mm, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(16 * mm, H - 10.5 * mm, "MOTOVAX  |  MONTHLY PROGRESS REPORT")
    c.setFont("Helvetica", 7.5)
    c.drawRightString(W - 16 * mm, H - 10.5 * mm, f"{section}   •   24 Agustus 2026")
    c.setStrokeColor(BORDER)
    c.line(16 * mm, 10 * mm, W - 16 * mm, 10 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.8)
    c.drawString(16 * mm, 6 * mm, "Internal management material • Snapshot berbasis scope & changelog")
    c.drawRightString(W - 16 * mm, 6 * mm, f"{page_no} / 5")


def title(c, text, subtitle=None):
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 19)
    c.drawString(16 * mm, H - 30 * mm, text)
    if subtitle:
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 8.3)
        c.drawString(16 * mm, H - 36 * mm, subtitle)


def metric(c, x, y, w, label, value, color=BLUE, note=""):
    c.setFillColor(WHITE)
    c.setStrokeColor(BORDER)
    c.roundRect(x, y, w, 28 * mm, 3 * mm, stroke=1, fill=1)
    c.setFillColor(color)
    c.rect(x, y, 2.2 * mm, 28 * mm, stroke=0, fill=1)
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7.2)
    c.drawString(x + 7 * mm, y + 19 * mm, label.upper())
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(x + 7 * mm, y + 8 * mm, str(value))
    if note:
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 6.5)
        c.drawRightString(x + w - 5 * mm, y + 7.5 * mm, note)


def draw_table(c, data, x, y_top, widths, row_heights=None, header_bg=NAVY, extra=None):
    t = Table(data, colWidths=widths, rowHeights=row_heights)
    rules = [
        ("BACKGROUND", (0, 0), (-1, 0), header_bg),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]
    for r in range(1, len(data)):
        rules.append(("BACKGROUND", (0, r), (-1, r), WHITE if r % 2 else LIGHT))
    if extra:
        rules.extend(extra)
    t.setStyle(TableStyle(rules))
    tw, th = t.wrapOn(c, sum(widths), H)
    t.drawOn(c, x, y_top - th)
    return th


def page1(c):
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(BLUE)
    c.circle(W - 8 * mm, H - 8 * mm, 80 * mm, stroke=0, fill=1)
    c.setFillColor(CYAN)
    c.circle(W - 8 * mm, H - 8 * mm, 49 * mm, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(18 * mm, H - 23 * mm, "MOTOVAX")
    c.setFont("Helvetica-Bold", 30)
    c.drawString(18 * mm, H - 60 * mm, "Monthly Progress Report")
    c.setFont("Helvetica", 13)
    c.drawString(18 * mm, H - 73 * mm, "Scope delivery • Issues • Integration • Forward plan")
    c.setFillColor(colors.HexColor("#B9CCF5"))
    c.setFont("Helvetica", 9)
    c.drawString(18 * mm, H - 91 * mm, "Reporting date")
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(18 * mm, H - 102 * mm, "24 Agustus 2026")
    c.setFillColor(colors.HexColor("#B9CCF5"))
    c.setFont("Helvetica", 8)
    c.drawString(18 * mm, 24 * mm, "Disiapkan untuk Monthly Meeting Direktur")
    c.drawString(18 * mm, 17 * mm, "Periode kerja pada scope: 3 bulan • Snapshot changelog terakhir: 21 Agustus 2026")


def page2(c):
    header(c, 2, "Executive Summary")
    title(c, "Progress Task", "12 workstream diturunkan dari scope attachment; status dikonfirmasi terhadap changelog dan peta produksi.")
    x0, y = 16 * mm, H - 72 * mm
    gap, boxw = 4 * mm, (W - 32 * mm - 4 * 4 * mm) / 5
    for i, item in enumerate([
        ("Total task", "12", NAVY, "workstream"),
        ("Completed", "11", GREEN, "live"),
        ("On progress", "1", AMBER, "partial"),
        ("Pending", "0", MUTED, "not started"),
        ("Progress", "91,7%", BLUE, "11 / 12"),
    ]):
        metric(c, x0 + i * (boxw + gap), y, boxw, *item)

    # progress bar
    bar_y = H - 88 * mm
    c.setFillColor(LIGHT); c.roundRect(x0, bar_y, W - 32 * mm, 7 * mm, 3.5 * mm, 0, 1)
    c.setFillColor(GREEN); c.roundRect(x0, bar_y, (W - 32 * mm) * 11 / 12, 7 * mm, 3.5 * mm, 0, 1)
    c.setFillColor(AMBER); c.rect(x0 + (W - 32 * mm) * 11 / 12 - 2 * mm, bar_y, (W - 32 * mm) / 12 + 2 * mm, 7 * mm, 0, 1)

    data = [
        [p("Scope", CELL_WHITE), p("Workstream", CELL_WHITE), p("Completed", CELL_WHITE), p("On progress", CELL_WHITE), p("Progress", CELL_WHITE), p("Status utama", CELL_WHITE)],
        [p("Leads Management System", CELL_BOLD), p("4"), p("4"), p("0"), p("100%", CELL_BOLD), p("Pipeline, capture, follow-up, analytics tersedia")],
        [p("Jasmine AI", CELL_BOLD), p("2"), p("2"), p("0"), p("100%", CELL_BOLD), p("AI sales consultant + channel customer live")],
        [p("Falcon AI", CELL_BOLD), p("3"), p("2"), p("1"), p("66,7%", CELL_BOLD), p("Inventory & content live; finance masih partial")],
        [p("Omnichannel Call Center", CELL_BOLD), p("3"), p("3"), p("0"), p("100%", CELL_BOLD), p("Unified inbox WA, Instagram DM, Messenger live")],
        [p("TOTAL", CELL_BOLD), p("12", CELL_BOLD), p("11", CELL_BOLD), p("1", CELL_BOLD), p("91,7%", CELL_BOLD), p("Tidak ada item Not Started")],
    ]
    draw_table(c, data, x0, H - 104 * mm, [48*mm, 22*mm, 27*mm, 30*mm, 25*mm, 105*mm], extra=[("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#EAF2FF"))])
    c.setFillColor(LIGHT); c.roundRect(x0, 16 * mm, W - 32 * mm, 18 * mm, 2 * mm, 0, 1)
    draw_paragraph(c, "<b>Executive takeaway:</b> scope inti sudah operasional. Fokus penyelesaian bergeser dari membangun fondasi ke menuntaskan kedalaman kapabilitas finance Falcon serta menjaga stabilitas integrasi dan kualitas data.", BODY, x0 + 5*mm, 20*mm, W - 42*mm, 12*mm)


def page3(c):
    header(c, 3, "Issue & Fixing")
    title(c, "Report Kendala & Fixing Progress", "Kendala dikelompokkan sebagai issue cluster agar perbaikan berulang tidak dihitung ganda.")
    x0 = 16 * mm
    gap, boxw = 5 * mm, (W - 32 * mm - 3 * 5 * mm) / 4
    for i, item in enumerate([
        ("Total kendala", "5", NAVY, "cluster"),
        ("Resolved", "5", GREEN, "100%"),
        ("On progress", "0", AMBER, "open"),
        ("Pending", "0", MUTED, "open"),
    ]):
        metric(c, x0 + i * (boxw + gap), H - 72 * mm, boxw, *item)
    data = [
        [p("Issue cluster", CELL_WHITE), p("Dampak", CELL_WHITE), p("Fix / evidence changelog", CELL_WHITE), p("Status", CELL_WHITE)],
        [p("Stabilitas koneksi WhatsApp", CELL_BOLD), p("Risiko reconnect saat deploy / AI pause"), p("Reconnect guard, single lease, auto-unpause, disconnect/reconnect alert"), p("RESOLVED", CELL_BOLD)],
        [p("Routing & ownership percakapan", CELL_BOLD), p("Potensi salah handler AI / Agent / MR"), p("Canonical role ownership, assignment persistence, bucket mengikuti handler terakhir"), p("RESOLVED", CELL_BOLD)],
        [p("Validasi import inventori", CELL_BOLD), p("Warning loop, konflik identitas, status stok"), p("Idempotent confirmation, uploader lock, anomaly & typo validation"), p("RESOLVED", CELL_BOLD)],
        [p("Distribusi lead & Call Center", CELL_BOLD), p("Sumber lead dan cohort tidak konsisten"), p("Source control, manual lead linkage, KPI & drilldown distribusi"), p("RESOLVED", CELL_BOLD)],
        [p("Akurasi analytics cabang", CELL_BOLD), p("Perbedaan snapshot stok / performa"), p("Sinkronisasi snapshot stok, branch performance, conversion cohort"), p("RESOLVED", CELL_BOLD)],
    ]
    draw_table(c, data, x0, H - 91 * mm, [54*mm, 52*mm, 116*mm, 35*mm], extra=[("TEXTCOLOR", (-1, 1), (-1, -1), GREEN)])
    c.setFillColor(colors.HexColor("#ECFDF3")); c.roundRect(x0, 16*mm, W-32*mm, 22*mm, 2*mm, 0, 1)
    c.setFillColor(GREEN); c.setFont("Helvetica-Bold", 8); c.drawString(x0+5*mm, 30*mm, "CRITICAL HIGHLIGHT")
    c.setFillColor(INK); c.setFont("Helvetica", 8); c.drawString(x0+5*mm, 22*mm, "Tidak ada critical issue terbuka yang teridentifikasi pada snapshot. Risiko historis tertinggi - dual ownership/reconnect WhatsApp - telah memiliki guard dan alert.")


def page4(c):
    header(c, 4, "System & Integration")
    title(c, "System / Integration Status", "Status merefleksikan capability yang terlihat di produksi; bukan sertifikasi SLA pihak ketiga.")
    x0 = 16 * mm
    data = [
        [p("Area", CELL_WHITE), p("Status", CELL_WHITE), p("Capability saat ini", CELL_WHITE), p("Dependency / support", CELL_WHITE)],
        [p("LMS / CRM", CELL_BOLD), p("LIVE", CELL_BOLD), p("Pipeline, lead journey, follow-up/campaign, analytics dan distribusi"), p("Kualitas data lead, mapping source, disiplin operasional MR")],
        [p("Jasmine AI", CELL_BOLD), p("LIVE", CELL_BOLD), p("AI sales consultant, inventory shortlist, detail unit, kredit, booking/handoff"), p("Nomor/channel aktif, policy respons, daftar PIC dan eskalasi")],
        [p("Falcon AI", CELL_BOLD), p("PARTIAL", CELL_BOLD), p("Inventory ops dan content live; finance berupa simulasi/analisis terbatas"), p("Validasi rule finance oleh DSSM/Mobix; data pricing/TNS/GP")],
        [p("Omnichannel Call Center", CELL_BOLD), p("LIVE", CELL_BOLD), p("Unified inbox WhatsApp, Instagram DM, Messenger; takeover dan MR handoff"), p("Meta Business permissions, health channel, owner routing")],
        [p("Analytics", CELL_BOLD), p("LIVE", CELL_BOLD), p("Lead distribution, conversion cohort, inventory dan performa cabang"), p("Konsistensi master cabang dan source mapping")],
    ]
    draw_table(c, data, x0, H - 48 * mm, [48*mm, 28*mm, 102*mm, 79*mm], extra=[
        ("TEXTCOLOR", (1, 1), (1, 2), GREEN), ("TEXTCOLOR", (1, 3), (1, 3), AMBER), ("TEXTCOLOR", (1, 4), (1, 5), GREEN)
    ])
    c.setFillColor(LIGHT); c.roundRect(x0, 18*mm, (W-36*mm)/2, 39*mm, 2*mm, 0, 1)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 9); c.drawString(x0+5*mm, 48*mm, "Support yang dibutuhkan dari DSSM / Mobix")
    draw_paragraph(c, "• Validasi formula dan batas cakupan finance Falcon.<br/>• Menjaga master data cabang, inventory, lead source, pricing/TNS/GP.<br/>• Memastikan akses Meta Business dan nomor WhatsApp tetap sehat.<br/>• Menetapkan PIC dan SLA untuk handoff Agent → MR.", BODY, x0+5*mm, 23*mm, (W-36*mm)/2-10*mm, 24*mm)
    rx = W/2+2*mm
    c.setFillColor(colors.HexColor("#FFF7E6")); c.roundRect(rx, 18*mm, W-16*mm-rx, 39*mm, 2*mm, 0, 1)
    c.setFillColor(AMBER); c.setFont("Helvetica-Bold", 9); c.drawString(rx+5*mm, 48*mm, "Attention")
    draw_paragraph(c, "Integrasi channel adalah dependency eksternal: perubahan token, permission, device/session, atau kebijakan Meta dapat menurunkan availability meskipun aplikasi tidak berubah. Alert sudah tersedia, tetapi respons operasional tetap membutuhkan PIC yang jelas.", BODY, rx+5*mm, 27*mm, W-26*mm-rx, 18*mm)


def page5(c):
    header(c, 5, "Forward Plan & Risk")
    title(c, "Future Plan, Risk & Management Attention", "Prioritas diarahkan pada penutupan gap partial dan hardening operasional.")
    x0 = 16 * mm
    data = [
        [p("Prioritas", CELL_WHITE), p("Next task / milestone", CELL_WHITE), p("Target", CELL_WHITE), p("Outcome", CELL_WHITE)],
        [p("P0", CELL_BOLD), p("Finalisasi scope finance Falcon + acceptance rule DSSM/Mobix"), p("1–2 minggu", CELL_BOLD), p("Status Falcon bergerak dari partial ke accepted scope")],
        [p("P0", CELL_BOLD), p("Uji E2E channel: AI → takeover Agent → handoff MR"), p("1 minggu", CELL_BOLD), p("Alur ownership dan eskalasi terverifikasi")],
        [p("P0", CELL_BOLD), p("Audit master data cabang, lead source, pricing/TNS/GP"), p("1–2 minggu", CELL_BOLD), p("Analytics dan rekomendasi AI lebih konsisten")],
        [p("P1", CELL_BOLD), p("Operational monitoring & monthly KPI baseline"), p("2–4 minggu", CELL_BOLD), p("Availability, conversion, response dan handoff terukur")],
        [p("P1", CELL_BOLD), p("Hardening regression untuk import inventory & reconnect"), p("Berjalan", CELL_BOLD), p("Menekan regresi pada dua area historis berisiko")],
    ]
    draw_table(c, data, x0, H - 48*mm, [28*mm, 112*mm, 32*mm, 85*mm], extra=[("TEXTCOLOR", (0, 1), (0, -1), BLUE)])
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 10); c.drawString(x0, 79*mm, "Risk & Attention Matrix")
    risk = [
        [p("Risk", CELL_WHITE), p("Likelihood", CELL_WHITE), p("Impact", CELL_WHITE), p("Mitigasi / keputusan management", CELL_WHITE)],
        [p("Dependency Meta/WhatsApp & session health", CELL_BOLD), p("Medium"), p("High"), p("Tetapkan PIC incident, SLA, dan jalur eskalasi channel")],
        [p("Kualitas master data lintas cabang", CELL_BOLD), p("Medium"), p("High"), p("Owner data per cabang + cadence audit")],
        [p("Scope finance belum full accounting", CELL_BOLD), p("High"), p("Medium"), p("Keputusan: batasi pada simulation/insight atau perluas scope")],
        [p("Regresi pada routing/import kompleks", CELL_BOLD), p("Medium"), p("Medium"), p("Pertahankan regression suite dan staged rollout")],
    ]
    draw_table(c, risk, x0, 74*mm, [83*mm, 29*mm, 29*mm, 116*mm], extra=[("TEXTCOLOR", (2, 1), (2, 2), RED), ("TEXTCOLOR", (2, 3), (2, 4), AMBER)])
    c.setFillColor(colors.HexColor("#EAF2FF")); c.roundRect(x0, 14*mm, W-32*mm, 15*mm, 2*mm, 0, 1)
    c.setFillColor(NAVY); c.setFont("Helvetica-Bold", 8); c.drawString(x0+5*mm, 21*mm, "DECISION REQUEST")
    c.setFillColor(INK); c.setFont("Helvetica", 7.8); c.drawString(x0+42*mm, 21*mm, "Setujui batas scope finance Falcon, data owner tiap cabang, serta PIC + SLA incident untuk channel eksternal.")


def build():
    c = Canvas(str(OUT), pagesize=PAGE, pageCompression=1)
    c.setTitle("Motovax Monthly Progress Report — Agustus 2026")
    c.setAuthor("Motovax")
    for fn in (page1, page2, page3, page4, page5):
        fn(c)
        c.showPage()
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
