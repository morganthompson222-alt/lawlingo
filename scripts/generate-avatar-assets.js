const fs = require('fs');
const path = require('path');

const DIR = path.resolve('public/avatars');
fs.mkdirSync(DIR, { recursive: true });

function write(name, svg) {
  fs.writeFileSync(path.join(DIR, `${name}.svg`), svg.trim());
  console.log(`  ✓ ${name}`);
}

// ═══════════════════════════════════════════
// BASE BODIES — character silhouettes with faces
// ═══════════════════════════════════════════

write('base_default', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5DADE2"/>
      <stop offset="100%" stop-color="#2E86C1"/>
    </linearGradient>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FDEBD0"/>
      <stop offset="100%" stop-color="#E8C9A0"/>
    </linearGradient>
  </defs>
  <!-- Body / robed torso -->
  <path d="M156 512V350c0-8 6-14 14-14h172c8 0 14 6 14 14v162H156z" fill="url(#body)"/>
  <ellipse cx="256" cy="380" rx="110" ry="20" fill="#2471A3" opacity="0.3"/>
  <!-- Shoulders -->
  <ellipse cx="256" cy="330" rx="90" ry="60" fill="url(#body)"/>
  <!-- Collar / shirt -->
  <path d="M220 310L256 345L292 310L280 290H232L220 310Z" fill="#fff" stroke="#ccc" stroke-width="2"/>
  <path d="M256 345V390" stroke="#ccc" stroke-width="2"/>
  <!-- Neck -->
  <rect x="236" y="270" width="40" height="30" rx="10" fill="url(#skin)"/>
  <!-- Head -->
  <ellipse cx="256" cy="240" rx="55" ry="65" fill="url(#skin)"/>
  <!-- Hair -->
  <path d="M201 240Q201 170 256 170Q311 170 311 240V250Q311 260 301 260H211Q201 260 201 250Z" fill="#3D2B1F"/>
  <!-- Eyes -->
  <ellipse cx="236" cy="235" rx="6" ry="7" fill="#2C1810"/>
  <ellipse cx="276" cy="235" rx="6" ry="7" fill="#2C1810"/>
  <ellipse cx="238" cy="233" rx="2" ry="2" fill="#fff"/>
  <ellipse cx="278" cy="233" rx="2" ry="2" fill="#fff"/>
  <!-- Mouth -->
  <path d="M246 258Q256 265 266 258" fill="none" stroke="#C0765A" stroke-width="2" stroke-linecap="round"/>
</svg>`);

write('base_barrister', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="body2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1A2E"/>
      <stop offset="100%" stop-color="#16213E"/>
    </linearGradient>
    <linearGradient id="skin2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F5CBA7"/>
      <stop offset="100%" stop-color="#E0A87C"/>
    </linearGradient>
  </defs>
  <!-- Dark suit body -->
  <path d="M140 512V340c0-8 6-14 14-14h196c8 0 14 6 14 14v172H140z" fill="url(#body2)"/>
  <ellipse cx="256" cy="360" rx="100" ry="18" fill="#0F0F23" opacity="0.4"/>
  <ellipse cx="256" cy="310" rx="85" ry="55" fill="url(#body2)"/>
  <!-- White shirt -->
  <path d="M225 295L256 325L287 295L276 278H236L225 295Z" fill="#fff" stroke="#ddd" stroke-width="1.5"/>
  <!-- Red tie -->
  <path d="M250 285L256 340L262 285H275L265 345H247L237 285Z" fill="#C0392B"/>
  <!-- Neck -->
  <rect x="236" y="258" width="40" height="24" rx="8" fill="url(#skin2)"/>
  <!-- Confident head -->
  <ellipse cx="256" cy="225" rx="52" ry="62" fill="url(#skin2)"/>
  <!-- Hair -->
  <path d="M204 220Q204 155 256 155Q308 155 308 220V235Q308 245 298 245H214Q204 245 204 235Z" fill="#2C1810"/>
  <path d="M204 220Q195 200 200 185Q220 175 256 175Q292 175 312 185Q317 200 308 220" fill="#3D2B1F"/>
  <!-- Eyes - sharper, more confident -->
  <ellipse cx="236" cy="220" rx="5" ry="6" fill="#1A0A00"/>
  <ellipse cx="276" cy="220" rx="5" ry="6" fill="#1A0A00"/>
  <ellipse cx="238" cy="218" rx="2" ry="2" fill="#fff"/>
  <ellipse cx="278" cy="218" rx="2" ry="2" fill="#fff"/>
  <!-- Eyebrows -->
  <path d="M226 208Q236 204 246 208" fill="none" stroke="#2C1810" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M266 208Q276 204 286 208" fill="none" stroke="#2C1810" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Mouth - slight smirk -->
  <path d="M246 242Q256 248 266 242" fill="none" stroke="#C0765A" stroke-width="2" stroke-linecap="round"/>
</svg>`);

