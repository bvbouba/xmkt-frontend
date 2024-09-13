'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { assignParticipantTeam, fetchParticipants, getCourse } from '@/lib/data';
import { useTranslation } from '@/app/i18n';
import { useSession } from 'next-auth/react';
import { Industry, Participant, Team } from '@/lib/data/type';

interface TeamFormValues {
  industry: string;
  team: string;
  availableParticipants: Participant[];
  assignedParticipants: Participant[];
}

export default function Form ({ lng, id }: { lng: string, id: number }) {
  const { register, handleSubmit, watch } = useForm<TeamFormValues>();
  const { t } = useTranslation(lng);
  const { data: session, status } = useSession();
  const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const industry = watch("industry")
  const team = watch("team")
  const [assignedParticipants, setAssignedParticipants] = useState<Participant[]>([]);
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (id && status === "authenticated") {
      const fetchData = async () => {
        try {
          const courseData = await getCourse({courseId:id, token:session.accessToken});
          setIndustries(courseData.industry);
        } catch (error) {
          console.error('Error fetching data:', error);
        } 
      };

      fetchData();
    }
  }, [status]);
  
  useEffect(() => {
    if (id && status === "authenticated") {
      const fetch = async () => {
        try {
          const response = await fetchParticipants(id, session.accessToken);
          setParticipants(response);
          setAvailableParticipants(response.filter(row => row.team.length === 0));
        } catch (error) {
          console.error('Error fetching participants:', error);
        }
      };
      fetch();
    }
  }, [status]);

  useEffect(() => {
    setError("");
    const selectedIndustry = industries.find(i => i.id === parseInt(industry));
    if (selectedIndustry) {
      setTeams(selectedIndustry?.teams);
    }
  }, [industry]);

  useEffect(() => {
    const selectedTeam = teams.find(i => i.id === parseInt(team));
    if (selectedTeam) {
      setAssignedParticipants(participants.filter(p => selectedTeam.participant_list.includes(p.id)));
    }
  }, [team]);

  const [searchTerm, setSearchTerm] = useState('');


  const filteredParticipants = availableParticipants.filter(participant =>
    participant.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assignParticipant = async (participant: Participant) => {
    if (!industry || !team) {
      setError(t('please_select_industry_and_team_first'));
      return;
    }
    
    setAssignedParticipants([...assignedParticipants, participant]);
    setAvailableParticipants(availableParticipants.filter(p => p.id !== participant.id));
    if (status === "authenticated" && team) {
      await assignParticipantTeam({ participantId: participant.id, teamId: parseInt(team), token: session?.accessToken });
      
      setTeams(teams.map(t => {
        if (t.id === parseInt(team)) {
          t.participant_list.push(participant.id);
        }
        return t;
      }));
      
      setAvailableParticipants(availableParticipants.filter(p => p.id !== participant.id));
    }
  };

  const removeParticipant = async (participant: Participant) => {
    setAvailableParticipants([...availableParticipants, participant]);
    setAssignedParticipants(assignedParticipants.filter(p => p.id !== participant.id));
    if (status === "authenticated") {
      await assignParticipantTeam({ participantId: participant.id, token: session?.accessToken });
      
      setTeams(teams.map(t => {
        if (t.id === parseInt(team)) {
          return {
            ...t,
            participant_list: t.participant_list.filter(p => p !== participant.id),
          };
        }
        return t;
      }));
      
      setAvailableParticipants([...availableParticipants, participant]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">{t('form_teams')}</h1>
      <form  className="space-y-6">
        <div>
          {error && <span className="text-red-600 text-sm">{error}</span>}
          <label className="block text-sm font-medium text-gray-700">{t('industry')}</label>
          <select {...register('industry')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">{t('select_industry')}</option>
            {industries.map(industry => <option key={industry.id} value={industry.id}>{industry.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('team')}</label>
          <select {...register('team')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">{t('select_team')}</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('available_participants')}</label>
            <input
              type="text"
              placeholder={t('search_by_name')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            />
            <ul className="border border-gray-300 rounded-md h-64 overflow-y-auto">
              {filteredParticipants.map(participant => (
                <li
                  key={participant.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => assignParticipant(participant)}
                >
                  {participant.last_name} {participant.first_name}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center items-center space-y-4">
            <FontAwesomeIcon 
              icon={faArrowRight} 
              className="text-xl cursor-pointer"
              onClick={() => {
                if (filteredParticipants.length > 0) {
                  assignParticipant(filteredParticipants[0]);
                }
              }}
            />
            <FontAwesomeIcon 
              icon={faArrowLeft} 
              className="text-xl cursor-pointer"
              onClick={() => {
                if (assignedParticipants.length > 0) {
                  removeParticipant(assignedParticipants[0]);
                }
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('assigned_participants')}</label>
            <ul className="border border-gray-300 rounded-md h-64 overflow-y-auto">
              {assignedParticipants.map(participant => (
                <li
                  key={participant.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => removeParticipant(participant)}
                >
                  {participant.last_name} {participant.first_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t('submit')}
        </button> */}
      </form>
    </div>
  );
}
