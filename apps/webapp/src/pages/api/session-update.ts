import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req });
    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    // Modify the token (this will automatically update the session on the client)
    token.industryID = req.body.industryID;
    token.courseID = req.body.courseID;
    token.industryName = req.body.industryName;
    token.courseCode = req.body.courseCode;
    token.teamName = req.body.teamName
    token.activePeriod = req.body.activePeriod,
    token.teamID = req.body.teamID,
    token.firmID = req.body.firmID,
    token.industryID = req.body.industryID

    res.status(200).json({ message: "Session updated" });
}
