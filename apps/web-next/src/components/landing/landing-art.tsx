import type { CSSProperties } from "react"

export type StickerName = "coin" | "case" | "check" | "rocket" | "cv" | "star" | "sparkle"

/** Inline style that also accepts CSS custom properties (e.g. `--r`). */
export function vars(style: Record<string, string | number>) {
  return style as CSSProperties
}

export function Sticker({ name }: { name: StickerName }) {
  return (
    <svg aria-hidden>
      <use href={`#s-${name}`} />
    </svg>
  )
}

/** Grain/blur filters and reusable sticker symbols referenced with <use href="#s-…">. */
export function LandingArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.1"
            numOctaves={2}
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="g2">
            <feFuncA type="table" tableValues="0 0.45" />
          </feComponentTransfer>
          <feComposite in="g2" in2="SourceGraphic" operator="in" result="gc" />
          <feBlend in="SourceGraphic" in2="gc" mode="multiply" />
        </filter>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id="soft2" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>

        <symbol id="s-coin" viewBox="0 0 110 110">
          <ellipse cx="58" cy="60" rx="46" ry="46" fill="#000" />
          <circle cx="52" cy="52" r="46" fill="#ffd731" stroke="#000" strokeWidth="2" />
          <circle cx="52" cy="52" r="34" fill="none" stroke="#000" strokeWidth="2" />
          <circle cx="40" cy="46" r="7" fill="#fff" stroke="#000" strokeWidth="2" />
          <circle cx="62" cy="46" r="7" fill="#fff" stroke="#000" strokeWidth="2" />
          <circle cx="41" cy="47" r="3" />
          <circle cx="63" cy="47" r="3" />
          <path
            d="M36 64 Q52 78 68 64"
            fill="none"
            stroke="#000"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </symbol>
        <symbol id="s-case" viewBox="0 0 130 110">
          <rect x="12" y="34" width="114" height="72" rx="16" fill="#000" />
          <rect
            x="42"
            y="4"
            width="44"
            height="24"
            rx="9"
            fill="#fff"
            stroke="#000"
            strokeWidth="2"
          />
          <rect
            x="50"
            y="11"
            width="28"
            height="17"
            rx="5"
            fill="#dceeff"
            stroke="#000"
            strokeWidth="2"
          />
          <rect
            x="6"
            y="26"
            width="114"
            height="74"
            rx="16"
            fill="#5c4ade"
            stroke="#000"
            strokeWidth="2"
          />
          <path d="M6 56 H120" stroke="#000" strokeWidth="2" />
          <rect
            x="52"
            y="47"
            width="22"
            height="18"
            rx="5"
            fill="#ffd731"
            stroke="#000"
            strokeWidth="2"
          />
        </symbol>
        <symbol id="s-check" viewBox="0 0 120 120">
          <path
            d="M60 14 C70 4 86 10 88 24 C102 20 114 32 108 46 C120 54 118 72 104 76 C108 92 94 104 80 98 C72 112 52 112 46 98 C32 104 16 94 20 78 C6 72 4 54 16 46 C10 32 22 20 36 24 C38 10 52 4 60 14 Z"
            fill="#000"
            transform="translate(4 6)"
          />
          <path
            d="M60 14 C70 4 86 10 88 24 C102 20 114 32 108 46 C120 54 118 72 104 76 C108 92 94 104 80 98 C72 112 52 112 46 98 C32 104 16 94 20 78 C6 72 4 54 16 46 C10 32 22 20 36 24 C38 10 52 4 60 14 Z"
            fill="#55db9c"
            stroke="#000"
            strokeWidth="2"
          />
          <path
            d="M42 60 L56 74 L80 46"
            fill="none"
            stroke="#000"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M42 60 L56 74 L80 46"
            fill="none"
            stroke="#fff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="s-rocket" viewBox="0 0 110 140">
          <path
            d="M55 6 C84 28 88 70 76 100 H34 C22 70 26 28 55 6 Z"
            fill="#fff"
            stroke="#000"
            strokeWidth="2"
          />
          <path
            d="M55 6 C70 18 78 32 82 48 H28 C32 32 40 18 55 6 Z"
            fill="#fb4903"
            stroke="#000"
            strokeWidth="2"
          />
          <circle cx="55" cy="66" r="12" fill="#4da2ff" stroke="#000" strokeWidth="2" />
          <path
            d="M34 78 L12 112 L36 104 Z M76 78 L98 112 L74 104 Z"
            fill="#fb4903"
            stroke="#000"
            strokeWidth="2"
          />
          <rect
            x="42"
            y="100"
            width="26"
            height="14"
            rx="4"
            fill="#e9ccff"
            stroke="#000"
            strokeWidth="2"
          />
          <path d="M46 114 L55 136 L64 114 Z" fill="#ffd731" stroke="#000" strokeWidth="2" />
        </symbol>
        <symbol id="s-cv" viewBox="0 0 100 124">
          <path d="M10 10 H66 L92 36 V120 H10 Z" fill="#000" transform="translate(4 4)" />
          <path d="M6 6 H62 L88 32 V116 H6 Z" fill="#fff" stroke="#000" strokeWidth="2" />
          <path d="M62 6 V32 H88" fill="#e9ccff" stroke="#000" strokeWidth="2" />
          <circle cx="30" cy="38" r="11" fill="#ffd731" stroke="#000" strokeWidth="2" />
          <path
            d="M18 64 H74 M18 76 H74 M18 88 H56 M18 100 H64"
            stroke="#000"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </symbol>
        <symbol id="s-star" viewBox="0 0 100 100">
          <path
            d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z"
            fill="#fb4903"
            stroke="#000"
            strokeWidth="2"
          />
        </symbol>
        <symbol id="s-sparkle" viewBox="0 0 40 40">
          <path
            d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z"
            fill="#fff"
            stroke="#000"
            strokeWidth="2"
          />
        </symbol>
      </defs>
    </svg>
  )
}

