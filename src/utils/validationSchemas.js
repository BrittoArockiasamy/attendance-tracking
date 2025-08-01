import * as yup from 'yup';

export const loginValidationSchema = yup.object().shape({
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
});

export const userSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Phone must be 10 digits')
    .required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  team: yup.string().required('Team is required'),
  role: yup.string().oneOf(['admin', 'employee']).required('Role is required'),
});
