// Importing the telvueSync function from the telvue controller
import { telvueSync } from '../../controllers/telvue'

// Exporting an object representing a route handler
export default {
  // Unique identifier for this route handler
  id: 'telvue',
  // Handler function responsible for setting up the route
  handler: (router: any, { services }: { services: any }) => {
    // Defining a POST route
    router.post('/', async (req: any, res: any) => {
      // Calling the telvueSync function passing the request, response, and services object
      await telvueSync(req, res, { services })
    })
  }
}
