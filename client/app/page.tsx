"use client"
import React, { FC, useState } from 'react'
import Heading from './utils/Heading';
import Header from './components/Header';
import Hero from "./components/Route/Hero";

interface Props { }

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  return (
    <>
      <Heading
        title='Youdemy'
        description='Youdemy is a platform for students to learn and get help from teachers'
        keywords='Programming, MERN, Redux, AI'
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
    </>
  )
}

export default Page;