import { useTranslation } from "react-i18next";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export function SectionFaq() {
    const { t } = useTranslation("common");
    const [expandedItem, setExpandedItem] = useState<number | null>(null);

    const faqs = [
        {
            question:t("What are the main benefits of Business Simulations?"),
            answer:t("Business simulations offer a risk-free learning environment, allowing learners to apply theoretical concepts practically. They provide instant feedback, accelerating the learning process, and boost retention through engaging, competitive decision-making experiences.")
        },
        {
            question:t("What do you learn from Business Simulations?"),
            answer:t("Engaging in our simulations fosters the development of diverse skills, including critical decision-making, teamwork, and the ability to perform under pressure, among others.")
        },
        {
            question:t("What education level is necessary for participants?"),
            answer:t("Our simulations cater to undergraduates, graduates (including MBA and Executive Education students), and professionals in the workforce.")
        },
        {
            question:t("Is there a minimum and/or maximum number of participants that can take part in the simulations?"),
            answer:t("We suggest a minimum of 15 participants for optimal engagement in our simulations, typically organized into teams of 2-3 participants each, depending on the simulation. However, there's no maximum limit to the number of participants who can join a simulation.")
        },
        {
            question:t("How can I purchase a simulation?"),
            answer:t("Our simulations operate on a licensing model, with one license assigned to each participant. We exclusively offer licenses associated with programs and do not sell individual licenses.To begin, you must first undergo validation as an instructor on our website. Simply visit the Register section to initiate the process.")
        }
    ]

    const handleToggleAnswer = (index:number) => {
        setExpandedItem(expandedItem === index ? null : index);
      };

    return ( 
        <section className="faq">
      <div className="container mx-auto">
        <h2 className="faq__title h2 text-center mb-[50px]">{t("We've got answers")}</h2>
      </div>
      <div className="max-w-5xl mx-auto">
        {faqs.map((faq, idx) => (
          <div key={idx} className="faq__item px-[30px] pt-7 pb-4 border-b cursor-pointer select-none">
            <div className="flex items-center justify-between mb-[10px]" onClick={() => handleToggleAnswer(idx)}>
              <h4 className="h4">{faq.question}</h4>
              <div className="faq__btn text-accent">
                <FontAwesomeIcon className="text-2xl" icon={faAdd} style={{ transform: expandedItem === idx ? "rotate(45deg)" : "none" }} />
              </div>
            </div>
            <div className={`faq__answer overflow-hidden transition-all ${expandedItem === idx ? 'h-auto' : 'h-0'}`}>
              <p className="font-light">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
     );
}

export default SectionFaq;