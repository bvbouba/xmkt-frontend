// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { useTranslation } from 'react-i18next';


export function SectionTestimonial() {
    const { t } = useTranslation("common");

    const testimonials = [
        {
            title:t("Teacher"),
            fullName:"Rodrigue",
            statement:t("Integrating Simulation into my classroom curriculum has been transformative. It brings abstract concepts like brand management, segmentation, and positioning to life, giving students practical experience in a dynamic environment. The interactive nature of the tool sparks engagement and critical thinking, preparing students for the challenges of the modern business world")
        },
        {
            title:t("Student"),
            fullName:"Hassan",
            statement:t("Using the simulation has made marketing class engaging and practical. It's not just theory; we're applying strategies like brand management and segmentation in real-time. It's competitive and fun, and I'm learning skills that will help me in my future career.")
        },
        {
            title:t("Marketing Manager"),
            fullName:"Kouao",
            statement:t("The simulation tool provided an invaluable hands-on experience that deepened my understanding of some marketing concepts. It allowed me to experiment with different strategies in a risk-free environment, giving me insights that I could apply directly to my work. It's a powerful tool for professionals looking to sharpen their marketing skills.")
        }
    ]
  return (
    <section
      className="testimonial bg-testimonials bg-cover bg-right bg-no-repeat py-12
        xl:min-h-[595px] xl:py-0"
    >
      <div className="testimonial__container container mx-auto">
        <div className='flex flex-col items-center gap-x-14 xl:flex-row'>
        <div className="hidden xl:flex">
          <img src="img/testimonials/img.png" alt="" />
        </div>
        <div className="max-w-[98%] xl:max-w-[710px]">
          <Swiper
           // install Swiper modules
             modules={[Navigation, Pagination, Scrollbar, A11y]}
             spaceBetween={50}
             slidesPerView={1}
             navigation
             pagination={{ clickable: true }}
          >
            {testimonials.map((testimonial,idx)=><SwiperSlide  key={idx} >
                <div className='h-full flex flex-col justify-center items-start'>
                    <div className='max-w-[680px] mx-auto text-center xl:text-left'>
                        <p
                        className="font-light relative text-[22px] text-[#4c5354]
                        leading-[190%] text-center xl:text-left 
                        before:bg-quoteLeft before:bg-contain before:bg-bottom before:inline-block 
                        before:top-0 before:w-10 before:h-10 before:bg-no-repeat
                        after:bg-quoteRight after:bg-contain after:bg-bottom 
                        after:inline-block after:top-0 after:w-10 after:h-10
                        after:bg-no-repeat mb-7
                        "
                        >
                            <span className='mx-2'>
                             {testimonial.statement}
                            </span>
                        </p>
                        <div className='text-[26px] text-[#4c5354] font-semibold'>{testimonial.fullName}</div>
                        <div className='text-[#9ab4b7] font-medium uppercase tracking-[2.24px]'>{testimonial.title}</div>
                    </div>

                </div>
            </SwiperSlide>)}
            
          </Swiper>
        </div>
        </div>
      </div>
    </section>
  );
}

export default SectionTestimonial;
