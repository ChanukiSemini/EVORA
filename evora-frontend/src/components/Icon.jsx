/**
 * Thin wrapper around <svg><use/></svg> so every icon reference is a single
 * line instead of a repeated 3-line SVG block. Points at the symbols
 * defined once in <IconSprite />.
 */
export default function Icon({ name, size = 18, style, className }) {
    return (
        <svg width={size} height={size} style={style} className={className} aria-hidden="true">
            <use href={`#${name}`} />
        </svg>
    );
}
