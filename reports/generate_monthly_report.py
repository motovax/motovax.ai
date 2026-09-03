from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph, Table, TableStyle


OUT = Path(__file__).with_name("dssm-motovax-lms-monthly-report-2026-09.pdf")
REPORT_DATE = "3 September 2026"
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
    c.drawString(16 * mm, H - 10.5 * mm, "DSSM x MOTOVAX LMS  |  MONTHLY PROGRESS REPORT")
    c.setFont("Helvetica", 7.5)
    c.drawRightString(W - 16 * mm, H - 10.5 * mm, f"{section}   •   {REPORT_DATE}")
    c.setStrokeColor(BORDER)
    c.line(16 * mm, 10 * mm, W - 16 * mm, 10 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.8)
    c.drawString(16 * mm, 6 * mm, "Internal management material • 12 workstream scope DSSM x Motovax LMS")
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
    c.drawString(18 * mm, H - 23 * mm, "DSSM x MOTOVAX LMS")
    c.setFont("Helvetica-Bold", 30)
    c.drawString(18 * mm, H - 60 * mm, "Monthly Progress Report")
    c.setFont("Helvetica", 13)
    c.drawString(18 * mm, H - 73 * mm, "Scope delivery • Issues • Integration • Forward plan")
    c.setFillColor(colors.HexColor("#B9CCF5"))
    c.setFont("Helvetica", 9)
    c.drawString(18 * mm, H - 91 * mm, "Reporting date")
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(18 * mm, H - 102 * mm, REPORT_DATE)
    c.setFillColor(colors.HexColor("#B9CCF5"))
    c.setFont("Helvetica", 8)
    c.drawString(18 * mm, 24 * mm, "Disiapkan untuk Monthly Meeting Direktur")
    c.drawString(18 * mm, 17 * mm, "Snapshot status: 3 September 2026 • Scope: LMS, Jasmine AI, Falcone AI, dan Omnichannel Call Center")


def page2(c):
    header(c, 2, "Executive Summary")
    title(c, "Progress Task", "12 workstream capability dalam scope meeting; bukan total seluruh backlog engineering Motovax.")
    x0, y = 16 * mm, H - 72 * mm
    gap, boxw = 4 * mm, (W - 32 * mm - 4 * 4 * mm) / 5
    for i, item in enumerate([
        ("Total task", "12", NAVY, "workstream"),
        ("Completed", "12", GREEN, "live"),
        ("On progress", "0", AMBER, "scope task"),
        ("Pending", "0", MUTED, "not started"),
        ("Progress", "100%", BLUE, "12 / 12"),
    ]):
        metric(c, x0 + i * (boxw + gap), y, boxw, *item)

    # progress bar
    bar_y = H - 88 * mm
    c.setFillColor(LIGHT); c.roundRect(x0, bar_y, W - 32 * mm, 7 * mm, 3.5 * mm, 0, 1)
    c.setFillColor(GREEN); c.roundRect(x0, bar_y, W - 32 * mm, 7 * mm, 3.5 * mm, 0, 1)

    data = [
        [p("No.", CELL_WHITE), p("Scope", CELL_WHITE), p("Workstream capability", CELL_WHITE), p("Status", CELL_WHITE)],
        [p("1"), p("Leads Management System", CELL_BOLD), p("Pipeline lead"), p("COMPLETED", CELL_BOLD)],
        [p("2"), p("Leads Management System", CELL_BOLD), p("Auto capture lead"), p("COMPLETED", CELL_BOLD)],
        [p("3"), p("Leads Management System", CELL_BOLD), p("Follow-up lead"), p("COMPLETED", CELL_BOLD)],
        [p("4"), p("Leads Management System", CELL_BOLD), p("Analytics lead"), p("COMPLETED", CELL_BOLD)],
        [p("5"), p("Jasmine AI", CELL_BOLD), p("AI Sales Consultant"), p("COMPLETED", CELL_BOLD)],
        [p("6"), p("Jasmine AI", CELL_BOLD), p("Operasional channel customer: WhatsApp, Instagram, Facebook"), p("COMPLETED", CELL_BOLD)],
        [p("7"), p("Falcone AI", CELL_BOLD), p("Inventory operations"), p("COMPLETED", CELL_BOLD)],
        [p("8"), p("Falcone AI", CELL_BOLD), p("Financial Analysis: simulasi kredit, TNS/GP, analisis performa"), p("COMPLETED", CELL_BOLD)],
        [p("9"), p("Falcone AI", CELL_BOLD), p("Content operations"), p("COMPLETED", CELL_BOLD)],
        [p("10"), p("Omnichannel Call Center", CELL_BOLD), p("WhatsApp unified inbox"), p("COMPLETED", CELL_BOLD)],
        [p("11"), p("Omnichannel Call Center", CELL_BOLD), p("Instagram DM unified inbox"), p("COMPLETED", CELL_BOLD)],
        [p("12"), p("Omnichannel Call Center", CELL_BOLD), p("Facebook Messenger unified inbox"), p("COMPLETED", CELL_BOLD)],
    ]
    draw_table(c, data, x0, H - 101 * mm, [14*mm, 66*mm, 142*mm, 35*mm], extra=[("TEXTCOLOR", (-1, 1), (-1, -1), GREEN)])


