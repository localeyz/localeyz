import {
  createActivity,
  createSession,
  createUser,
  getAllRoles,
  getUserByEmail,
  updateUser
} from '../daos/sso'
import { ControllerOptions } from '../utils/helper'

// Function to handle user login
const userLogin = async (
  req: Request,
  res: Response,
  { services, getSchema }: ControllerOptions
) => {
  const { ItemsService } = services // Destructure services
  const schema = await getSchema() // Get schema

  // Check if email is present in request body
  if (!req?.body?.email) {
    res.send(false)
    return
  }

  // Extract data from request body
  const id = req?.body?.id ?? ''
  const email = req?.body?.email.toLowerCase()
  const organization = req?.body?.organization
  const role = req?.body?.role
  const expiresDateTime = new Date(Date.now() + 2.628e9)
  const accessToken = req?.body?.token

  // Set accountability data
  const accountability = {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    role: null,
    admin: true
  }

  // Initialize ActivityService with schema and database
  const activityService = new ItemsService('directus_activity', {
    accountability,
    schema: await getSchema()
  })

  // Initialize UsersService with schema and database
  const usersService = new ItemsService('directus_users', {
    accountability,
    schema: await getSchema()
  })

  // Get user by email from the database
  const userQuery = await getUserByEmail(email, usersService)

  let user = userQuery?.[0] // User object from query result
  try {
    // Initialize ItemsService for 'directus_roles' collection
    const rolesService = new ItemsService('directus_roles', {
      accountability,
      schema
    })

    // Get all available roles
    const roles = await getAllRoles(rolesService)

    let foundRole // Placeholder for found role
    if (role) {
      foundRole = roles.find(
        (r: { name: string }) => r.name.toLowerCase() === role
      ) // Find role by name
    }

    if (!user) {
      const userId = createUser(
        req,
        email,
        id,
        foundRole,
        organization,
        usersService
      ) // Create new user if not found

      // Set user object
      user = {
        id: userId,
        role: {
          id: foundRole?.id,
          app_access: foundRole?.app_access,
          admin_access: foundRole?.admin_access
        }
      }
    } else {
      await updateUser(req, user, id, foundRole, organization, usersService) // Update user if found
    }
  } catch (error: any) {
    console.log('CUSTOM OAUTH UPDATE / INSERT ERROR', error.message)
  }

  try {
    // Initialize ItemsService for 'directus_sessions' collection
    const sessionService = new ItemsService('directus_sessions', {
      accountability,
      schema
    })

    // Create session for user
    await createSession(
      sessionService,
      accessToken,
      user,
      expiresDateTime,
      accountability
    )

    // Log activity
    await createActivity(activityService, user, accountability)
  } catch (error: any) {
    console.log('CUSTOM OAUTH SESSION ERROR', error.message)
  }

  // Send response with user data
  res.send({
    userId: user?.id,
    secret: process?.env?.SECRET,
    role: user?.role?.id,
    appAccess: user?.role?.app_access,
    adminAccess: user?.role?.admin_access
  })
}

export { userLogin }
