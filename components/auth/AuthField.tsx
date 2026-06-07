type AuthFieldProps = {
  label: string
  name: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
}

export function AuthField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: AuthFieldProps) {
  return (
    <label style={{ display: 'block', marginBottom: '16px' }}>
      <span
        style={{
          display: 'block',
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--ink-muted)',
          marginBottom: '8px',
        }}
      >
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="auth-input"
      />
    </label>
  )
}