write('base_judge', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="body3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8B0000"/>
      <stop offset="100%" stop-color="#600000"/>
    </linearGradient>
    <linearGradient id="skin3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFE0BD"/>
      <stop offset="100%" stop-color="#E8C48A"/>
    </linearGradient>
  </defs>
  <!-- Scarlet robe -->
  <path d="M120 512V330c0-8 6-14 14-14h244c8 0 14 6 14 14v182H120z" fill="url(#body3)"/>
  <!-- Ermine trim -->
  <path d="M120 330Q120 320 130 320H382Q392 320 392 330" fill="none" stroke="#fff" stroke-width="8"/>
  <circle cx="150" cy="230" r="5" fill="#fff"/>
  <circle cx="175" cy="230" r="5" fill="#fff"/>
  <circle cx="200" cy="230" r="5" fill="#fff"/>
  <circle cx="312" cy="230" r="5" fill="#fff"/>
  <circle cx="337" cy="230" r="5" fill="#fff"/>
  <circle cx="362" cy="230" r="5" fill="#fff"/>
  <!-- Broad shoulders -->
  <ellipse cx="256" cy="300" rx="105" ry="60" fill="url(#body3)"/>
  <!-- White collar tabs -->
  <path d="M210 280L240 310L270 280L260 265H220L210 280Z" fill="#fff" stroke="#eee" stroke-width="1"/>
  <!-- Neck -->
  <rect x="236" y="248" width="40" height="22" rx="8" fill="url(#skin3)"/>
  <!-- Older, wise face -->
  <ellipse cx="256" cy="215" rx="58" ry="68" fill="url(#skin3)"/>
  <!-- White/grey hair -->
  <path d="M198 210Q198 140 256 140Q314 140 314 210V228Q314 238 304 238H208Q198 238 198 228Z" fill="#A9A9A9"/>
  <path d="M198 210Q190 190 195 175Q220 165 256 165Q292 165 317 175Q322 190 314 210" fill="#D3D3D3"/>
  <!-- Eyes with wisdom lines -->
  <ellipse cx="234" cy="210" rx="5" ry="5" fill="#1A0A00"/>
  <ellipse cx="278" cy="210" rx="5" ry="5" fill="#1A0A00"/>
  <ellipse cx="236" cy="208" rx="2" ry="2" fill="#fff"/>
  <ellipse cx="280" cy="208" rx="2" ry="2" fill="#fff"/>
  <!-- Crow's feet -->
  <path d="M224 212L220 210M224 208L220 208" stroke="#C5A580" stroke-width="1" fill="none"/>
  <path d="M288 212L292 210M288 208L292 208" stroke="#C5A580" stroke-width="1" fill="none"/>
  <!-- Wise gentle smile -->
  <path d="M244 232Q256 240 268 232" fill="none" stroke="#C0765A" stroke-width="2" stroke-linecap="round"/>
</svg>`);

write('base_law_lord', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="body4" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1C1C3D"/>
      <stop offset="100%" stop-color="#0D0D2B"/>
    </linearGradient>
    <linearGradient id="skin4" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F0DCC0"/>
      <stop offset="100%" stop-color="#D4B896"/>
    </linearGradient>
  </defs>
  <!-- Gold-trimmed judicial robe -->
  <path d="M130 512V335c0-8 6-14 14-14h224c8 0 14 6 14 14v177H130z" fill="url(#body4)"/>
  <path d="M130 335H382" stroke="#DAA520" stroke-width="4"/>
  <path d="M140 420H372" stroke="#DAA520" stroke-width="2"/>
  <ellipse cx="256" cy="360" rx="105" ry="18" fill="#0A0A1E" opacity="0.5"/>
  <ellipse cx="256" cy="305" rx="100" ry="58" fill="url(#body4)"/>
  <!-- Gold braiding on shoulders -->
  <path d="M156 305Q156 280 170 270" fill="none" stroke="#DAA520" stroke-width="3"/>
  <path d="M356 305Q356 280 342 270" fill="none" stroke="#DAA520" stroke-width="3"/>
  <!-- White jabot -->
  <path d="M215 275L256 315L297 275L286 258H226L215 275Z" fill="#fff" stroke="#E8E8E8" stroke-width="1"/>
  <!-- Neck -->
  <rect x="236" y="245" width="40" height="20" rx="8" fill="url(#skin4)"/>
  <!-- Distinguished face -->
  <ellipse cx="256" cy="215" rx="54" ry="64" fill="url(#skin4)"/>
  <!-- Grey hair -->
  <path d="M202 210Q202 145 256 145Q310 145 310 210V225Q310 235 300 235H212Q202 235 202 225Z" fill="#808080"/>
  <path d="M202 210Q195 188 200 172Q225 160 256 160Q287 160 312 172Q317 188 310 210" fill="#A9A9A9"/>
  <!-- Eyes - intense -->
  <ellipse cx="235" cy="210" rx="5" ry="5.5" fill="#0A0A0A"/>
  <ellipse cx="277" cy="210" rx="5" ry="5.5" fill="#0A0A0A"/>
  <ellipse cx="237" cy="208" rx="2" ry="2" fill="#fff"/>
  <ellipse cx="279" cy="208" rx="2" ry="2" fill="#fff"/>
  <!-- Firm eyebrows -->
  <path d="M224 200Q236 196 246 200" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M266 200Q276 196 288 200" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Firm mouth -->
  <path d="M244 233H268" stroke="#C0765A" stroke-width="2" stroke-linecap="round"/>
</svg>`);

// ═══════════════════════════════════════════
// HAIR
// ═══════════════════════════════════════════

write('hair_barrister_wig', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="wig" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F5F5F5"/>
      <stop offset="100%" stop-color="#E0E0E0"/>
    </linearGradient>
  </defs>
  <!-- Barrister wig - classic white curled -->
  <path d="M186 230Q180 170 220 150Q240 140 256 138Q272 140 292 150Q332 170 326 230" fill="url(#wig)" stroke="#D0D0D0" stroke-width="2"/>
  <!-- Side curls -->
  <ellipse cx="185" cy="225" rx="22" ry="35" fill="url(#wig)" stroke="#D0D0D0" stroke-width="1.5"/>
  <ellipse cx="185" cy="260" rx="18" ry="30" fill="url(#wig)" stroke="#D0D0D0" stroke-width="1.5"/>
  <ellipse cx="327" cy="225" rx="22" ry="35" fill="url(#wig)" stroke="#D0D0D0" stroke-width="1.5"/>
  <ellipse cx="327" cy="260" rx="18" ry="30" fill="url(#wig)" stroke="#D0D0D0" stroke-width="1.5"/>
  <!-- Top curls -->
  <ellipse cx="220" cy="175" rx="25" ry="20" fill="url(#wig)" stroke="#D0D0D0" stroke-width="1.5"/>
  <ellipse cx="256" cy="168" rx="25" ry="20" fill="url(#wig)" stroke="#D0D0D0" stroke-width="1.5"/>
  <ellipse cx="292" cy="175" rx="25" ry="20" fill="url(#wig)" stroke="#D0D0D0" stroke-width="1.5"/>
  <!-- Pony tail at back -->
  <ellipse cx="256" cy="310" rx="35" ry="25" fill="url(#wig)" stroke="#D0D0D0" stroke-width="1.5"/>
  <ellipse cx="256" cy="340" rx="25" ry="20" fill="url(#wig)" stroke="#D0D0D0" stroke-width="1.5"/>
</svg>`);

write('hair_judge_full', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="jwig" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FAFAFA"/>
      <stop offset="100%" stop-color="#D8D8D8"/>
    </linearGradient>
  </defs>
  <!-- Full-bottomed judge wig -->
  <path d="M170 230Q160 160 210 140Q240 125 256 123Q272 125 302 140Q352 160 342 230" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="2"/>
  <!-- Massive side curls -->
  <ellipse cx="170" cy="220" rx="30" ry="45" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="1.5"/>
  <ellipse cx="170" cy="270" rx="28" ry="40" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="1.5"/>
  <ellipse cx="170" cy="315" rx="24" ry="35" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="1.5"/>
  <ellipse cx="342" cy="220" rx="30" ry="45" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="1.5"/>
  <ellipse cx="342" cy="270" rx="28" ry="40" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="1.5"/>
  <ellipse cx="342" cy="315" rx="24" ry="35" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="1.5"/>
  <!-- Top ornate curls -->
  <ellipse cx="210" cy="165" rx="30" ry="22" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="1.5"/>
  <ellipse cx="256" cy="155" rx="30" ry="22" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="1.5"/>
  <ellipse cx="302" cy="165" rx="30" ry="22" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="1.5"/>
  <!-- Back tails -->
  <ellipse cx="256" cy="350" rx="40" ry="30" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="1.5"/>
  <ellipse cx="256" cy="385" rx="30" ry="22" fill="url(#jwig)" stroke="#C0C0C0" stroke-width="1.5"/>
</svg>`);