def page3(c):
    header(c, 3, "Issue & Fixing")
    title(c, "Report Kendala & Fixing Progress", "Periode 3 Agustus–3 September 2026; task teknis terkait dikelompokkan agar tidak dihitung ganda.")
    x0 = 16 * mm
    gap, boxw = 5 * mm, (W - 32 * mm - 3 * 5 * mm) / 4
    for i, item in enumerate([
        ("Total kendala", "10", NAVY, "cluster"),
        ("Resolved", "9", GREEN, "90%"),
        ("On progress", "1", AMBER, "alignment"),
        ("Pending", "0", MUTED, "open"),
    ]):
        metric(c, x0 + i * (boxw + gap), H - 72 * mm, boxw, *item)
    data = [
        [p("Issue cluster", CELL_WHITE), p("Fixing progress / kondisi saat ini", CELL_WHITE), p("Status", CELL_WHITE)],
        [p("Outage / deploy production", CELL_BOLD), p("Layanan dipulihkan dan deployment diverifikasi"), p("RESOLVED", CELL_BOLD)],
        [p("Koneksi Meta Business / WhatsApp", CELL_BOLD), p("Stream recovery, reconnect guard, dan perbaikan false alert tersedia"), p("RESOLVED", CELL_BOLD)],
        [p("Routing Jasmine AI–Agent–MR", CELL_BOLD), p("Ownership, takeover, handoff, dan pending action diperbaiki"), p("RESOLVED", CELL_BOLD)],
        [p("Upload, antrean, dan merge foto Falcon", CELL_BOLD), p("Durable queue, validasi attachment, deduplikasi, dan monitoring tersedia"), p("RESOLVED", CELL_BOLD)],
        [p("Parsing / import Excel dan identitas unit", CELL_BOLD), p("Warning, duplikasi, identity mismatch, dan minor parsing diperbaiki; regression check berjalan"), p("RESOLVED", CELL_BOLD)],
        [p("Pemetaan lead, Direct Chat, cabang, funnel", CELL_BOLD), p("Mapping sumber/cabang dan drilldown report diperbaiki"), p("RESOLVED", CELL_BOLD)],
        [p("Sinkronisasi dan alur TikTok DM", CELL_BOLD), p("Listener, request flow, identitas kontak, dan inbox dasar tersedia"), p("RESOLVED", CELL_BOLD)],
        [p("Permission role internal dan MR", CELL_BOLD), p("Akses report/channel dan role MR diselaraskan"), p("RESOLVED", CELL_BOLD)],
        [p("Harga, TNS/GP, MRP, stok, data unit", CELL_BOLD), p("Kalkulasi, penyimpanan, dan normalisasi data diperbaiki"), p("RESOLVED", CELL_BOLD)],
        [p("Master data Omnichannel & MR", CELL_BOLD), p("Belum satu sumber; field dan report disesuaikan bersama PIC DSSM Mbak Cat"), p("ON PROGRESS", CELL_BOLD)],
    ]
    draw_table(c, data, x0, H - 91 * mm, [77*mm, 145*mm, 35*mm], extra=[("TEXTCOLOR", (-1, 1), (-1, 9), GREEN), ("TEXTCOLOR", (-1, 10), (-1, 10), AMBER)])
    c.setFillColor(colors.HexColor("#ECFDF3")); c.roundRect(x0, 16*mm, W-32*mm, 22*mm, 2*mm, 0, 1)
    c.setFillColor(GREEN); c.setFont("Helvetica-Bold", 8); c.drawString(x0+5*mm, 30*mm, "CRITICAL HIGHLIGHT")
    c.setFillColor(INK); c.setFont("Helvetica", 8); c.drawString(x0+5*mm, 22*mm, "Critical aktif: 0. Highlight bulan ini: outage production, stream Meta, dan reliabilitas foto Falcon telah resolved; master data Omnichannel–MR perlu perhatian.")


