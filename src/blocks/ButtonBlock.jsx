import { token } from '../schema'

const VARIANTS = {
  primary:
    'bg-[var(--color-ember)] text-[var(--color-cream)] hover:bg-[var(--color-ember-bright)] shadow-sm',
  secondary:
    'bg-[var(--color-forest)] text-[var(--color-cream)] hover:bg-[var(--color-forest-deep)] shadow-sm',
  ghost:
    'bg-transparent text-[var(--color-forest)] border-2 border-[var(--color-forest)] hover:bg-[var(--color-forest)] hover:text-[var(--color-cream)]',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-9 py-4 text-lg',
}

export default function ButtonBlock({ props }) {
  const { label, href, variant, size, align } = props

  return (
    <div className={token('textAlign', align)}>
      <a
        href={href || '#'}
        className={`inline-block font-[family-name:var(--font-heading)] font-bold no-underline transition-colors duration-150 rounded-full ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md}`}
      >
        {label}
      </a>
    </div>
  )
}