write('hair_sleek', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="sleek" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1A0D00"/>
      <stop offset="50%" stop-color="#2C1810"/>
      <stop offset="100%" stop-color="#1A0D00"/>
    </linearGradient>
  </defs>
  <!-- Modern slicked-back hair -->
  <path d="M190 230Q185 170 220 150Q250 135 256 134Q262 135 292 150Q327 170 322 230V245H190Z" fill="url(#sleek)"/>
  <!-- Side part -->
  <path d="M220 150Q230 170 225 200Q220 220 215 245" fill="none" stroke="#3D2910" stroke-width="1.5"/>
  <!-- Hair texture lines -->
  <path d="M200 180Q220 175 256 172Q292 175 312 180" fill="none" stroke="#3D2910" stroke-width="1" opacity="0.5"/>
  <path d="M195 200Q225 195 256 192Q287 195 317 200" fill="none" stroke="#3D2910" stroke-width="1" opacity="0.5"/>
  <path d="M198 222Q228 218 256 215Q284 218 314 222" fill="none" stroke="#3D2910" stroke-width="1" opacity="0.5"/>
</svg>`);

write('hair_crown', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="crownGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFD700"/>
      <stop offset="50%" stop-color="#FFA500"/>
      <stop offset="100%" stop-color="#DAA520"/>
    </linearGradient>
    <radialGradient id="gem" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#FF0000"/>
      <stop offset="100%" stop-color="#8B0000"/>
    </radialGradient>
    <radialGradient id="gemB" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#1E90FF"/>
      <stop offset="100%" stop-color="#00008B"/>
    </radialGradient>
  </defs>
  <!-- Crown of Justice -->
  <path d="M180 280V230L220 190L256 220L292 190L332 230V280H180Z" fill="url(#crownGold)" stroke="#B8860B" stroke-width="3"/>
  <!-- Crown points -->
  <circle cx="220" cy="190" r="8" fill="url(#gem)"/>
  <circle cx="256" cy="185" r="8" fill="url(#gemB)"/>
  <circle cx="292" cy="190" r="8" fill="url(#gem)"/>
  <!-- Band detail -->
  <path d="M185 265H327" stroke="#B8860B" stroke-width="2"/>
  <path d="M185 275H327" stroke="#B8860B" stroke-width="2"/>
  <!-- Small gems on band -->
  <circle cx="200" cy="270" r="4" fill="#FF0000"/>
  <circle cx="230" cy="270" r="4" fill="#1E90FF"/>
  <circle cx="260" cy="270" r="4" fill="#FF0000"/>
  <circle cx="290" cy="270" r="4" fill="#1E90FF"/>
  <circle cx="312" cy="270" r="4" fill="#FF0000"/>
  <!-- Shine -->
  <path d="M200 200L215 210L200 220Z" fill="#FFF8DC" opacity="0.4"/>
  <path d="M240 195L252 205L240 215Z" fill="#FFF8DC" opacity="0.4"/>
  <path d="M276 195L264 205L276 215Z" fill="#FFF8DC" opacity="0.4"/>
</svg>`);

// ═══════════════════════════════════════════
// FACIAL
// ═══════════════════════════════════════════

write('facial_monocle', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Monocle on right eye -->
  <circle cx="275" cy="220" r="22" fill="none" stroke="#DAA520" stroke-width="4"/>
  <circle cx="275" cy="220" r="20" fill="#E8F4FD" opacity="0.3"/>
  <!-- Chain -->
  <path d="M297 225Q320 240 310 290Q305 310 290 310" fill="none" stroke="#DAA520" stroke-width="2.5"/>
  <path d="M297 218Q310 210 315 200" fill="none" stroke="#DAA520" stroke-width="2" opacity="0.5"/>
  <!-- Lens shine -->
  <path d="M266 212Q272 210 275 212" stroke="#fff" stroke-width="2" fill="none" opacity="0.6"/>
</svg>`);

write('facial_spectacles', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Spectacles -->
  <circle cx="234" cy="220" r="26" fill="none" stroke="#333" stroke-width="4"/>
  <circle cx="278" cy="220" r="26" fill="none" stroke="#333" stroke-width="4"/>
  <!-- Bridge -->
  <path d="M255 220Q256 216 260 220" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <!-- Arms -->
  <path d="M208 220Q195 218 185 215" fill="none" stroke="#333" stroke-width="3"/>
  <path d="M304 220Q317 218 327 215" fill="none" stroke="#333" stroke-width="3"/>
  <!-- Lens shine -->
  <path d="M224 212Q230 209 234 212" fill="none" stroke="#fff" stroke-width="2" opacity="0.5"/>
  <path d="M268 212Q274 209 278 212" fill="none" stroke="#fff" stroke-width="2" opacity="0.5"/>
</svg>`);

write('facial_blindfold', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="blindfold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1A1A2E"/>
      <stop offset="50%" stop-color="#2D2D4E"/>
      <stop offset="100%" stop-color="#1A1A2E"/>
    </linearGradient>
  </defs>
  <!-- Blindfold across eyes -->
  <path d="M215 218L234 215L268 215L297 218L299 224L268 227L234 227L213 224Z" fill="url(#blindfold)"/>
  <!-- Folds in fabric -->
  <path d="M225 218L256 223L287 218" fill="none" stroke="#3D3D5E" stroke-width="1.5"/>
  <path d="M225 222L256 227L287 222" fill="none" stroke="#3D3D5E" stroke-width="1.5"/>
  <!-- Tying knot at side -->
  <circle cx="215" cy="220" r="5" fill="#2D2D4E"/>
  <path d="M210 220Q195 225 190 235" fill="none" stroke="#2D2D4E" stroke-width="2.5"/>
  <path d="M210 220Q195 218 192 210" fill="none" stroke="#2D2D4E" stroke-width="2"/>
</svg>`);

// ═══════════════════════════════════════════
// CLOTHING TOP
// ═══════════════════════════════════════════

write('clothing_silk_qc_robe', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="qcRobe" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1A2E"/>
      <stop offset="100%" stop-color="#0D0D1A"/>
    </linearGradient>
  </defs>
  <!-- QC Silk Robe - black with gold trim -->
  <path d="M145 512V310Q145 300 155 300H357Q367 300 367 310V512H145Z" fill="url(#qcRobe)"/>
  <!-- Gold trim -->
  <path d="M145 310H367" stroke="#DAA520" stroke-width="4"/>
  <!-- Left lapel -->
  <path d="M155 300L230 390L290 390L290 512" fill="none" stroke="#DAA520" stroke-width="2"/>
  <path d="M367 300L290 390L230 390L230 512" fill="none" stroke="#DAA520" stroke-width="2"/>
  <!-- Shoulder pieces -->
  <path d="M155 300L180 270L220 280" fill="#1A1A2E" stroke="#DAA520" stroke-width="1.5"/>
  <path d="M357 300L332 270L292 280" fill="#1A1A2E" stroke="#DAA520" stroke-width="1.5"/>
</svg>`);

