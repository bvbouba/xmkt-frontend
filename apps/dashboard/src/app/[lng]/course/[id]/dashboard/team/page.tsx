'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/app/i18n';

interface Brand {
  id: number;
  name: string;
  advertising: number;
  price: number;
  production: number;
  channel_1: number;
  channel_2: number;
}

interface ErrorLog {
  message: string;
  severity: number;
}

interface TeamDecision {
  brands: Brand[];
  errorLogs: ErrorLog[];
}

export default function Page({ params: { lng, id, teamId } }: { params: { lng: string; id: number; teamId: number } }) {
  const { t } = useTranslation(lng);
  const [teamDecision, setTeamDecision] = useState<TeamDecision | null>(null);
 

  return (
    <div className="p-8">
       {t("not_ready_yet")}
    </div>
  );
}
