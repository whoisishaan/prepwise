import dayjs from 'dayjs';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from "./DisplayTechIcons";


const getRandomInterviewCover = () => {
    const covers = [
     "/covers/adobe.png",
  "/covers/amazon.png",
  "/covers/facebook.png",
  "/covers/hostinger.png",
  "/covers/pinterest.png",
  "/covers/quora.png",
  "/covers/reddit.png",
  "/covers/skype.png",
  "/covers/spotify.png",
  "/covers/telegram.png",
  "/covers/tiktok.png",
  "/covers/yahoo.png",
    ];
    const randomIndex = Math.floor(Math.random() * covers.length);
    return covers[randomIndex];
  };
  

interface IntervieCardProps {
    interviewId: string;
    userId: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt: string | number;
}

const InterviewCard = ({interviewId, userId, role, type, techstack, createdAt}: IntervieCardProps ) => {
    const feedback = null as Feedback | null;
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY')
   
    return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
        <div className = "card-interview">

            <div>
                <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                    <p className='badge-text'>{normalizedType}</p>
                </div>
                    <Image src = {getRandomInterviewCover()} alt = "cover image" width={90} height={90} className='rounded-full object-fit size-[90px'></Image>
                    <h3 className='mt-5 capitalize'>
                        {role} Interview
                    </h3>

                    <div className='flex flex-col gap-5 mt-3'>
                        <div className='flex flex-row gap-5 items-center'>
                        <div className='flex flex-row gap-2 items-center'>
                            <Image src = '/calendar.svg' alt = 'calendar' width={22} height={22}></Image>
                            <p>{formattedDate}</p>
                        </div>

                        <div className='flex flex-row gap-2 items-center'>
                            <Image src = "/star.svg" alt="star" width={22} height={22}></Image>
                            <p>{feedback?.totalScore || '---'}/100</p>
                        </div>
                         
                        </div>

                        <p className='line-clamp-2 mt-0'>
                            {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills"}
                            </p> 
                       
                    </div> 

                    <div className='flex flex-row justify-between mt-3'>
                    <DisplayTechIcons techStack= {techstack}/>
                        <Button className="btn-primary">
                            <Link href = {feedback? '/interview/${interviewId}/feedback' : '/interview/${interviewId}' }>
                            {feedback? 'Check Feedback' : 'Take Interview'}
                            </Link>
                        </Button>
                    </div>

            </div>


        </div>




    </div>
  );
}

export default InterviewCard