def page4(c):
    header(c, 4, "System & Integration")
    title(c, "System / Integration Status", "Status merefleksikan capability yang terlihat di produksi; bukan sertifikasi SLA pihak ketiga.")
    x0 = 16 * mm
    data = [
        [p("Area", CELL_WHITE), p("Status", CELL_WHITE), p("Capability saat ini", CELL_WHITE), p("Dependency / support", CELL_WHITE)],
        [p("LMS / CRM", CELL_BOLD), p("LIVE", CELL_BOLD), p("Pipeline, lead journey, follow-up/campaign, analytics dan distribusi"), p("Kualitas data lead, mapping source, disiplin operasional MR")],
        [p("Jasmine AI", CELL_BOLD), p("LIVE", CELL_BOLD), p("AI sales consultant, inventory shortlist, detail unit, kredit, booking/handoff"), p("Nomor/channel aktif, policy respons, daftar PIC dan eskalasi")],
        [p("Falcone AI", CELL_BOLD), p("LIVE", CELL_BOLD), p("Inventory ops, content, simulasi kredit, TNS/GP, dan financial analysis"), p("Hitungan kredit: API DSF; AI hanya interface jawaban, bukan mesin kalkulasi")],
        [p("Omnichannel Call Center", CELL_BOLD), p("LIVE / ALIGN", CELL_BOLD), p("Unified inbox WhatsApp, Instagram DM, Messenger; takeover dan MR handoff"), p("Penyatuan master data Omnichannel–MR; kebutuhan report DSSM, PIC Mbak Cat")],
        [p("Analytics", CELL_BOLD), p("LIVE", CELL_BOLD), p("Lead distribution, conversion cohort, inventory dan performa cabang"), p("Konsistensi master cabang dan source mapping")],
    ]
    draw_table(c, data, x0, H - 48 * mm, [48*mm, 28*mm, 102*mm, 79*mm], extra=[
        ("TEXTCOLOR", (1, 1), (1, 3), GREEN), ("TEXTCOLOR", (1, 4), (1, 4), AMBER), ("TEXTCOLOR", (1, 5), (1, 5), GREEN)
    ])
    c.setFillColor(LIGHT); c.roundRect(x0, 18*mm, (W-36*mm)/2, 39*mm, 2*mm, 0, 1)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 9); c.drawString(x0+5*mm, 48*mm, "Support yang dibutuhkan dari DSSM / Mobix")
    draw_paragraph(c, "• Finalisasi struktur satu master data Omnichannel dan MR.<br/>• Konfirmasi field, format, dan kebutuhan report bersama Mbak Cat.<br/>• Menjaga akses/kredensial dan availability API DSF untuk hitungan kredit.<br/>• Memastikan akses Meta Business dan nomor WhatsApp tetap sehat.", BODY, x0+5*mm, 23*mm, (W-36*mm)/2-10*mm, 24*mm)
    rx = W/2+2*mm
    c.setFillColor(colors.HexColor("#FFF7E6")); c.roundRect(rx, 18*mm, W-16*mm-rx, 39*mm, 2*mm, 0, 1)
    c.setFillColor(AMBER); c.setFont("Helvetica-Bold", 9); c.drawString(rx+5*mm, 48*mm, "Attention")
    draw_paragraph(c, "Integrasi channel adalah dependency eksternal: perubahan token, permission, device/session, atau kebijakan Meta dapat menurunkan availability meskipun aplikasi tidak berubah. Alert sudah tersedia, tetapi respons operasional tetap membutuhkan PIC yang jelas.", BODY, rx+5*mm, 27*mm, W-26*mm-rx, 18*mm)