write('clothing_pupil_gown', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="pupil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2F2F3F"/>
      <stop offset="100%" stop-color="#1A1A28"/>
    </linearGradient>
  </defs>
  <!-- Pupil Gown - simpler dark gown -->
  <path d="M155 512V325Q155 315 165 315H347Q357 315 357 325V512H155Z" fill="url(#pupil)"/>
  <!-- Simple collar -->
  <path d="M200 315L256 355L312 315" fill="none" stroke="#444" stroke-width="2"/>
  <path d="M230 315L256 345L282 315" fill="#3A3A4A" stroke="none"/>
</svg>`);

write('clothing_scarlet_robe', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="scarlet" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#CC0000"/>
      <stop offset="100%" stop-color="#660000"/>
    </linearGradient>
  </defs>
  <!-- Scarlet judge robe -->
  <path d="M140 512V300Q140 290 150 290H362Q372 290 372 300V512H140Z" fill="url(#scarlet)"/>
  <!-- White ermine trim -->
  <path d="M140 300H372" stroke="#fff" stroke-width="6"/>
  <circle cx="160" cy="298" r="5" fill="#fff"/>
  <circle cx="180" cy="298" r="5" fill="#fff"/>
  <circle cx="200" cy="298" r="5" fill="#fff"/>
  <circle cx="312" cy="298" r="5" fill="#fff"/>
  <circle cx="332" cy="298" r="5" fill="#fff"/>
  <circle cx="352" cy="298" r="5" fill="#fff"/>
  <!-- Black fur collar -->
  <path d="M200 290L230 320L282 320L312 290" fill="#1A1A1A" stroke="#333" stroke-width="1"/>
  <path d="M225 290L245 332L267 332L287 290" fill="#2D2D2D" stroke="none"/>
</svg>`);

// ═══════════════════════════════════════════
// CLOTHING BOTTOM
// ═══════════════════════════════════════════

write('clothing_pinstripe', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <pattern id="pinstripes" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill="#2C2C3E"/>
      <line x1="6" y1="0" x2="6" y2="12" stroke="#555" stroke-width="1" opacity="0.4"/>
    </pattern>
  </defs>
  <!-- Pinstripe trousers -->
  <path d="M170 512V350H342V512H170Z" fill="url(#pinstripes)"/>
  <path d="M256 350V512" stroke="#444" stroke-width="2"/>
</svg>`);

write('clothing_ermine_trim', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="ermine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8B0000"/>
      <stop offset="100%" stop-color="#500000"/>
    </linearGradient>
  </defs>
  <!-- Ermine-trimmed robe bottom -->
  <path d="M155 350V512H357V350H155Z" fill="url(#ermine)"/>
  <!-- Ermine spots -->
  <circle cx="200" cy="380" r="6" fill="#fff" opacity="0.9"/>
  <circle cx="240" cy="370" r="5" fill="#fff" opacity="0.9"/>
  <circle cx="280" cy="380" r="6" fill="#fff" opacity="0.9"/>
  <circle cx="320" cy="370" r="5" fill="#fff" opacity="0.9"/>
  <circle cx="180" cy="420" r="5" fill="#fff" opacity="0.8"/>
  <circle cx="220" cy="430" r="6" fill="#fff" opacity="0.8"/>
  <circle cx="260" cy="420" r="5" fill="#fff" opacity="0.8"/>
  <circle cx="300" cy="430" r="6" fill="#fff" opacity="0.8"/>
  <circle cx="340" cy="420" r="5" fill="#fff" opacity="0.8"/>
  <circle cx="200" cy="470" r="5" fill="#fff" opacity="0.7"/>
  <circle cx="256" cy="460" r="6" fill="#fff" opacity="0.7"/>
  <circle cx="310" cy="470" r="5" fill="#fff" opacity="0.7"/>
  <!-- Bottom ermine edge -->
  <path d="M155 505H357" stroke="#fff" stroke-width="10" opacity="0.9"/>
  <circle cx="175" cy="508" r="6" fill="#fff" opacity="0.9"/>
  <circle cx="210" cy="508" r="6" fill="#fff" opacity="0.9"/>
  <circle cx="245" cy="508" r="6" fill="#fff" opacity="0.9"/>
  <circle cx="280" cy="508" r="6" fill="#fff" opacity="0.9"/>
  <circle cx="315" cy="508" r="6" fill="#fff" opacity="0.9"/>
</svg>`);

// ═══════════════════════════════════════════
// ACCESSORIES
// ═══════════════════════════════════════════

