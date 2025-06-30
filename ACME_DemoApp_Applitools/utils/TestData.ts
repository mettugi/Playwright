interface UserCredentials {
  username: string;
  password: string;
}

interface TestUser {
  valid: UserCredentials;
  invalid: UserCredentials;
  empty: UserCredentials;
}

export const TEST_DATA: TestUser = {
  valid: {
    username: 'testuser',
    password: 'testpass'
  },
  invalid: {
    username: 'invaliduser',
    password: 'wrongpass'
  },
  empty: {
    username: '',
    password: ''
  }
};

export const LOGIN_TEST_CASES = [
  {
    name: 'Valid Login',
    credentials: TEST_DATA.valid,
    expectedResult: 'success'
  },
  {
    name: 'Invalid Username',
    credentials: { username: 'invalid', password: TEST_DATA.valid.password },
    expectedResult: 'error'
  },
  {
    name: 'Invalid Password',
    credentials: { username: TEST_DATA.valid.username, password: 'invalid' },
    expectedResult: 'error'
  },
  {
    name: 'Empty Credentials',
    credentials: TEST_DATA.empty,
    expectedResult: 'error'
  }
];
