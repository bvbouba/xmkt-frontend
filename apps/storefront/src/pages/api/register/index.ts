import { signup } from "features/data";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { password1, password2, email, firstName, lastName, userType, phone, school } = req.body;

      await signup({ password1, password2, email, firstName, lastName, userType, phone, school });

      return res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error("Error during user registration: ", error);
      return res.status(500).json({ message: "An error occurred while registering the user." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }
}
