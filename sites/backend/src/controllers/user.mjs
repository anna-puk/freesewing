import { UserModel } from '../models/user.mjs'

export function UserController() {}

/*
 * Signup
 *
 * This is the endpoint that handles account signups
 * See: https://freesewing.dev/reference/backend/api
 */
UserController.prototype.signup = async (req, res, tools) => {
  const User = new UserModel(tools)
  await User.create(req)

  return User.sendResponse(res)
}

/*
 * Confirm account (after signup)
 *
 * This is the endpoint that fully unlocks the account if the user gives their consent
 * See: https://freesewing.dev/reference/backend/api
 */
UserController.prototype.confirm = async (req, res, tools) => {
  const User = new UserModel(tools)
  await User.confirm(req)

  return User.sendResponse(res)
}

/*
 * Login (with username and password)
 *
 * This is the endpoint that provides traditional username/password login
 * See: https://freesewing.dev/reference/backend/api
 */
UserController.prototype.login = async function (req, res, tools) {
  const User = new UserModel(tools)
  await User.passwordLogin(req)

  return User.sendResponse(res)
}

/*
 * Returns the account of the authenticated user (with JWT)
 *
 * See: https://freesewing.dev/reference/backend/api
 */
UserController.prototype.whoami = async (req, res, tools) => {
  const User = new UserModel(tools)
  await User.readAsAccount({ id: req.user.uid })

  return User.sendResponse(res)
}

/*
 * Updates the account of the authenticated user
 *
 * See: https://freesewing.dev/reference/backend/api
 */
UserController.prototype.update = async (req, res, tools) => {
  const User = new UserModel(tools)
  await User.read({ id: req.user.uid })
  await User.unsafeUpdate(req.body)

  return User.sendResponse(res)
}
