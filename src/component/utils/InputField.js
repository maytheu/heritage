import React from 'react';

import './InputField.css'

const InputField = (props) => {
    let inputElement = null
    const validateInputClass = ["inputElement"]
    if(props.invalid && props.shouldValidate && props.touched){
        validateInputClass.push('invalid')
    }
    switch(props.elementType){
        case 'input':
        inputElement = <input 
        className={validateInputClass.join(' ')} 
        {...props.elementConfig} 
        value={props.value} onChange={props.changed}/>
    break;
    default:
            inputElement = <input 
            className={validateInputClass.join(' ')} 
            {...props.elementConfig} 
            value={props.value} onChange={props.changed}/> 
    }
    return (
        <div className="input">
        <label className="label"></label>
        {inputElement}
            
        </div>
    );
};

export default InputField;