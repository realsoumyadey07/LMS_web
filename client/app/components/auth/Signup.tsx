"use client"
import React, { FC, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { styles } from '../../../app/styles/style';
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useRegisterMutation } from '../../../redux/features/auth/authApi';
import toast from 'react-hot-toast';

type Props = {
  setRoute: (route: string) => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string().email("Invalid email!").required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6).max(12)
});

const SignUp: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, {isError, data, isSuccess, error}] = useRegisterMutation();
  useEffect(()=>{
    if(isSuccess){
      const message = data?.message || "Registration successful";
      toast.success(message);
      setRoute("Verification");
    }
    if(error){
      if("data" in error){
        const errorData = error as any;
        toast.error(errorData.data.message)
      }
    }
  },[isSuccess, error] )
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = {
        name, email, password
      }
      await register(data);
      console.log(name, email, password);
    }
  });
  const { errors, touched, values, handleChange, handleSubmit } = formik;
  return (
    <div className='w-full'>
      <h1 className={`${styles.title}`}>SignUp with Youdemy</h1>
      <form onSubmit={handleSubmit}>
      <div className='w-full mt-5 relative mb-1 flex flex-col'>
          <label
            htmlFor="email"
            className={`${styles.label}`}
          >
            Enter your name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={values.name}
            onChange={handleChange}
            placeholder='Enter your name here'
            className={`${errors.name && touched.name && "border-red-500"} ${styles.input}`}
          />
          {errors.name && touched.name && (
            <span className='text-red-500 pt-2 block'>{errors.name}</span>
          )}
        </div>
        <div className='w-full mt-5 relative mb-1 flex flex-col'>
          <label
            htmlFor="email"
            className={`${styles.label}`}
          >
            Enter your email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
            placeholder='Enter your email here'
            className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`}
          />
          {errors.email && touched.email && (
            <span className='text-red-500 pt-2 block'>{errors.email}</span>
          )}
        </div>
        <div className='w-full mt-5 relative mb-1 flex flex-col'>
          <label
            htmlFor="password"
            className={`${styles.label}`}
          >Enter your Password</label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            placeholder='Enter your password here'
            className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              size={20}
              className='absolute bottom-3 right-2 z-1 cursor-pointer'
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              size={20}
              className='absolute bottom-3 right-2 z-1 cursor-pointer'
              onClick={() => setShow(false)}
            />
          )}
          {errors.password && touched.password && (
            <span className='text-red-500 pt-2 block'>{errors.password}</span>
          )}
        </div>
        <div className='w-full mt-8'>
          <input
            type="submit"
            value="Sign Up"
            className={`${styles.button}`}
          />
        </div>
        <br />
        <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
          Or join with
        </h5>
        <div className='flex items-center justify-center my-3'>
          <FcGoogle size={30} className='cursor-pointer mr-2' />
          <AiFillGithub size={30} className='cursor-pointer mr-2' />
        </div>
        <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>Already have an account?{" "}
          <span
            className='text-[#2190ff] pl-1 cursor-pointer'
            onClick={() => setRoute("Login")}
          >
            Login
          </span>
        </h5>
      </form>
    </div>
  )
}

export default SignUp