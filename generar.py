"""Genera un carrusel de 4 diapositivas (1080x1350) con el diseño de MK Stays.
Uso: python3 carrusel.py contenido.json carpeta_salida
contenido.json:
{"serie":"Guía 02","titulo":["Tu precio","está","<r>mal puesto</r>"],"subtitulo":"...",
 "claves":[{"titulo":"...","texto":"...","accion":"..."},{"titulo":"...","texto":"...","accion":"..."}],
 "cta_palabra":"AUDITORÍA","cta_texto":"y te envío una auditoría de precios gratis de tu alojamiento."}
"""
import json, sys, os, base64, html, re, glob
from playwright.sync_api import sync_playwright

def font_css():
    cands = glob.glob(os.path.expanduser("~/fonts/package/files/archivo-latin-wdth-normal.woff2")) + \
            glob.glob("**/archivo-latin-wdth-normal.woff2", recursive=True)
    if not cands:
        return ""
    b = base64.b64encode(open(cands[0], "rb").read()).decode()
    return f"@font-face{{font-family:'Archivo';src:url(data:font/woff2;base64,{b}) format('woff2');font-weight:100 900;font-stretch:62% 125%}}"

def esc(s):
    s = html.escape(s)
    return re.sub(r"&lt;r&gt;(.*?)&lt;/r&gt;", r'<span style="color:#FF3B1F">\1</span>', s)

INK, CREAM, RED, GREY = "#0D0D0D", "#F1EFEA", "#FF3B1F", "#3A3A37"
BASE = "*{box-sizing:border-box}body{margin:0}.s{position:relative;overflow:hidden;width:1080px;height:1350px;padding:120px;font-family:'Archivo','Arial Narrow',sans-serif;display:flex;flex-direction:column;justify-content:space-between}.cap{font-size:32px;font-weight:700;font-stretch:80%;letter-spacing:.08em;text-transform:uppercase}.big{margin:0;font-weight:900;font-stretch:62%;text-transform:uppercase;letter-spacing:-.01em}"

def bars(n, total, on, off, cur):
    out = []
    for i in range(total):
        c = cur if i == n else (on if i < n else off)
        out.append(f'<span style="flex:1;height:8px;background:{c}"></span>')
    return f'<div style="display:flex;gap:8px">{"".join(out)}</div>'

def foot(i, on, off, cur, right):
    return f'<div style="display:flex;flex-direction:column;gap:22px;position:relative">{bars(i,4,on,off,cur)}<div class="cap" style="display:flex;justify-content:space-between"><span>@mkstays.agency</span><span>{right}</span></div></div>'

def cover(c):
    br = lambda p: f'<div style="position:absolute;{p};width:72px;height:72px"></div>'
    corners = "".join([
        f'<div style="position:absolute;left:56px;top:56px;width:72px;height:72px;border-top:6px solid {RED};border-left:6px solid {RED}"></div>',
        f'<div style="position:absolute;right:56px;top:56px;width:72px;height:72px;border-top:6px solid {RED};border-right:6px solid {RED}"></div>',
        f'<div style="position:absolute;left:56px;bottom:56px;width:72px;height:72px;border-bottom:6px solid {RED};border-left:6px solid {RED}"></div>',
        f'<div style="position:absolute;right:56px;bottom:56px;width:72px;height:72px;border-bottom:6px solid {RED};border-right:6px solid {RED}"></div>'])
    t = "<br>".join(esc(x) for x in c["titulo"])
    return f'''<div class="s" style="background:{INK};color:{CREAM}">{corners}
<div class="cap" style="position:relative;display:flex;justify-content:space-between;align-items:center"><span style="display:flex;align-items:center;gap:14px"><span style="width:22px;height:22px;border-radius:50%;background:{RED}"></span>Rec 00:00:07</span><span style="color:#A3A39D">MK Stays / {esc(c.get("serie",""))}</span></div>
<div style="position:relative;display:flex;flex-direction:column;gap:44px"><h1 class="big" style="font-size:170px;line-height:.86">{t}</h1><p style="margin:0;font-size:40px;line-height:1.35;color:#D6D4CE;max-width:760px">{esc(c["subtitulo"])}</p></div>
{foot(0, RED, GREY, RED, "01/04 · Desliza →")}</div>'''

def clave(c, k, i):
    return f'''<div class="s" style="background:{CREAM};color:{INK}">
<div style="position:absolute;right:-30px;top:40px;font-size:620px;line-height:.8;font-weight:900;font-stretch:62%;color:{RED}">{i:02d}</div>
<div class="cap" style="position:relative">Clave {i:02d} de 02</div>
<div style="position:relative;display:flex;flex-direction:column;gap:32px"><h1 class="big" style="font-size:118px;line-height:.88">{esc(k["titulo"])}</h1><div style="height:6px;background:{INK}"></div>
<p style="margin:0;font-size:38px;line-height:1.4;color:#2B2B29">{esc(k["texto"])}</p>
<div style="background:{INK};color:{CREAM};padding:32px 40px;display:flex;flex-direction:column;gap:12px"><span class="cap" style="font-weight:800;color:{RED}">Haz esto</span><span style="font-size:40px;line-height:1.3;font-weight:600">{esc(k["accion"])}</span></div></div>
{foot(i, INK, "#CFCCC4", RED, f"0{i+1}/04 · Desliza →")}</div>'''

def cta(c):
    w = esc(c.get("cta_palabra", "AUDITORÍA"))
    size = min(330, int(1480 / max(1, len(c.get("cta_palabra", "AUDITORÍA")))))
    return f'''<div class="s" style="background:{RED};color:{INK}">
<div class="cap" style="display:flex;justify-content:space-between"><span>¿Tienes un alojamiento turístico?</span><span>04/04</span></div>
<div style="display:flex;flex-direction:column;gap:36px;align-items:flex-start"><div class="big" style="font-size:200px;line-height:.84">Comenta</div>
<div class="big" style="background:{INK};color:{CREAM};padding:26px 48px 10px;font-size:{size}px;line-height:.84">{w}</div>
<p style="margin:12px 0 0;font-size:44px;line-height:1.3;font-weight:600;max-width:840px">{esc(c["cta_texto"])}</p></div>
<div style="display:flex;flex-direction:column;gap:22px"><div style="display:flex;gap:8px">{"".join(f'<span style="flex:1;height:8px;background:{INK}"></span>' for _ in range(4))}</div>
<div class="cap" style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:40px;font-weight:900">@mkstays.agency</span><span style="font-size:28px">MK Stays</span></div></div></div>'''

def main():
    c = json.load(open(sys.argv[1], encoding="utf-8"))
    out = sys.argv[2]; os.makedirs(out, exist_ok=True)
    slides = [cover(c), clave(c, c["claves"][0], 1), clave(c, c["claves"][1], 2), cta(c)]
    css = font_css() + BASE
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome") if os.path.exists("/usr/bin/google-chrome") else p.chromium.launch()
        pg = b.new_page(viewport={"width": 1080, "height": 1350})
        for i, s in enumerate(slides, 1):
            pg.set_content(f"<html><head><meta charset='utf-8'><style>{css}</style></head><body>{s}</body></html>")
            pg.evaluate("document.fonts.ready")
            path = os.path.join(out, f"slide-{i}.png")
            pg.screenshot(path=path, clip={"x": 0, "y": 0, "width": 1080, "height": 1350})
            print(path)
        b.close()

if __name__ == "__main__":
    main()
