type FormInputs = {
  name: string;
  email: string;
  password: string;
  password2: string;
};

type Errors = {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  password2: string | undefined;
};
export default class UserFormValidation {
  static validateFormInput(form: FormInputs, isEditForm: boolean) {
    const { name, email, password, password2 } = form;
    let newErrors: Errors = {
      name: undefined,
      email: undefined,
      password: undefined,
      password2: undefined,
    };

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length < 3) {
      newErrors.name = "Name is too short";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!isEditForm) {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 6) {
        newErrors.password = "Password needs to be 6 characters or more";
      }

      if (!password2) {
        newErrors.password2 = "Repeated password is required";
      } else if (password2 !== password) {
        newErrors.password2 = "Passwords do not match";
      }
    } else {
      if (password.length > 0) {
        if (password.length < 6) {
          newErrors.password = "Password needs to be 6 characters or more";
        }

        if (!password2) {
          newErrors.password2 = "Repeated password is required";
        } else if (password2 !== password) {
          newErrors.password2 = "Passwords do not match";
        }
      }
    }

    return newErrors;
  }
}