const RIBBON_PATH =
  "M1250 -120 C 1500 200, 1100 300, 700 330 C 250 360, 40 480, 120 700 C 200 900, 700 760, 1100 720 C 1500 680, 1620 900, 1300 1060 C 1000 1210, 500 1150, 200 1600"

export function HeroRibbon() {
  return (
    <svg
      className="hero__ribbon"
      id="ribbon"
      viewBox="0 0 1600 1500"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden
    >
      <g filter="url(#grain)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={RIBBON_PATH} stroke="#1552a8" strokeWidth="210" />
        <path d={RIBBON_PATH} stroke="#2f7fe6" strokeWidth="190" transform="translate(-4 -6)" />
        <path
          d={RIBBON_PATH}
          stroke="#4da2ff"
          strokeWidth="140"
          transform="translate(-12 -18)"
          filter="url(#soft)"
        />
        <path
          d={RIBBON_PATH}
          stroke="#b4d8ff"
          strokeWidth="46"
          transform="translate(-28 -46)"
          opacity=".85"
          filter="url(#soft2)"
        />
      </g>
    </svg>
  )
}

/** Feature 1: briefcases and coins on mint. */
export function JobsArt() {
  return (
    <svg viewBox="0 0 600 600" className="js-par" aria-hidden>
      <path d="M-50 380 L650 40 L650 200 L-50 540 Z" fill="#c9f3df" />
      <path d="M-50 640 L650 300 L650 360 L-50 700 Z" fill="#c9f3df" />
      <use href="#s-case" x="30" y="40" width="160" height="140" transform="rotate(-14 110 110)" />
      <use href="#s-case" x="250" y="20" width="190" height="160" transform="rotate(10 345 100)" />
      <use href="#s-coin" x="470" y="80" width="120" height="120" />
      <use href="#s-coin" x="40" y="250" width="130" height="130" />
      <use href="#s-case" x="200" y="230" width="220" height="190" transform="rotate(-6 310 325)" />
      <use href="#s-case" x="440" y="280" width="150" height="130" transform="rotate(16 515 345)" />
      <use href="#s-coin" x="300" y="440" width="120" height="120" />
      <use href="#s-case" x="20" y="430" width="170" height="150" transform="rotate(12 105 505)" />
      <use href="#s-coin" x="480" y="460" width="110" height="110" />
    </svg>
  )
}

function Chip({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width="140"
        height="90"
        rx="30"
        fill="#231a7a"
        stroke="#000"
        strokeWidth="3"
      />
      <text
        x={x + 70}
        y={y + 54}
        fill="#fff"
        fontFamily="Inter,sans-serif"
        fontWeight="700"
        fontSize="22"
        textAnchor="middle"
      >
        {label}
      </text>
    </>
  )
}

