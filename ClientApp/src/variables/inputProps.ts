import z from 'zod'

export const emailProps = {
  type: 'email',
  label: 'Email',
  name: 'email',
  isRequired: true,
  placeholder: 'mail@simmmple.com',
  schema: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Invalid email address.' }),
}
export const usernameProps = {
  type: 'text',
  label: 'Username',
  name: 'username',
  isRequired: true,
  placeholder: 'simmple',
  schema: z.string().min(5, { message: 'Username must be more than 5.' }),
}
export const passwordProps = {
  type: 'password',
  label: 'Password',
  name: 'password',
  isRequired: true,
  placeholder: 'Min. 8 characters',
  schema: z.string().min(8, { message: 'Password must be more than 8.' }),
}
export const passwordConfirmProps = {
  type: 'password',
  label: 'Password Confirm',
  isRequired: true,
  placeholder: 'Min. 8 characters',
  schema: z.string(),
}
export const firstNameProps = {
  type: 'text',
  label: 'First Name',
  name: 'first-name',
  isRequired: true,
  placeholder: 'John',
  schema: z.string().min(1, { message: 'First Name is required.' }),
}
export const lastNameProps = {
  type: 'text',
  label: 'Last Name',
  name: 'last-name',
  isRequired: true,
  placeholder: 'Doe',
  schema: z.string().min(1, { message: 'Last Name is required.' }),
}
