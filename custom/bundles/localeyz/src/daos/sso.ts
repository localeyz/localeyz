import { Accountability, ItemsService, Role, User } from '../utils/helper'

// Retrieves user(s) by email from the database.
const getUserByEmail = async (
  email: string,
  usersService: ItemsService
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

// Retrieves all roles from the database.
const getAllRoles = async (rolesService: ItemsService): Promise<Role[]> => {
  return await rolesService.readByQuery({
    fields: ['id', 'name', 'app_access', 'admin_access']
  })
}

// Creates a new user in the database.
const createUser = async (
  req: Request,
  email: string,
  id: string | undefined,
  foundRole: Role | undefined,
  organization: string | undefined,
  usersService: ItemsService
): Promise<User> => {
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

// Updates a user in the database.
const updateUser = async (
  req: Request,
  user: User,
  id: string | undefined,
  foundRole: { id: string } | undefined,
  organization: string | undefined,
  usersService: ItemsService
): Promise<User> => {
  const userData: User = {
    name: req?.body?.name
  }
  if (id) userData.linked_user = id
  if (foundRole?.id) {
    // Construct the role object
    userData.role = {
      id: foundRole.id,
      app_access: undefined,
      admin_access: undefined
    }
  }
  if (organization) userData.organization = organization

  return await usersService.updateOne(user.id, userData)
}

// Creates a session for a user in the database.
const createSession = async (
  sessionService: ItemsService,
  accessToken: string | undefined,
  user: User | undefined,
  expiresDateTime: Date,
  accountability: Accountability
): Promise<void> => {
  await sessionService.createOne({
    token: accessToken,
    user: user?.id,
    expires: expiresDateTime,
    ip: accountability?.ip,
    user_agent: accountability?.userAgent
  })
}

// Creates an activity record for a user in the database.
const createActivity = async (
  activityService: ItemsService,
  user: User | undefined,
  accountability: Accountability
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
