import { getUserByEmail } from "features/data";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      const user = await getUserByEmail(email);
      
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user: ", error);
      return res.status(500).json({ message: "Error fetching user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
