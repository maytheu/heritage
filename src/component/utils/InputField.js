import React from "react";
 
import "./InputField.css";

const InputField = props => {
  let inputElement = null;
  const validateInputClass = ["inputElement"];
  if (props.invalid && props.touched) {
    validateInputClass.push("invalid");
  }
  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          className={validateInputClass.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={event => props.changed({ event, id: props.id })}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          className={validateInputClass.join(" ")}
          value={props.value}
          onChange={event => props.changed({ event, id: props.id })}
        >
          <option value="">{props.elementConfig.placeholder}</option>
          {props.elementConfig.options.map(option => (
            <option key={option.key} value={option.key}>
              {option.value}
            </option>
          ))}
        </select>
      );
      break;
      case 'textarea':
      inputElement = (
        <textarea
          className={validateInputClass.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={event => props.changed({ event, id: props.id })}
        />
      );
      break;
    default:
      inputElement = (
        <input
          className={validateInputClass.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
  }
  return (
    <div className="input">
      <label className="label" />
      {inputElement}
    </div>
  );
};

export default InputField;
