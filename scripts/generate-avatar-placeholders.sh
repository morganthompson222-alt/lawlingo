#!/bin/bash
# Generate placeholder avatar SVGs
# Run from project root: bash scripts/generate-avatar-placeholders.sh

AVATAR_DIR="public/avatars"
mkdir -p "$AVATAR_DIR"

color_for() {
  case "$1" in
    base)       echo "#4A90D9" ;;
    hair)       echo "#8B5E3C" ;;
    facial)     echo "#C4A35A" ;;
    clothing*)  echo "#2F4F4F" ;;
    accessory)  echo "#DAA520" ;;
    background) echo "#6B8E23" ;;
    pet)        echo "#CD853F" ;;
    emote)      echo "#FF6B6B" ;;
    *)          echo "#888888" ;;
  esac
}

generate() {
  local name=$1
  local slot_type=$2
  local label=$3
  local color
  color=$(color_for "$slot_type")

  if [[ ! -f "$AVATAR_DIR/${name}.svg" ]]; then
    echo "Creating placeholder: ${name}.svg"
    cat > "$AVATAR_DIR/${name}.svg" << SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="transparent"/>
  <circle cx="256" cy="220" r="120" fill="${color}" opacity="0.15"/>
  <circle cx="256" cy="220" r="120" fill="none" stroke="${color}" stroke-width="4" opacity="0.6"/>
  <text x="256" y="225" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" fill="${color}" font-weight="600">${label}</text>
</svg>
SVGEOF
  fi
}

generate "base_default" "base" "Law Student"
generate "base_barrister" "base" "Barrister"
generate "base_judge" "base" "Judge"
generate "base_law_lord" "base" "Law Lord"
generate "hair_barrister_wig" "hair" "Barrister Wig"
generate "hair_judge_full" "hair" "Full Wig"
generate "hair_sleek" "hair" "Sleek Cut"
generate "hair_crown" "hair" "Crown"
generate "facial_monocle" "facial" "Monocle"
generate "facial_spectacles" "facial" "Spectacles"
generate "facial_blindfold" "facial" "Blindfold"
generate "clothing_silk_qc_robe" "clothing" "Silk QC Robe"
generate "clothing_pupil_gown" "clothing" "Pupil Gown"
generate "clothing_scarlet_robe" "clothing" "Scarlet Robe"
generate "clothing_pinstripe" "clothing" "Pinstripe"
generate "clothing_ermine_trim" "clothing" "Ermine Trim"
generate "accessory_gavel" "accessory" "Gavel"
generate "accessory_scales" "accessory" "Scales"
generate "accessory_quill" "accessory" "Quill"
generate "accessory_sword" "accessory" "Sword"
generate "background_courtroom" "background" "Courtroom"
generate "background_library" "background" "Library"
generate "background_old_bailey" "background" "Old Bailey"
generate "background_supreme_court" "background" "Supreme Court"
generate "background_rainbow" "background" "Rainbow"
generate "pet_phoenix" "pet" "Phoenix"
generate "pet_owl" "pet" "Owl"
generate "pet_bulldog" "pet" "Bulldog"
generate "pet_griffin" "pet" "Griffin"
generate "emote_objection" "emote" "Objection!"
generate "emote_sustained" "emote" "Sustained!"
generate "emote_overruled" "emote" "Overruled!"

echo "Done! Placeholder SVGs created in $AVATAR_DIR"