write('accessory_gavel', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="gavelGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFD700"/>
      <stop offset="100%" stop-color="#DAA520"/>
    </linearGradient>
    <linearGradient id="gavelWood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8B4513"/>
      <stop offset="50%" stop-color="#A0522D"/>
      <stop offset="100%" stop-color="#6B3410"/>
    </linearGradient>
  </defs>
  <!-- Gavel held to side - ornate golden handle -->
  <rect x="160" y="390" width="200" height="22" rx="6" fill="url(#gavelWood)"/>
  <rect x="220" y="370" width="80" height="25" rx="4" fill="url(#gavelGold)"/>
  <rect x="210" y="375" width="100" height="15" rx="3" fill="#B8860B"/>
  <!-- Handle cap -->
  <circle cx="260" cy="390" r="8" fill="url(#gavelGold)"/>
  <circle cx="260" cy="412" r="8" fill="url(#gavelGold)"/>
</svg>`);

write('accessory_scales', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="scaleGold" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#FFD700"/>
      <stop offset="100%" stop-color="#B8860B"/>
    </radialGradient>
  </defs>
  <!-- Scales of Justice -->
  <!-- Central pillar -->
  <rect x="250" y="300" width="12" height="140" rx="3" fill="url(#scaleGold)"/>
  <!-- Base -->
  <path d="M230 440L256 460L282 440" fill="none" stroke="url(#scaleGold)" stroke-width="8" stroke-linecap="round"/>
  <!-- Top beam -->
  <path d="M170 290L342 290" stroke="url(#scaleGold)" stroke-width="8" stroke-linecap="round"/>
  <!-- Left pan chains -->
  <path d="M190 290L200 340" stroke="#DAA520" stroke-width="3"/>
  <path d="M205 290L200 340" stroke="#DAA520" stroke-width="3"/>
  <!-- Right pan chains -->
  <path d="M322 290L312 340" stroke="#DAA520" stroke-width="3"/>
  <path d="M307 290L312 340" stroke="#DAA520" stroke-width="3"/>
  <!-- Left pan -->
  <path d="M180 340Q200 360 220 340" fill="none" stroke="url(#scaleGold)" stroke-width="6"/>
  <!-- Right pan -->
  <path d="M292 340Q312 355 332 340" fill="none" stroke="url(#scaleGold)" stroke-width="6"/>
  <!-- Pivot point -->
  <circle cx="256" cy="290" r="6" fill="url(#scaleGold)" stroke="#B8860B" stroke-width="2"/>
</svg>`);

write('accessory_quill', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Feather quill pen -->
  <defs>
    <linearGradient id="quill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#D4D4D4"/>
    </linearGradient>
  </defs>
  <!-- Feather vane -->
  <path d="M230 170Q200 200 190 300Q200 280 210 260Q215 240 230 170Z" fill="url(#quill)" stroke="#999" stroke-width="1"/>
  <path d="M270 150Q300 190 310 300Q290 260 280 240Q275 220 270 150Z" fill="#E8E8E8" stroke="#999" stroke-width="1"/>
  <!-- Rachis (shaft) -->
  <line x1="250" y1="160" x2="255" y2="420" stroke="#666" stroke-width="3"/>
  <!-- Nib -->
  <path d="M253 420L255 450L257 420Z" fill="#DAA520" stroke="#B8860B" stroke-width="1"/>
  <!-- Ink tip -->
  <ellipse cx="255" cy="448" rx="3" ry="2" fill="#1A1A2E"/>
</svg>`);

write('accessory_sword', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="blade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8E8E8"/>
      <stop offset="100%" stop-color="#AAA"/>
    </linearGradient>
    <linearGradient id="hilt" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFD700"/>
      <stop offset="100%" stop-color="#DAA520"/>
    </linearGradient>
  </defs>
  <!-- Sword of Truth -->
  <!-- Blade -->
  <path d="M248 130L256 50L264 130V320Z" fill="url(#blade)" stroke="#888" stroke-width="1"/>
  <!-- Central fuller -->
  <line x1="256" y1="80" x2="256" y2="310" stroke="#CCC" stroke-width="1.5"/>
  <!-- Crossguard -->
  <path d="M220 320L292 320" stroke="url(#hilt)" stroke-width="14" stroke-linecap="round"/>
  <rect x="248" y="320" width="16" height="10" fill="url(#hilt)"/>
  <!-- Grip -->
  <rect x="250" y="330" width="12" height="30" rx="2" fill="#8B4513"/>
  <path d="M252 338H260M252 346H260M252 354H260" stroke="#DAA520" stroke-width="1"/>
  <!-- Pommel -->
  <circle cx="256" cy="362" r="8" fill="url(#hilt)"/>
  <circle cx="256" cy="362" r="4" fill="#FF0000" opacity="0.8"/>
</svg>`);

// ═══════════════════════════════════════════
// BACKGROUNDS
// ═══════════════════════════════════════════

write('background_courtroom', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="court" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2C1810"/>
      <stop offset="50%" stop-color="#3D2B1F"/>
      <stop offset="100%" stop-color="#8B6914"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#court)"/>
  <!-- Wood paneling -->
  <rect x="0" y="0" width="512" height="300" fill="#5C3A1E" opacity="0.5"/>
  <rect x="0" y="300" width="512" height="212" fill="#4A2A10" opacity="0.5"/>
  <!-- Panels -->
  <rect x="30" y="30" width="200" height="240" fill="none" stroke="#8B6914" stroke-width="2" opacity="0.3"/>
  <rect x="282" y="30" width="200" height="240" fill="none" stroke="#8B6914" stroke-width="2" opacity="0.3"/>
  <!-- Royal crest silhouette -->
  <circle cx="256" cy="160" r="50" fill="none" stroke="#DAA520" stroke-width="3" opacity="0.4"/>
  <path d="M230 190L256 170L282 190" fill="none" stroke="#DAA520" stroke-width="2" opacity="0.3"/>
  <!-- Bench -->
  <rect x="100" y="400" width="312" height="60" rx="5" fill="#6B4226"/>
  <rect x="120" y="400" width="272" height="8" fill="#8B6914"/>
  <!-- Witness box (right) -->
  <rect x="380" y="350" width="80" height="110" rx="3" fill="none" stroke="#8B6914" stroke-width="2" opacity="0.4"/>
</svg>`);

write('background_library', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="lib" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3D2910"/>
      <stop offset="100%" stop-color="#5C4420"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="#2C1810"/>
  <!-- Bookshelves -->
  <g fill="#5C3A1E" stroke="#4A2A10" stroke-width="2">
    <rect x="10" y="10" width="150" height="492" rx="5"/>
    <rect x="180" y="10" width="150" height="492" rx="5"/>
    <rect x="350" y="10" width="150" height="492" rx="5"/>
  </g>
  <!-- Shelves -->
  <g stroke="#4A2A10" stroke-width="3">
    <line x1="15" y1="120" x2="155" y2="120"/>
    <line x1="15" y1="240" x2="155" y2="240"/>
    <line x1="15" y1="360" x2="155" y2="360"/>
    <line x1="185" y1="120" x2="325" y2="120"/>
    <line x1="185" y1="240" x2="325" y2="240"/>
    <line x1="185" y1="360" x2="325" y2="360"/>
    <line x1="355" y1="120" x2="495" y2="120"/>
    <line x1="355" y1="240" x2="495" y2="240"/>
    <line x1="355" y1="360" x2="495" y2="360"/>
  </g>
  <!-- Books - left shelf -->
  <g>
    <rect x="20" y="20" width="12" height="94" rx="1" fill="#C0392B"/>
    <rect x="36" y="20" width="10" height="94" rx="1" fill="#2980B9"/>
    <rect x="50" y="30" width="14" height="84" rx="1" fill="#27AE60"/>
    <rect x="68" y="25" width="8" height="89" rx="1" fill="#F39C12"/>
    <rect x="80" y="20" width="11" height="94" rx="1" fill="#8E44AD"/>
    <rect x="95" y="35" width="13" height="79" rx="1" fill="#E74C3C"/>
    <rect x="112" y="20" width="9" height="94" rx="1" fill="#1ABC9C"/>
    <rect x="125" y="28" width="12" height="86" rx="1" fill="#D35400"/>
    <rect x="141" y="20" width="10" height="94" rx="1" fill="#2C3E50"/>
  </g>
  <!-- Books - middle shelf -->
  <g>
    <rect x="185" y="20" width="14" height="94" rx="1" fill="#C0392B"/>
    <rect x="203" y="22" width="10" height="92" rx="1" fill="#2980B9"/>
    <rect x="217" y="18" width="12" height="96" rx="1" fill="#F39C12"/>
    <rect x="233" y="25" width="9" height="89" rx="1" fill="#27AE60"/>
    <rect x="246" y="20" width="13" height="94" rx="1" fill="#9B59B6"/>
    <rect x="263" y="30" width="11" height="84" rx="1" fill="#E67E22"/>
    <rect x="278" y="20" width="10" height="94" rx="1" fill="#1ABC9C"/>
    <rect x="292" y="24" width="12" height="90" rx="1" fill="#E74C3C"/>
    <rect x="308" y="20" width="10" height="94" rx="1" fill="#34495E"/>
  </g>
  <!-- Books - right shelf -->
  <g>
    <rect x="355" y="20" width="11" height="94" rx="1" fill="#8E44AD"/>
    <rect x="370" y="28" width="13" height="86" rx="1" fill="#D35400"/>
    <rect x="387" y="20" width="9" height="94" rx="1" fill="#2980B9"/>
    <rect x="400" y="32" width="12" height="82" rx="1" fill="#C0392B"/>
    <rect x="416" y="20" width="8" height="94" rx="1" fill="#27AE60"/>
    <rect x="428" y="25" width="14" height="89" rx="1" fill="#F39C12"/>
    <rect x="446" y="20" width="10" height="94" rx="1" fill="#3498DB"/>
    <rect x="460" y="30" width="11" height="84" rx="1" fill="#E74C3C"/>
    <rect x="475" y="20" width="12" height="94" rx="1" fill="#1ABC9C"/>
  </g>
</svg>`);

