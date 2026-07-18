/**
 * Button — thin wrapper over Bootstrap's .btn that adds our brand variants
 * (saffron / emerald), a loading state, and optional block sizing.
 */
export default function Button({
  variant = 'primary',
  size,
  loading = false,
  block = false,
  children,
  className = '',
  disabled,
  type = 'button',
  ...rest
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;
  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${block ? 'w-100' : ''} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
