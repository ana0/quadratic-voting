const port = process.env.PORT || 8080
const adminPassword = process.env.ADMIN_PASS
const jwtSecret = process.env.JWT_SECRET

module.exports = {
  port,
  adminPassword,
  jwtSecret
}