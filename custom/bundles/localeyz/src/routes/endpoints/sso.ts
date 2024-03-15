import { Request, Response, Router } from 'express' // Assuming you're using Express for routing
import { userLogin } from '../../controllers/sso'
import { ControllerOptions } from '../../utils/helper'

export default {
  // Unique identifier for this route handler
  id: 'sso',
  // Handler function responsible for setting up the route
  handler: (
    router: Router,
    { services, database, getSchema }: ControllerOptions
  ) => {
    // Define the route for handling user login
    router.post('/login', async (req: Request, res: Response) => {
      // Call the userLogin function from the SSO controller
      await userLogin(req, res, { services, database, getSchema })
    })
  }
}