write('background_old_bailey', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4A90D9"/>
      <stop offset="100%" stop-color="#87CEEB"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#sky)"/>
  <!-- Old Bailey building silhouette -->
  <rect x="60" y="200" width="392" height="312" fill="#5C4033"/>
  <!-- Dome -->
  <path d="M160 200Q256 80 352 200Z" fill="#6B4226"/>
  <!-- Lady Justice statue on top -->
  <circle cx="256" cy="130" r="8" fill="#DAA520"/>
  <rect x="254" y="138" width="4" height="30" fill="#DAA520"/>
  <!-- Columns -->
  <rect x="80" y="250" width="20" height="262" fill="#8B6914"/>
  <rect x="140" y="250" width="20" height="262" fill="#8B6914"/>
  <rect x="200" y="250" width="20" height="262" fill="#8B6914"/>
  <rect x="292" y="250" width="20" height="262" fill="#8B6914"/>
  <rect x="352" y="250" width="20" height="262" fill="#8B6914"/>
  <rect x="412" y="250" width="20" height="262" fill="#8B6914"/>
  <!-- Pediment -->
  <rect x="60" y="230" width="392" height="20" fill="#4A2A10"/>
  <!-- Inscription -->
  <text x="256" y="375" text-anchor="middle" fill="#DAA520" font-size="12" font-weight="bold" opacity="0.6">OLD BAILEY</text>
  <!-- Ground -->
  <rect x="0" y="480" width="512" height="32" fill="#4A7C2E"/>
</svg>`);

write('background_supreme_court', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="supremeSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A237E"/>
      <stop offset="100%" stop-color="#283593"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#supremeSky)"/>
  <!-- Supreme Court columns - neoclassical -->
  <rect x="40" y="260" width="24" height="252" fill="#FAFAFA" opacity="0.9"/>
  <rect x="104" y="260" width="24" height="252" fill="#FAFAFA" opacity="0.9"/>
  <rect x="168" y="260" width="24" height="252" fill="#FAFAFA" opacity="0.9"/>
  <rect x="232" y="260" width="24" height="252" fill="#FAFAFA" opacity="0.9"/>
  <rect x="256" y="260" width="24" height="252" fill="#FAFAFA" opacity="0.9"/>
  <rect x="320" y="260" width="24" height="252" fill="#FAFAFA" opacity="0.9"/>
  <rect x="384" y="260" width="24" height="252" fill="#FAFAFA" opacity="0.9"/>
  <rect x="448" y="260" width="24" height="252" fill="#FAFAFA" opacity="0.9"/>
  <!-- Pediment / triangle -->
  <path d="M30 260L256 160L482 260Z" fill="#FAFAFA" opacity="0.9"/>
  <path d="M60 245L256 155L452 245Z" fill="none" stroke="#DAA520" stroke-width="2" opacity="0.5"/>
  <!-- "Equal Justice Under Law" -->
  <text x="256" y="240" text-anchor="middle" fill="#DAA520" font-size="10" font-weight="bold" opacity="0.7">EQUAL JUSTICE UNDER LAW</text>
  <!-- Steps -->
  <rect x="20" y="420" width="472" height="15" fill="#E0E0E0" opacity="0.5"/>
  <rect x="10" y="440" width="492" height="15" fill="#E0E0E0" opacity="0.4"/>
  <rect x="0" y="460" width="512" height="52" fill="#E0E0E0" opacity="0.3"/>
</svg>`);

