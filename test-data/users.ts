function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing. Check your .env file.`);
  }

  return value;
}

const sauceDemoPassword = requiredEnvironmentVariable(
  'SAUCEDEMO_PASSWORD',
);

export const users = {
  standard: {
    username: requiredEnvironmentVariable('SAUCEDEMO_USERNAME'),
    password: sauceDemoPassword,
  },
  lockedOut: {
    username: 'locked_out_user',
    password: sauceDemoPassword,
  },
} as const;