import { useEffect, useState } from 'react';
import { getTaskProgress } from 'features/data';
import { useTranslation } from '@/app/i18n';

interface ProgressBarProps {
  taskId: string;
  accessToken: string;
  onComplete: () => void;
  lng: string,
  label?:string
}

export default function ProgressBar({ taskId, accessToken, onComplete,lng,label }: ProgressBarProps) {
  const { t } = useTranslation(lng);
  const [taskProgress, setTaskProgress] = useState<number>(0);
  const [taskStatus, setTaskStatus] = useState<string>('PENDING');
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timerId: NodeJS.Timeout;

    const fetchTaskProgress = async () => {
      try {
        const progressData = await getTaskProgress(taskId, accessToken);
        const progressPercentage = Math.min(progressData.progress * 100, 100); // Ensure it stays within 100%
        setTaskProgress(progressPercentage); // Convert to percentage
        setTaskStatus(progressData.status);

        // Stop polling when the task is complete
        if (progressData.status === 'SUCCESS' || progressData.status === 'FAILURE') {
          clearInterval(intervalId);
          clearInterval(timerId); // Stop the timer
          if (progressData.status === 'SUCCESS') {
            onComplete(); // Trigger the callback to update the table
          }
        }
      } catch (error) {
        console.error('Error fetching task progress:', error);
      }
    };

    // Start polling for task progress every 2 seconds
    intervalId = setInterval(fetchTaskProgress, 2000);
    // Timer to track elapsed time
    timerId = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 2);
    }, 2000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timerId);
    };
  }, [taskId, accessToken, onComplete]);

  // Determine progress bar color based on task status
  const progressBarColor =
    taskStatus === 'SUCCESS' ? 'bg-green-600' : taskStatus === 'FAILURE' ? 'bg-red-600' : 'bg-indigo-600';
  
  const getStatusTranslated = ()=>{
    switch (taskStatus) {
      case 'SUCCESS':
        return t('success')
      case 'FAILURE':
          return t('failure')
      case 'PENDING':
          return t('pending')
      default:
        return taskStatus;
    }
  }  
  return (
    <div>
      <div className="h-2 bg-gray-300 rounded-full">
        <div
          className={`h-full rounded-full ${progressBarColor}`} // Dynamically apply color
          style={{ width: `${taskProgress}%` }}
        />
      </div>
      {label && <p className="mt-4 text-sm text-gray-500 uppercase">{label} </p>}
      <p className="text-sm text-gray-500">{t("status")}: {getStatusTranslated()}</p>
      <p className="text-sm text-gray-500">{t("progress")}: {taskProgress.toFixed(2)}%</p> {/* Display percentage */}
      <p className="text-sm text-gray-500">{t("elapsed_time")}: {elapsedTime} {t("seconds")}</p>
    </div>
  );
}