write('background_rainbow', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FF0000"/>
      <stop offset="16%" stop-color="#FF8800"/>
      <stop offset="33%" stop-color="#FFFF00"/>
      <stop offset="50%" stop-color="#00CC00"/>
      <stop offset="66%" stop-color="#0088FF"/>
      <stop offset="83%" stop-color="#4400CC"/>
      <stop offset="100%" stop-color="#8800AA"/>
    </linearGradient>
  </defs>
  <!-- Rainbow gradient background -->
  <rect width="512" height="512" fill="url(#rainbow)" opacity="0.12"/>
  <!-- Rainbow arcs -->
  <path d="M-20 500Q256 80 532 500" fill="none" stroke="#FF0000" stroke-width="20" opacity="0.25"/>
  <path d="M0 500Q256 100 512 500" fill="none" stroke="#FF8800" stroke-width="20" opacity="0.25"/>
  <path d="M20 500Q256 120 492 500" fill="none" stroke="#FFFF00" stroke-width="20" opacity="0.25"/>
  <path d="M40 500Q256 140 472 500" fill="none" stroke="#00CC00" stroke-width="20" opacity="0.25"/>
  <path d="M60 500Q256 160 452 500" fill="none" stroke="#0088FF" stroke-width="20" opacity="0.25"/>
  <path d="M80 500Q256 180 432 500" fill="none" stroke="#4400CC" stroke-width="20" opacity="0.25"/>
  <path d="M100 500Q256 200 412 500" fill="none" stroke="#8800AA" stroke-width="20" opacity="0.25"/>
  <!-- Sparkle effects -->
  <circle cx="120" cy="180" r="3" fill="#FFD700" opacity="0.6"/>
  <circle cx="380" cy="150" r="4" fill="#FFD700" opacity="0.5"/>
  <circle cx="200" cy="100" r="3" fill="#FFD700" opacity="0.7"/>
  <circle cx="340" cy="200" r="2" fill="#FFD700" opacity="0.6"/>
  <circle cx="80" cy="250" r="3" fill="#FFD700" opacity="0.4"/>
  <circle cx="430" cy="230" r="3" fill="#FFD700" opacity="0.5"/>
</svg>`);

// ═══════════════════════════════════════════
// PETS
// ═══════════════════════════════════════════

write('pet_phoenix', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="phoenixFire" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FF4500"/>
      <stop offset="30%" stop-color="#FFD700"/>
      <stop offset="70%" stop-color="#FF6347"/>
      <stop offset="100%" stop-color="#FF1493"/>
    </linearGradient>
  </defs>
  <!-- Phoenix of Precedent -->
  <!-- Body -->
  <ellipse cx="370" cy="370" rx="25" ry="35" fill="url(#phoenixFire)" transform="rotate(-20,370,370)"/>
  <!-- Head -->
  <circle cx="390" cy="330" r="18" fill="#FFD700"/>
  <!-- Crest -->
  <path d="M390 312Q395 295 400 312Q405 295 410 312Z" fill="#FF4500"/>
  <!-- Eye -->
  <circle cx="396" cy="328" r="3" fill="#8B0000"/>
  <circle cx="397" cy="327" r="1" fill="#fff"/>
  <!-- Beak -->
  <path d="M408 332L418 336L408 340Z" fill="#FFA500"/>
  <!-- Wings - spread and fiery -->
  <path d="M345 350Q300 280 280 220Q320 300 345 350Z" fill="#FF6347" opacity="0.8"/>
  <path d="M345 350Q310 310 290 280Q330 330 345 350Z" fill="#FFD700" opacity="0.7"/>
  <path d="M395 350Q440 280 460 220Q420 300 395 350Z" fill="#FF6347" opacity="0.8"/>
  <path d="M395 350Q430 310 450 280Q410 330 395 350Z" fill="#FFD700" opacity="0.7"/>
  <!-- Tail feathers -->
  <path d="M355 400Q340 450 320 500" stroke="#FF4500" stroke-width="4" fill="none" opacity="0.8"/>
  <path d="M365 400Q360 455 355 510" stroke="#FFD700" stroke-width="4" fill="none" opacity="0.8"/>
  <path d="M375 400Q380 455 390 510" stroke="#FF1493" stroke-width="4" fill="none" opacity="0.8"/>
  <!-- Fire particles -->
  <circle cx="300" cy="250" r="5" fill="#FFD700" opacity="0.4"/>
  <circle cx="280" cy="300" r="3" fill="#FFA500" opacity="0.5"/>
  <circle cx="440" cy="260" r="4" fill="#FFD700" opacity="0.4"/>
</svg>`);

write('pet_owl', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Wise Owl -->
  <!-- Body -->
  <ellipse cx="370" cy="400" rx="35" ry="45" fill="#8B7355"/>
  <ellipse cx="370" cy="400" rx="20" ry="35" fill="#D2B48C" opacity="0.5"/>
  <!-- Head -->
  <ellipse cx="370" cy="350" rx="30" ry="28" fill="#8B7355"/>
  <!-- Ear tufts -->
  <path d="M350 328L340 310L355 320Z" fill="#6B5335"/>
  <path d="M390 328L400 310L385 320Z" fill="#6B5335"/>
  <!-- Face disc -->
  <ellipse cx="370" cy="350" rx="22" ry="20" fill="#D2B48C"/>
  <!-- Big wise eyes -->
  <circle cx="358" cy="348" r="9" fill="#FFD700"/>
  <circle cx="382" cy="348" r="9" fill="#FFD700"/>
  <circle cx="358" cy="348" r="4" fill="#1A1A2E"/>
  <circle cx="382" cy="348" r="4" fill="#1A1A2E"/>
  <circle cx="360" cy="346" r="1.5" fill="#fff"/>
  <circle cx="384" cy="346" r="1.5" fill="#fff"/>
  <!-- Beak -->
  <path d="M367 357L370 362L373 357Z" fill="#F5A623"/>
  <!-- Spectacles -->
  <circle cx="358" cy="348" r="11" fill="none" stroke="#333" stroke-width="1.5"/>
  <circle cx="382" cy="348" r="11" fill="none" stroke="#333" stroke-width="1.5"/>
  <line x1="369" y1="348" x2="371" y2="348" stroke="#333" stroke-width="1.5"/>
  <!-- Wing -->
  <path d="M330 380Q340 420 370 430" fill="none" stroke="#6B5335" stroke-width="3"/>
</svg>`);

write('pet_bulldog', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Tenacious Bulldog -->
  <!-- Body -->
  <ellipse cx="360" cy="420" rx="40" ry="35" fill="#C4A87C"/>
  <ellipse cx="360" cy="410" rx="30" ry="20" fill="#D4B88C" opacity="0.5"/>
  <!-- Head - big bulldog head -->
  <ellipse cx="355" cy="365" rx="32" ry="28" fill="#C4A87C"/>
  <!-- Jaw -->
  <ellipse cx="355" cy="380" rx="25" ry="15" fill="#E8D5B7"/>
  <!-- Ears -->
  <path d="M328 350Q322 330 334 340Z" fill="#8B6F47"/>
  <path d="M382 350Q388 330 376 340Z" fill="#8B6F47"/>
  <!-- Eyes -->
  <circle cx="340" cy="358" r="6" fill="#1A1A2E"/>
  <circle cx="370" cy="358" r="6" fill="#1A1A2E"/>
  <circle cx="342" cy="356" r="2" fill="#fff"/>
  <circle cx="372" cy="356" r="2" fill="#fff"/>
  <!-- Nose -->
  <ellipse cx="355" cy="370" rx="6" ry="4" fill="#2C1810"/>
  <!-- Mouth -->
  <path d="M340 378Q348 384 355 382Q362 384 370 378" fill="none" stroke="#2C1810" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Collar -->
  <rect x="330" y="390" width="50" height="8" rx="2" fill="#C0392B"/>
  <circle cx="355" cy="400" r="4" fill="#DAA520"/>
  <!-- Tail stub -->
  <path d="M395 405Q405 395 398 390" fill="none" stroke="#C4A87C" stroke-width="4" stroke-linecap="round"/>
  <!-- Paws -->
  <ellipse cx="335" cy="455" rx="12" ry="6" fill="#C4A87C"/>
  <ellipse cx="385" cy="455" rx="12" ry="6" fill="#C4A87C"/>
</svg>`);

