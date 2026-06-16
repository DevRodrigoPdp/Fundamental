import sys
from pathlib import Path
from rembg import remove

PUBLIC = Path(__file__).resolve().parent.parent / "public"

PAIRS = [
    ("catalogo_t3r/discos_freno/discos_freno_center_lock_4.jpg", "catalogo_t3r/cutouts/disco_freno.png"),
    ("catalogo_t3r/pastillas_freno/pastillas_freno_sram_guide_2011_code_3.jpg", "catalogo_t3r/cutouts/pastillas_freno.png"),
    ("catalogo_t3r/pedal_plataforma/pedal_plataforma_3.jpg", "catalogo_t3r/cutouts/pedal_plataforma.png"),
    ("catalogo_t3r/pedal_automatico/pedal_automatico_3.jpg", "catalogo_t3r/cutouts/pedal_automatico.png"),
    ("catalogo_t3r/pedal_carretera/pedal_carretera_3.jpg", "catalogo_t3r/cutouts/pedal_carretera.png"),
    ("catalogo_t3r/pedalier_1/pedalier_1_3.jpg", "catalogo_t3r/cutouts/pedalier.png"),
    ("catalogo_t3r/punos/puno_arandelas_ergonomicos.jpg", "catalogo_t3r/cutouts/puno.png"),
    ("catalogo_t3r/valvula_tubeless/valvula_tubeless_3.jpg", "catalogo_t3r/cutouts/valvula.png"),
]

out_dir = PUBLIC / "catalogo_t3r" / "cutouts"
out_dir.mkdir(parents=True, exist_ok=True)

for src_rel, dst_rel in PAIRS:
    src = PUBLIC / src_rel
    dst = PUBLIC / dst_rel
    if not src.exists():
        print(f"FALTA: {src}")
        continue
    with open(src, "rb") as f:
        input_bytes = f.read()
    output_bytes = remove(input_bytes)
    with open(dst, "wb") as f:
        f.write(output_bytes)
    print(f"OK: {dst_rel}  ({len(output_bytes)/1024:.0f} KB)")

print("Listo.")
