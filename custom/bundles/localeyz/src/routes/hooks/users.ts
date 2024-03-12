import { syncUser, userDelete, userUpdate } from '../../controllers/users'

/**
 * Represents a module for handling user-related actions and filters.
 * @param {object} param0 - The action and filter objects.
 * @param {object} param1 - The context object containing services and database.
 */
export default ({ action, filter }: any, { services, database }: any) => {
  const { ItemsService, UsersService } = services

  // Define action for creating users or login authentication
  action('users.items.create', async ({ payload }: any, { schema }: any) => {
    // Check if email is provided in the payload
    if (payload?.email) {
      // Execute the syncUser function from the users controller for creating users or handling login authentication
      await syncUser(payload.email, schema, { services, database })
    }
  })

  // Define action for login authentication
  action('auth.login', async ({ payload }: any, { schema }: any) => {
    // Check if email is provided in the payload
    if (payload?.email) {
      // Execute the syncUser function from the users controller for handling login authentication
      await syncUser(payload.email, schema, { services, database })
    }
  })

  // Define filter for deleting users
  filter('users.items.delete', async (keys: string[], _: any, { schema }: any) => {
    // Execute the userDelete function from the users controller for deleting users
    await userDelete(keys, _, database, UsersService, ItemsService, schema)

  })

  // Define action for updating users
  action(
    'users.items.update',
    async ({ keys }: { keys: string[] }, { schema }: any) => {
      // Execute the userUpdate function from the users controller for updating users
      return await userUpdate(keys, ItemsService, schema, services, database)
    }
  )
}
