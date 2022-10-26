import React from "react";
import { ErrorMessage, useField } from "formik";

function TextAreaInput({ placeholder = "", id = "", name = id, ...props }) {
  const [field, meta] = useField({ name, id, ...props });

  const customMockChange = (e) => {
    props.onChange(e);
    field.onChange(e);
  };

  const handleGeneralChange = (e) =>
    props?.onChange ? customMockChange(e) : field.onChange(e);

  return (
    <>
      <label htmlFor={id} className="form-label">
        {props.label}
        {props.required && (
          <>
            <span className="isRequired" aria-hidden="true">
              *
            </span>
          </>
        )}
      </label>

      <textarea
        className={`form-control ${
          ((meta.touched && meta.error) || props.error) && "is-invalid"
        }`}
        id={id}
        name={name}
        type={props.type}
        disabled={props.disabled}
        value={field.value || props.defaultValue || ""}
        onBlur={field.onBlur}
        onChange={handleGeneralChange}
        onKeyUp={props.onKeyUp}
        autoComplete={props.autoComplete}
        autoFocus={props.autoFocus}
        maxLength={props.maxLength}
        placeholder={placeholder}
        onPaste={props?.onPaste}
        readOnly={props.readOnly}
      />
      <ErrorMessage
        component="div"
        name={field.name}
        className={"small text-danger"}
        role="alert"
      />
    </>
  );
}

export default TextAreaInput;
