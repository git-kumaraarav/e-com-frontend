export type AuthFormErrors = {
  major? : string;
  name? : string; 
  email? : string;
  password? : string;
}

export type AuthFormState = {
  errors: AuthFormErrors; 
}