"use client";
import Link from "next/link";
import React, { FC, useState, useEffect } from "react";
import NavItems from "../utils/navItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import Verification from "../components/auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assests/user-png.png"
import { useSession } from "next-auth/react";
import { useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";


type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ open, activeItem, setOpen, route, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const {data} = useSession();
  const [socialAuth, {isSuccess, error}] = useSocialAuthMutation();
  console.log(data);
  console.log(user?.name);
  console.log(user);

  useEffect(()=> {
    if(!user){
      if(data){
        socialAuth({
          email: data?.user?.email,
          name: data?.user?.name,
          avatar: data?.user?.image
        })
      }
    }
    if(isSuccess){
      toast.success("Login Successfully");
    }
  },[data, user])

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full relative">
      <div
        className={`${active
          ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
          : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
          }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
                Youdemy
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {user ? (
                <Link href={"/profile"}>
                  <Image
                    src={user.avatar? user.avatar: avatar}
                    alt="user"
                    className="w-[45px] h-[30px] rounded-full cursor-pointer"
                  />
                </Link>
              ) : (<HiOutlineUserCircle
                size={25}
                className="hidden 800px:block cursor-pointer dark:text-white text-black mr-3"
                onClick={() => setOpen(true)}
              />)}
              <div className="800px:hidden mr-2">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* mobile sidebar */}
        {openSidebar && (
          <div
            id="screen"
            className="800px:hidden fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              {user ? (
                <Link href={"/profile"}>
                  <Image
                    src={user?.avatar? user.avatar : avatar}
                    alt="user"
                    className="w-[45px] h-[30px] rounded-full cursor-pointer ml-4"
                  />
                </Link>
              ) : (<HiOutlineUserCircle
                size={25}
                className="hidden 800px:block cursor-pointer dark:text-white text-black mr-3"
                onClick={() => setOpen(true)}
              />)}
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright @ 2024 Youdemy
              </p>
            </div>
          </div>
        )}
      </div>
      {
        route === "Sign-Up" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={Signup}
                />
              )
            }
          </>
        )
      }
      {
        route === "Login" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={Login}
                />
              )
            }
          </>
        )
      }
      {
        route === "Verification" && (
          <>
            {
              open && (
                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  setRoute={setRoute}
                  activeItem={activeItem}
                  component={Verification}
                />
              )
            }
          </>
        )
      }
    </div>
  );
};

export default Header;
