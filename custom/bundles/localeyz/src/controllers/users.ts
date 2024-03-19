import {
  createUser,
  deleteUsers,
  findUserToBeDeleted,
  getAllRoles,
  getDirectusUserByEmail,
  getUser,
  getUserByEmail
} from '../daos/users'
import { ACCOUNTABILITY } from '../utils/config'

// Function to synchronize user data
const syncUser = async (
  email: string,
  schema: any,
  { services, database }: any
) => {
  const { ItemsService, UsersService } = services

  // Check if email is provided
  if (email) {
    const rolesService: any = new ItemsService('directus_roles', {
      ACCOUNTABILITY,
      schema
    })
    const roles = await getAllRoles(rolesService)

    // Initialize DirectusUsersService
    const directusUsersService = new UsersService({ schema, knex: database })
    const userItems: any = new ItemsService('users', { ACCOUNTABILITY, schema })

    // Retrieve Directus user by email
    const directusUserQuery = await getDirectusUserByEmail(
      email,
      directusUsersService
    )
    const userQuery = await getUserByEmail(email, userItems)

    let foundRole

    // Get user and corresponding role
    const user = userQuery
    const roleEnum = ['Staff', 'Producer', 'Admin']
    if (typeof user?.user_type !== 'undefined' && user?.user_type !== null) {
      const roleName = roleEnum?.[user.user_type]
      foundRole = roles.find((r: any) => r?.name === roleName)
    }

    const directusUser = directusUserQuery
    if (directusUser?.id) {
      const existingUser = userQuery
      const updates: {
        linked_user?: string
        organization?: string
        role?: string
      } = {}

      // Check for updates in user data
      if (directusUser?.linked_user !== existingUser?.id) {
        updates['linked_user'] = existingUser?.id
      }

      if (
        existingUser?.organization_id &&
        existingUser?.organization_id !== directusUser?.organization_id
      ) {
        updates['organization'] = existingUser.organization_id
      }

      if (foundRole && foundRole?.id !== directusUser?.role?.id) {
        updates['role'] = foundRole?.id
      }

      // Update Directus user if updates are found
      if (Object.keys(updates).length > 0) {
        await directusUsersService.updateOne(directusUser.id, updates)
      }
    } else if (user?.id) {
      // Create Directus user if not exists
      await createUser(user, foundRole, directusUsersService)
    }
  }
}

// Function to delete user
const userDelete = async (
  keys: string[],
  _: any,
  database: any,
  UsersService: any,
  ItemsService: any,
  schema: any
) => {
  if (keys?.[0]) {
    const directusUsersService = new UsersService({
      schema,
      knex: database
    })

    const userItems: any = new ItemsService('users', {
      ACCOUNTABILITY,
      schema
    })

    const toDelete: string[] = []
    await Promise.all(
      keys.map(async (userId: string) => {
        const userQuery = await getUser(userId, userItems)

        if (userQuery?.[0]?.email) {
          const directusUserQuery = await findUserToBeDeleted(
            userQuery,
            directusUsersService
          )

          if (directusUserQuery?.[0]?.id) {
            toDelete.push(directusUserQuery[0].id)
          }
        }

        return
      })
    )

    if (toDelete?.[0]) {
      await deleteUsers(toDelete, directusUsersService)
    }
  }
}

// Function to update user
const userUpdate = async (
  keys: string[],
  ItemsService: any,
  schema: any,
  services: any,
  database: any
) => {
  if (keys?.[0]) {
    const userItems: any = new ItemsService('users', {
      ACCOUNTABILITY,
      schema
    })

    // Keys is an array of "user" id's because bulk actions can be performed.
    await Promise.all(
      keys.map(async (userId: string) => {
        const userQuery = await getUser(userId, userItems)
        if (userQuery?.[0]?.email) {
          return syncUser(userQuery?.[0]?.email, schema, { services, database })
        }

        return
      })
    )
  }
}

export { syncUser, userDelete, userUpdate }
