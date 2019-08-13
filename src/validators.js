const validator = {
  email: {
    rules: [
      {
        // test:/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i,
        test: /^(?=[a-z0-9.]{3,20}$)[a-z0-9]+\.?[a-z0-9]+$|^.*@\w+\.[\w.]+$/i,
        message: "Please Enter Valid Email or Username"
      }
    ],
    errors: [],
    valid: false,
    state: ""
  },
  password: {
    rules: [
      {
        test: value => {
          return value.length >= 6;
        },
        message: "Password must not be shorter than 6 characters"
      },
      {
        test: /^.+$/,
        message: "Enter Valid Password"
      }
    ],
    errors: [],
    valid: false,
    state: ""
  },
  firstname: {
    rules: [
      {
        test: /^[a-zA-Z_]+$/i,
        message: "number not allowed"
      }
    ],
    errors: [],
    valid: false,
    state: ""
  },
  lastname: {
    rules: [
      {
        test: /^[a-zA-Z_]+$/i,
        message: "number not allowed"
      }
    ],
    errors: [],
    valid: false,
    state: ""
  }
};

export default validator;