def page5(c):
    header(c, 5, "Forward Plan & Risk")
    title(c, "Future Plan, Risk & Management Attention", "Prioritas diarahkan pada penyelarasan master data, report DSSM, dan hardening operasional.")
    x0 = 16 * mm
    data = [
        [p("Prioritas", CELL_WHITE), p("Next task / milestone", CELL_WHITE), p("Target", CELL_WHITE), p("Outcome", CELL_WHITE)],
        [p("P0", CELL_BOLD), p("Sepakati satu master data Omnichannel dan Marketing Representative"), p("Setelah format disetujui", CELL_BOLD), p("Satu sumber data untuk operasional dan report DSSM")],
        [p("P0", CELL_BOLD), p("Finalisasi field dan format report bersama PIC DSSM (Mbak Cat)"), p("Menunggu alignment", CELL_BOLD), p("Acceptance report terdokumentasi dan dapat diuji")],
        [p("P0", CELL_BOLD), p("Rollout integrasi TikTok untuk DSSM"), p("Setelah akses disetujui", CELL_BOLD), p("TikTok DM masuk unified inbox, routing AI/Agent/MR, dan report channel")],
        [p("P0", CELL_BOLD), p("Regression check parsing Excel inventory"), p("1 minggu", CELL_BOLD), p("Mencegah pengulangan salah parsing field unit")],
        [p("P1", CELL_BOLD), p("Operational monitoring & monthly KPI baseline"), p("2–4 minggu", CELL_BOLD), p("Availability, conversion, response dan handoff terukur")],
    ]
    draw_table(c, data, x0, H - 48*mm, [28*mm, 112*mm, 32*mm, 85*mm], extra=[("TEXTCOLOR", (0, 1), (0, -1), BLUE)])
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 10); c.drawString(x0, 79*mm, "Risk & Attention Matrix")
    risk = [
        [p("Risk", CELL_WHITE), p("Likelihood", CELL_WHITE), p("Impact", CELL_WHITE), p("Mitigasi / keputusan management", CELL_WHITE)],
        [p("Dependency Meta/WhatsApp & session health", CELL_BOLD), p("Medium"), p("High"), p("Tetapkan PIC incident, SLA, dan jalur eskalasi channel")],
        [p("Availability / perubahan kontrak API DSF", CELL_BOLD), p("Medium"), p("High"), p("Monitoring, fallback error, owner kredensial, dan koordinasi perubahan API")],
        [p("Kualitas master data lintas cabang", CELL_BOLD), p("Medium"), p("High"), p("Owner data per cabang + cadence audit")],
        [p("Definisi master data/report belum final", CELL_BOLD), p("High"), p("Medium"), p("Putuskan field, owner, dan acceptance bersama PIC DSSM")],
        [p("Akses dan approval akun TikTok DSSM", CELL_BOLD), p("Medium"), p("Medium"), p("Tetapkan owner akun, akses developer, dan jadwal UAT channel")],
    ]
    draw_table(c, risk, x0, 74*mm, [83*mm, 29*mm, 29*mm, 116*mm], extra=[("TEXTCOLOR", (2, 1), (2, 2), RED), ("TEXTCOLOR", (2, 3), (2, 4), AMBER)])
    c.setFillColor(colors.HexColor("#EAF2FF")); c.roundRect(x0, 14*mm, W-32*mm, 15*mm, 2*mm, 0, 1)
    c.setFillColor(NAVY); c.setFont("Helvetica-Bold", 8); c.drawString(x0+5*mm, 21*mm, "DECISION REQUEST")
    c.setFillColor(INK); c.setFont("Helvetica", 7.8); c.drawString(x0+42*mm, 21*mm, "Setujui struktur master data/report serta owner, akses akun, dan jadwal UAT TikTok DSSM bersama PIC terkait.")


def build():
    c = Canvas(str(OUT), pagesize=PAGE, pageCompression=1)
    c.setTitle("DSSM x Motovax LMS Monthly Progress Report — September 2026")
    c.setAuthor("Motovax")
    for fn in (page1, page2, page3, page4, page5):
        fn(c)
        c.showPage()
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
