import { ItemsService } from '../utils/helper'

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
 * Interface representing a user.
 */
interface User {
  linked_user: string | undefined
  id?: string
  email?: string
  organization_id?: string
  user_type?: number
  firstname?: string
  lastname?: string
  role?: {
    id?: string
    app_access?: boolean
    admin_access?: boolean
  }
}

/**
 * Retrieves all roles from the database.
 * @param {any} rolesService - The service used to interact with roles.
 * @returns {Promise<Role[]>} - A promise that resolves to an array of all roles.
 */
const getAllRoles = async (rolesService: ItemsService): Promise<Role[]> => {
  return await rolesService.readByQuery({ fields: ['id', 'name'] })
}

/**
 * Retrieves a Directus user by email.
 * @param {string} email - The email address of the user.
 * @param {any} directusUsersService - The service used to interact with Directus users.
 * @returns {Promise<User | undefined>} - A promise that resolves to the Directus user matching the email, if found.
 */
const getDirectusUserByEmail = async (
  email: string,
  directusUsersService: ItemsService
): Promise<User | undefined> => {
  const users = await directusUsersService.readByQuery({
    fields: [
      'id',
      'email',
      'organization',
      'role.id',
      'role.name',
      'linked_user'
    ],
    filter: { email: { _eq: email } }
  })
  return users?.[0]
}

/**
 * Retrieves a user by email.
 * @param {string} email - The email address of the user.
 * @param {any} userItems - The service used to interact with user items.
 * @returns {Promise<User | undefined>} - A promise that resolves to the user matching the email, if found.
 */
const getUserByEmail = async (
  email: string,
  userItems: ItemsService
): Promise<User | undefined> => {
  const users = await userItems.readByQuery({
    fields: [
      'id',
      'email',
      'organization_id',
      'user_type',
      'firstname',
      'lastname'
    ],
    filter: { email: { _eq: email } }
  })
  return users?.[0]
}

/**
 * Creates a new user in Directus.
 * @param {User} user - The user object to create.
 * @param {Role | undefined} foundRole - The role associated with the user.
 * @param {any} directusUsersService - The service used to interact with Directus users.
 * @returns {Promise<any>} - A promise that resolves once the user is created.
 */
const createUser = async (
  user: User,
  foundRole: Role | undefined,
  directusUsersService: ItemsService
): Promise<any> => {
  return await directusUsersService.createOne({
    first_name: user.firstname,
    last_name: user.lastname,
    email: user.email,
    organization: user.organization_id,
    role: foundRole?.id,
    linked_user: user.id
  })
}

/**
 * Retrieves a user by ID.
 * @param {string} userId - The ID of the user to retrieve.
 * @param {any} userItems - The service used to interact with user items.
 * @returns {Promise<any>} - A promise that resolves to the user matching the ID.
 */
const getUser = async (
  userId: string,
  userItems: ItemsService
): Promise<any> => {
  return await userItems.readByQuery({
    fields: ['id', 'email'],
    filter: {
      id: {
        _eq: userId
      }
    }
  })
}

/**
 * Finds a user to be deleted in Directus.
 * @param {any[]} userQuery - The user query results.
 * @param {any} directusUsersService - The service used to interact with Directus users.
 * @returns {Promise<any[]>} - A promise that resolves to the user(s) to be deleted.
 */
const findUserToBeDeleted = async (
  userQuery: any[],
  directusUsersService: ItemsService
): Promise<any[]> => {
  return await directusUsersService.readByQuery({
    fields: ['id'],
    filter: {
      email: {
        _eq: userQuery?.[0]?.email
      }
    }
  })
}

/**
 * Deletes users from Directus.
 * @param {any[]} toDelete - The list of user IDs to delete.
 * @param {any} directusUsersService - The service used to interact with Directus users.
 * @returns {Promise<any>} - A promise that resolves once the users are deleted.
 */
const deleteUsers = async (
  toDelete: any[],
  directusUsersService: ItemsService
): Promise<any> => {
  return await directusUsersService.deleteMany(toDelete)
}

export {
  getAllRoles,
  getDirectusUserByEmail,
  getUserByEmail,
  createUser,
  getUser,
  findUserToBeDeleted,
  deleteUsers
}