/** Feature 2: apply button with a clicking cursor on lavender. */
export function ApplyArt() {
  return (
    <svg viewBox="0 0 600 600" className="js-par" aria-hidden>
      <path d="M-50 520 L300 -50 L420 -50 L70 520 Z" fill="#f4e8ff" />
      <path d="M200 650 L560 60 L640 60 L280 650 Z" fill="#f4e8ff" />
      <g transform="rotate(-18 300 300)">
        <rect x="130" y="80" width="360" height="460" rx="40" fill="#000" />
        <rect
          x="112"
          y="64"
          width="360"
          height="460"
          rx="40"
          fill="#5c4ade"
          stroke="#000"
          strokeWidth="3"
        />
        <Chip x={140} y={96} label="PRÁCTICAS" />
        <Chip x={300} y={96} label="REMOTO" />
        <Chip x={140} y={206} label="VENTAS" />
        <Chip x={300} y={206} label="TI" />
        <rect x="140" y="330" width="300" height="140" rx="70" fill="#000" />
        <rect
          x="134"
          y="320"
          width="300"
          height="140"
          rx="70"
          fill="#ffd731"
          stroke="#000"
          strokeWidth="3"
        />
        <text
          x="284"
          y="415"
          fontFamily="Anton,Impact,sans-serif"
          fontSize="68"
          textAnchor="middle"
          fill="#000"
        >
          POSTULAR
        </text>
      </g>
      <g className="js-cursor">
        <path
          d="M360 380 L360 520 L392 490 L420 552 L446 540 L418 480 L462 478 Z"
          fill="#888"
          stroke="#000"
          strokeWidth="3"
          transform="translate(8 8)"
        />
        <path
          d="M360 380 L360 520 L392 490 L420 552 L446 540 L418 480 L462 478 Z"
          fill="#fff"
          stroke="#000"
          strokeWidth="3"
        />
        <path
          d="M340 360 L322 342 M362 350 L362 324 M384 360 L400 344 M330 384 L306 384"
          stroke="#fff"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

/** Category icons (56×56). */
export const CATEGORY_ICONS = {
  tech: (
    <>
      <rect x="4" y="10" width="48" height="32" rx="8" fill="#fff" stroke="#000" />
      <path
        d="M18 22 l-6 5 6 5 M38 22 l6 5 -6 5 M31 19 l-6 16"
        fill="none"
        stroke="#000"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="18" y="42" width="20" height="8" fill="#ffd731" stroke="#000" />
    </>
  ),
  sales: (
    <>
      <path
        d="M8 44 L20 28 L30 36 L46 14"
        fill="none"
        stroke="#000"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="14" r="7" fill="#55db9c" stroke="#000" />
      <path d="M6 50 H50" stroke="#000" strokeWidth="2" />
    </>
  ),
  admin: (
    <>
      <rect x="6" y="8" width="44" height="40" rx="10" fill="#fff" stroke="#000" />
      <path
        d="M14 20 H42 M14 28 H42 M14 36 H30"
        stroke="#000"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="40" cy="38" r="8" fill="#fb4903" stroke="#000" />
    </>
  ),
  health: (
    <>
      <circle cx="28" cy="28" r="22" fill="#fff" stroke="#000" />
      <path d="M28 14 V42 M14 28 H42" stroke="#fb4903" strokeWidth="7" strokeLinecap="round" />
    </>
  ),
  engineering: (
    <>
      <circle cx="28" cy="28" r="10" fill="#ffd731" stroke="#000" />
      <path
        d="M28 4 V14 M28 42 V52 M4 28 H14 M42 28 H52 M11 11 L18 18 M38 38 L45 45 M45 11 L38 18 M18 38 L11 45"
        stroke="#000"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </>
  ),
  design: (
    <>
      <circle cx="20" cy="30" r="14" fill="#e9ccff" stroke="#000" />
      <circle cx="36" cy="22" r="14" fill="#4da2ff" stroke="#000" />
      <circle cx="34" cy="38" r="12" fill="#ffd731" stroke="#000" />
    </>
  ),
  internship: (
    <>
      <path d="M8 22 L28 10 L48 22 L28 34 Z" fill="#5c4ade" stroke="#000" />
      <path d="M16 27 V40 C22 46 34 46 40 40 V27" fill="#fff" stroke="#000" />
      <path d="M48 22 V36" stroke="#000" strokeWidth="2" />
    </>
  ),
  remote: (
    <>
      <circle cx="28" cy="28" r="22" fill="#55db9c" stroke="#000" />
      <path
        d="M6 28 H50 M28 6 C18 18 18 38 28 50 M28 6 C38 18 38 38 28 50"
        fill="none"
        stroke="#000"
        strokeWidth="2"
      />
    </>
  ),
}
