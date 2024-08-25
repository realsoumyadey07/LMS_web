"use client"
import React, { useState } from 'react'
import Protected from '../hooks/useProtected'
import Heading from '../utils/Heading'
import Header from '../components/Header'

type Props = {}

const page = (props: Props) => {
     const [open, setOpen] = useState(false);
     const [activeItem, setActiveItem] = useState(0);
     const [route, setRoute] = useState("Login");
     return (
          <div>
               <Protected>
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
               </Protected>
          </div>
     )
}

export default page