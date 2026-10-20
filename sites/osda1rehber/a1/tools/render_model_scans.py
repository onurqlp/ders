#!/usr/bin/env python3
"""Render ÖSD official 16-page A1 Modellsatz, matching user's ZA1 Modellsatz HP.pdf."""
from pathlib import Path
import subprocess
import tempfile
from PIL import Image

SRC='https://www.osd.at/wp-content/uploads/2024/04/za1_ms_hp_2024-04-10.pdf'
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets'/'model'
OUT.mkdir(parents=True,exist_ok=True)
def run(*args):
    return subprocess.run(args,check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=150)
with tempfile.TemporaryDirectory() as t:
    pdf=Path(t)/'za1.pdf'
    run('curl','--fail','--location','--retry','4','--retry-all-errors','--connect-timeout','20','--max-time','90','--user-agent','Mozilla/5.0',SRC,'--output',str(pdf))
    assert pdf.read_bytes()[:4]==b'%PDF'
    info=subprocess.check_output(['pdfinfo',str(pdf)],text=True)
    pages=int(next(l.split(':',1)[1].strip() for l in info.splitlines() if l.startswith('Pages:')))
    assert pages==16,f'Unexpected model page count: {pages}'
    for p in range(2,13):
        f=OUT/f'za1-page-{p:02d}'
        run('pdftoppm','-f',str(p),'-l',str(p),'-singlefile','-jpeg','-jpegopt','quality=82,optimize=y,progressive=y','-r','155',str(pdf),str(f))
        im=Image.open(f.with_suffix('.jpg'))
        assert im.width>1000 and im.height>1500
        print(f'PAGE {p}: {im.size} {f.with_suffix(".jpg").stat().st_size} bytes')
    im=Image.open(OUT/'za1-page-08.jpg').convert('RGB')
    w,h=im.size
    for name,coordinates in {'hoeren-2':(0.06,0.04,0.96,0.53),'hoeren-3':(0.06,0.48,0.96,0.96)}.items():
        x0,y0,x1,y1=coordinates
        crop=im.crop((round(x0*w),round(y0*h),round(x1*w),round(y1*h)))
        crop.save(OUT/f'za1-{name}.jpg','JPEG',quality=85,optimize=True,progressive=True)
    assert len(list(OUT.glob('*.jpg')))==13
    for f in OUT.glob('*.jpg'):
        assert 8000<f.stat().st_size<1_800_000,f
print('PASS 11 official model pages and 2 Hören crops; answer key 13–16 excluded')
