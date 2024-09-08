import { CourseDetails } from "./data/type";

export const calculateTotalParticipants = (course: CourseDetails) => {
    let totalParticipants = 0;
  
    course.industry.forEach((industry: any) => {
      industry.teams.forEach((team: any) => {
        totalParticipants += team.participant_list.length;
      });
    });
  
    return totalParticipants;
  };