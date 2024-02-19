import { userLogin } from "../../controllers/sso"

/**
 * Module representing the SSO (Single Sign-On) controller.
 */
export default {
    /**
     * Identifier for the SSO controller.
     */
    id: "sso",

    /**
     * Handler function for the SSO controller.
     * @param {any} router - The router object to handle HTTP requests.
     * @param {object} options - Options object containing services, database, and getSchema.
     */
    handler: (router: any, { services, database, getSchema }: { services: any, database: any, getSchema: any }) => {
        // Define the route for handling user login
        router.post("/login", async (req: any, res: any) => {
            // Call the userLogin function from the SSO controller
            await userLogin(req, res, { services, database, getSchema });
        });
    },
};
