// Importing the telvueSync function from the telvue controller
import { telvueSync } from '../../controllers/telvue'
import { ControllerOptions } from '../../utils/helper'

// Exporting an object representing a route handler
export default {
  // Unique identifier for this route handler
  id: 'telvue',
  // Handler function responsible for setting up the route
  handler: (
    router: {
      post: (
        arg0: string,
        arg1: (req: Request, res: Response) => Promise<void>
      ) => void
    },
    context: ControllerOptions
  ) => {
    // Defining a POST route
    router.post('/', async (req: Request, res: Response) => {
      // Calling the telvueSync function passing the request, response, and services object
      await telvueSync(req, res, context)
    })
  }
}
