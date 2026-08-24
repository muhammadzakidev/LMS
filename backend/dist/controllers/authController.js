import { db } from '../db/index.js';
import { user } from '../db/schema/auth-schema.js';
const getUsers = async (req, res) => {
    try {
        const result = await db.select().from(user);
        return res.status(200).json({
            success: true,
            message: "API is working",
            result: result
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "API is not working",
            error
        });
    }
};
export default getUsers;
