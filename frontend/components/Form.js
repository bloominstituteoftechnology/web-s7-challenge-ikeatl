import React, { useEffect, useState } from 'react'
import * as Yup from "yup"
import axios from 'axios'


// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const formSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .required()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: Yup.string()
    .matches(/^[SML]$/, validationErrors.sizeIncorrect)
    .required(),
  toppings: Yup.array()
    .of(Yup.string())
})

const initialValues = {
  fullName: "",
  size: "",
  toppings: []
}

const initialErrors = {
  fullName: "",
  size: "",
  toppings: []
}

function Form() {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [isFormValid, setisFormValid] = useState(false)
  const [submittedMessage, setSubmittedMessage] = useState("")
  const [failureMessage, setFailureMessage] = useState("")
  const [canSubmit, setCanSubmit] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const newToppings = checked ? [...formData.toppings, value] : formData.toppings.filter(topping => topping !== value);
      setFormData({ ...formData, [name]: newToppings });
    } else {
      const newValue = value;
      setFormData({ ...formData, [name]: newValue });
    }

    Yup.reach(formSchema, name)
      .validate(type === 'checkbox' ? formData[name] : value)
      .then(() => {
        setErrors({ ...errors, [name]: '' });
      })
      .catch((err) => {
        setErrors({ ...errors, [name]: err.errors[0] })
      })
  }

  useEffect(() => {
    formSchema
      .isValid(formData)
      .then(valid => {
        setisFormValid(valid);
        setCanSubmit(valid);
      });
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setCanSubmit(false);
    axios
      .post("http://localhost:9009/api/order", formData)
      .then((response) => setSubmittedMessage(response.data.message))
      .catch((error) => {
        setFailureMessage("Something went wrong!")
        console.error("Form submission failed:", error)
      })
      .finally(() => {
        setFormData(initialValues);
      })

  };


  // 👇 This array could help you construct your checkboxes using .map in the JSX.
  const toppings = [
    { topping_id: '1', text: 'Pepperoni' },
    { topping_id: '2', text: 'Green Peppers' },
    { topping_id: '3', text: 'Pineapple' },
    { topping_id: '4', text: 'Mushrooms' },
    { topping_id: '5', text: 'Ham' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {submittedMessage && <div className='success'>{submittedMessage}</div>}
      {failureMessage && <div className='failure'>{failureMessage}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" value={formData.size} onChange={handleChange}>
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name='toppings'
              type="checkbox"
              value={topping.topping_id}
              checked={formData.toppings.includes(topping.topping_id)}
              onChange={handleChange}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit"
        disabled={!canSubmit}
        value='Submit' />
    </form>
  )
}
export default Form