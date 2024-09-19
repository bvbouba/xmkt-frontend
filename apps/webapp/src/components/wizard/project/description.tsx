import { useForm } from "react-hook-form";
import { FormData } from ".";
import { useRouter } from "next/router";
import Link from "next/link";
import { ButtonNext, ButtonPrev } from "@/components/button";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/react";
import { decideStatusProps, marketProps } from "types";
import { fetchDecisionStatus, getMarketsData } from "features/data";
import usePaths from "@/lib/paths";


type props = {
    onNext: (data: FormData) => void;
    formData?: Partial<FormData>
  };
  
  export const Description: React.FC<props> = ({ onNext,formData }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const { market_id } = router.query;
  const marketID = typeof market_id === 'string' ? parseInt(market_id, 10) : null;
  const { data: session, status } = useSession();
  const { t } = useTranslation('common');
  const paths = usePaths()

  const [markets, setMarkets] = useState<marketProps[]>([]);
  const [decisionStatus, setDecisionStatus] = useState<decideStatusProps>();
  const [loading, setLoading] = useState(false);

  const { industryID, teamName } = session || {}; // Assuming participant data is stored in the session
  const market = markets.find(m => m.id === marketID)
  const firstLetter = teamName?.[0];
  const [secondLetter, setSecondLetter] = useState<string | undefined>(undefined);

  // Fetch decision status when industryID is available
  useEffect(() => {
    if (status === "authenticated" && industryID) {
      const fetchDecisionStatusData = async () => {
        try {
          const data = await fetchDecisionStatus({ industryID, token: session.accessToken });
          setDecisionStatus(data);
        } catch (error) {
          console.error('Error fetching decision status:', error);
        }
      };
      fetchDecisionStatusData();
    }
  }, [industryID, status]);

  const isDecisionInProgress = (decisionStatus?.status === 2) || (decisionStatus?.status === 0);

  // Fetch markets data on mount
  useEffect(() => {
    const fetchMarketData = async () => {
      if (status === "authenticated") {
        try {
          setLoading(true);
          const marketData = await getMarketsData();
          setMarkets(marketData);
          const selectedMarket = marketData.find(m => m.id === marketID);
          if (selectedMarket) {
            setSecondLetter(selectedMarket.name[1]);
          }
        } catch (error) {
          console.error('Error fetching markets:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMarketData();
  }, [marketID, status]);

  // Validation for the name field
  const validateName = (value: string) => {
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;
    if (!alphanumericRegex.test(value)) {
      return t("NAME_MUST_CONTAIN_ALPHANUMERIC_ONLY");
    }
    if ((value[0] !== firstLetter) || (value[1] !== secondLetter)) {
      return t("PROJECT_NAME_MUST_START", { firstLetter, secondLetter });
    }
  };

  if (isDecisionInProgress) {
    return <>{t("DECISION_IS_IN_PROGRESS")}</>;
  }

    return (

        <>
        
        <form onSubmit={handleSubmit(onNext)} className="">
     <div className="max-w-md">
      <div >
        <h2 className="g-subtitle text-xl text-blue-700">{t("PROJECT_NAME_AND_OBJECTIVE")} </h2>
        <span className="g-comment text-xs">{t("THE_NAME_IS_MANDATORY._IT_MUST_START_WITH_THE_LETTER", {firstLetter,secondLetter,market_name:market?.name})}.
        {t("THE_OBJECTIVE_IS_OPTIONAL,_BUT_SPECIFYING_A_CLEAR_OBJECTIVE_WILL_")}
        </span>

      </div>

      <div className="p-4">
        <div>
          <div className="row align-items-start">
          <div className="mb-5">
              <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="team"
            >
              {t("NAME")}
            </label>
            <input
              {...register("name",{
                validate: validateName,
                required:true,
                minLength:{value:3, message:t("MUST_BE_GREATER",{min:3})},
                maxLength:{value:20, message:t("MUST_BE_LESS",{max:20})}
              })}
              defaultValue={formData?.name}
              id="name"
              placeholder=""
              spellCheck={false}
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
            {!!errors.name && (
              <p className="text-sm text-red-500 pt-2">
                {errors.name?.message}
              </p>
            )}

            </div>
            <div className="mb-5">

            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="objective"
            >
              {t("OBJECTIVE")}
            </label>
            <textarea
              {...register("objective")}
              defaultValue={formData?.objective}
              id="objective"
              rows={4}
              placeholder=""
              className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />

            {!!errors.objective && (
              <p className="text-sm text-red-500 pt-2">
                {errors.objective?.message}
              </p>
            )}

            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div>
              <Link href={paths.decide.researchAndDevelopment.$url()}>
                <ButtonPrev>{t("R&D_OVERVIEW")}</ButtonPrev>
              </Link>
          
          </div>
          <div className="flex justify-end">
              <ButtonNext
                type="submit"
              >
                {t("NEXT")}
              </ButtonNext>
           
          </div>
        </div>
      </div>

      </form>
        </>
     );
}

export default Description;