/**
 * Interface representing a user.
 */
interface User {
  id: Promise<any>
  email?: string | undefined
  role?: {
    id: string | undefined
    app_access: boolean | undefined
    admin_access: boolean | undefined
  }
}

/**
 * Interface representing a role.
 */
interface Role {
  id: string
  name: string
  app_access: boolean
  admin_access: boolean
}

/**
 * Retrieves user(s) by email from the database.
 * @param {string} email - The email of the user to retrieve.
 * @param {any} usersService - The service used to interact with users.
 * @returns {Promise<User[]>} - A promise that resolves to an array of user(s) matching the email.
 */
const getUserByEmail = async (
  email: string,
  usersService: any
): Promise<User[]> => {
  return await usersService.readByQuery({
    fields: ['*', 'role.*'],
    filter: {
      email: {
        _eq: email
      }
    }
  })
}

/**
 * Retrieves all roles from the database.
 * @param {any} rolesService - The service used to interact with roles.
 * @returns {Promise<Role[]>} - A promise that resolves to an array of all roles.
 */
const getAllRoles = async (rolesService: any): Promise<Role[]> => {
  return await rolesService.readByQuery({
    fields: ['id', 'name', 'app_access', 'admin_access']
  })
}

/**
 * Creates a new user in the database.
 * @param {any} req - The request object.
 * @param {string} email - The email of the user.
 * @param {string | undefined} id - The ID of the user.
 * @param {Role | undefined} foundRole - The role of the user.
 * @param {string | undefined} organization - The organization of the user.
 * @param {any} usersService - The service used to interact with users.
 * @returns {Promise<any>} - A promise that resolves to the ID of the created user.
 */
const createUser = async (
  req: any,
  email: string,
  id: string | undefined,
  foundRole: Role | undefined,
  organization: string | undefined,
  usersService: any
): Promise<any> => {
  const userData: any = {
    email,
    provider: 'email',
    name: req?.body?.name
  }
  if (id) userData.linked_user = id
  if (foundRole?.id) userData.role = foundRole.id
  if (organization) userData.organization = organization

  return await usersService.createOne(userData)
}

/**
 * Updates a user in the database.
 * @param {any} req - The request object.
 * @param {User} user - The user object to update.
 * @param {string | undefined} id - The ID of the user.
 * @param {Role | undefined} foundRole - The role of the user.
 * @param {string | undefined} organization - The organization of the user.
 * @param {any} usersService - The service used to interact with users.
 * @returns {Promise<any>} - A promise that resolves once the user is updated.
 */
const updateUser = async (
  req: any,
  user: User,
  id: string | undefined,
  foundRole: Role | undefined,
  organization: string | undefined,
  usersService: any
): Promise<any> => {
  const userData: any = {
    name: req?.body?.name
  }
  if (id) userData.linked_user = id
  if (foundRole?.id) userData.role = foundRole.id
  if (organization) userData.organization = organization

  return await usersService.updateOne(user.id, userData)
}

/**
 * Creates a session for a user in the database.
 * @param {any} sessionService - The service used to interact with sessions.
 * @param {string | undefined} accessToken - The access token for the session.
 * @param {User | undefined} user - The user for whom the session is created.
 * @param {Date} expiresDateTime - The expiry date and time of the session.
 * @param {any} accountability - The accountability data for the session.
 * @returns {Promise<void>} - A promise that resolves once the session is created.
 */
const createSession = async (
  sessionService: any,
  accessToken: string | undefined,
  user: User | undefined,
  expiresDateTime: Date,
  accountability: any
): Promise<void> => {
  await sessionService.createOne({
    token: accessToken,
    user: user?.id,
    expires: expiresDateTime,
    ip: accountability?.ip,
    user_agent: accountability?.userAgent
  })
}

/**
 * Creates an activity record for a user in the database.
 * @param {any} activityService - The service used to interact with activity records.
 * @param {User | undefined} user - The user for whom the activity record is created.
 * @param {any} accountability - The accountability data for the activity.
 * @returns {Promise<void>} - A promise that resolves once the activity record is created.
 */
const createActivity = async (
  activityService: any,
  user: User | undefined,
  accountability: any
): Promise<void> => {
  await activityService.createOne({
    action: 'login',
    user: user?.id,
    ip: accountability.ip,
    user_agent: accountability.userAgent,
    collection: 'directus_users',
    item: user?.id
  })
}

export {
  getUserByEmail,
  getAllRoles,
  createUser,
  updateUser,
  createSession,
  createActivity
}
