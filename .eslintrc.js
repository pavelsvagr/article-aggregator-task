module.exports = {
  ...require('@ackee/styleguide-backend-config/eslint'),
  rules: {
    ...require('@ackee/styleguide-backend-config/eslint').rules,
    "@typescript-eslint/naming-convention": 0,
    "@typescript-eslint/no-misused-promises": 0
  }
}
