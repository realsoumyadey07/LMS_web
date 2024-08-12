import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react'
import { BiSearch } from 'react-icons/bi';

type Props = {};

const Hero: FC<Props> = (props) => {
  return (
    <div className='w-full 1000px:flex items-center'>
      <div className='absolute top-[130px] left-1/2 transform -translate-x-1/2 xs:left-[unset] xs:top-[unset] xs:right-0 xs:bottom-0 lg:h-[700px] lg:w-[700px] md:h-[600px] md:w-[600px] sm:h-[50vh] sm:w-[50vh] xs:h-[200px] xs:w-[200px] h-[150px] w-[150px] hero_animation rounded-full'></div>
      <div className='1000px:w-[40%] flex 1000px:min-h-screen items-center justify-center pt-[70px] 1000px:pt-[0] z-10'>
        <Image
          src={require("../../../public/assests/hero-pic1.png")}
          alt=''
          className='object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]'
        />
      </div>
      <div className='1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]'>
        <h2 className='dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[70px] font-600 font-Josefin py-2 1000px:leading-[75px] '>Improve your Online Learning Experience Better Instantly</h2>
        <br />
        <p className='dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%]'>We have 40k+ Online courses & 500k+ Online registered student. Find your desired Courses from here.</p>
        <br />
        <br />
        <div className='1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative'>
          <input 
          type="search" 
          placeholder='Search courses here...'
          className='bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 px-5 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin'
          />
          <div className='absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#2942ff] rounded-r-[5px]'>
            <BiSearch className='text-white' size={30}/>
          </div>
        </div>
        <br />
        <br />
        <div className='1500px:w-[55%] 1100px:w-[78%] w-[90%] flex items-center'>
          <img src="https://edmy-react.hibootstrap.com/images/banner/client-3.jpg" alt="" className='rounded-full' />
          <img src="https://edmy-react.hibootstrap.com/images/banner/client-1.jpg" alt="" className='rounded-full ml-[-20px]'/>
          <img src="https://edmy-react.hibootstrap.com/images/banner/client-2.jpg" alt="" className='rounded-full ml-[-20px]'/>
          <p className='font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600] pl-2'>500k+ People already trusted us.{" "}
            <Link 
            href={"/courses"}
            className='dark:text-[#46e256] text-[crimson]'
            >
              View Courses
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero
