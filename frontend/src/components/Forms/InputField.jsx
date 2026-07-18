/**
 * InputField — labelled input with error text and optional adornment.
 * Works for text/email/password/number/select (via `as="select"`).
 */
export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  placeholder,
  required,
  as,
  children,
  ...rest
}) {
  const id = `f-${name}`;
  const invalid = Boolean(error);
  const common = {
    id,
    name,
    value,
    onChange,
    placeholder,
    required,
    className: `form-control form-control-lg ${invalid ? 'is-invalid' : ''}`,
    ...rest,
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label fw-semibold">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {as === 'select' ? (
        <select {...common} className={`form-select form-select-lg ${invalid ? 'is-invalid' : ''}`}>
          {children}
        </select>
      ) : as === 'textarea' ? (
        <textarea {...common} className={`form-control ${invalid ? 'is-invalid' : ''}`} />
      ) : (
        <input type={type} {...common} />
      )}
      {hint && !invalid && <div className="form-text">{hint}</div>}
      {invalid && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