write('pet_griffin', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="griffinBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#DAA520"/>
      <stop offset="100%" stop-color="#8B6914"/>
    </linearGradient>
  </defs>
  <!-- Griffin of the Crown -->
  <!-- Lion body -->
  <ellipse cx="360" cy="410" rx="40" ry="35" fill="url(#griffinBody)"/>
  <!-- Eagle head -->
  <circle cx="370" cy="340" r="22" fill="#F5F5F5"/>
  <!-- Crown on head -->
  <path d="M355 322L362 315L370 318L378 315L385 322V325H355Z" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>
  <!-- Eagle eyes -->
  <circle cx="362" cy="336" r="4" fill="#FF4500"/>
  <circle cx="378" cy="336" r="4" fill="#FF4500"/>
  <circle cx="363" cy="335" r="1.5" fill="#fff"/>
  <circle cx="379" cy="335" r="1.5" fill="#fff"/>
  <!-- Beak -->
  <path d="M368 345L370 355L372 345Z" fill="#FFA500"/>
  <!-- Eagle wings -->
  <path d="M320 370Q280 310 260 250Q310 330 320 370Z" fill="#DAA520" opacity="0.7"/>
  <path d="M320 370Q300 340 280 320Q315 345 320 370Z" fill="#F0E68C" opacity="0.5"/>
  <path d="M400 370Q440 310 460 250Q410 330 400 370Z" fill="#DAA520" opacity="0.7"/>
  <path d="M400 370Q420 340 440 320Q405 345 400 370Z" fill="#F0E68C" opacity="0.5"/>
  <!-- Lion tail -->
  <path d="M315 420Q290 440 280 460" stroke="url(#griffinBody)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="278" cy="462" rx="8" ry="6" fill="#8B6914"/>
  <!-- Front talons -->
  <path d="M345 430L335 445L342 448L338 455L347 452L352 458L355 448" fill="#F5F5F5"/>
  <path d="M375 430L385 445L378 448L382 455L373 452L368 458L365 448" fill="#F5F5F5"/>
</svg>`);

// ═══════════════════════════════════════════
// EMOTES
// ═══════════════════════════════════════════

write('emote_objection', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- OBJECTION speech bubble -->
  <rect x="30" y="20" width="250" height="100" rx="20" fill="#fff" stroke="#DAA520" stroke-width="4"/>
  <polygon points="160,120 130,155 175,120" fill="#fff"/>
  <polygon points="160,120 130,155 175,120" fill="none" stroke="#DAA520" stroke-width="3"/>
  <text x="155" y="52" text-anchor="middle" fill="#CC0000" font-weight="bold" font-size="22">OBJECTION!</text>
  <!-- Exclamation effect -->
  <path d="M310 60L325 20L340 60Z" fill="#FF0000" opacity="0.7"/>
  <path d="M310 60L295 30L310 40Z" fill="#CC0000" opacity="0.5"/>
  <path d="M340 60L355 30L340 40Z" fill="#CC0000" opacity="0.5"/>
  <!-- Small sparkles -->
  <circle cx="350" cy="80" r="4" fill="#FFD700" opacity="0.6"/>
  <circle cx="370" cy="60" r="3" fill="#FFA500" opacity="0.5"/>
</svg>`);

write('emote_sustained', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- SUSTAINED speech bubble -->
  <rect x="30" y="20" width="250" height="90" rx="20" fill="#E8F5E9" stroke="#4CAF50" stroke-width="4"/>
  <polygon points="160,110 130,145 175,110" fill="#E8F5E9"/>
  <polygon points="160,110 130,145 175,110" fill="none" stroke="#4CAF50" stroke-width="3"/>
  <text x="155" y="50" text-anchor="middle" fill="#2E7D32" font-weight="bold" font-size="20">SUSTAINED!</text>
  <!-- Checkmark effect -->
  <path d="M320 50L340 70L370 30" fill="none" stroke="#4CAF50" stroke-width="6" stroke-linecap="round"/>
  <!-- Green sparkles -->
  <circle cx="380" cy="80" r="3" fill="#81C784" opacity="0.6"/>
  <circle cx="350" cy="90" r="4" fill="#A5D6A7" opacity="0.5"/>
  <circle cx="390" cy="50" r="3" fill="#66BB6A" opacity="0.4"/>
</svg>`);

write('emote_overruled', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- OVERRULED speech bubble -->
  <rect x="30" y="20" width="250" height="100" rx="20" fill="#FFF3E0" stroke="#FF9800" stroke-width="4"/>
  <polygon points="160,120 130,155 175,120" fill="#FFF3E0"/>
  <polygon points="160,120 130,155 175,120" fill="none" stroke="#FF9800" stroke-width="3"/>
  <text x="155" y="50" text-anchor="middle" fill="#E65100" font-weight="bold" font-size="22">OVERRULED!</text>
  <!-- Gavel slam effect -->
  <path d="M310 40L340 50L330 65L300 55Z" fill="#8B4513" transform="rotate(-15,320,50)"/>
  <path d="M320 50L340 110" stroke="#8B4513" stroke-width="4" transform="rotate(-15,320,50)"/>
  <!-- Impact lines -->
  <path d="M360 80L380 70M370 95L385 90M355 100L360 115" stroke="#FF9800" stroke-width="2" opacity="0.6"/>
</svg>`);

console.log('\n✓ All 31 avatar assets generated in public/avatars/');
