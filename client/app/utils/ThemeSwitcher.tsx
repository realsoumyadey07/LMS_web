"use client"
import { useTheme } from 'next-themes';
import React from 'react';
import { useState, useEffect } from 'react';


const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme();
  useEffect(()=> setMounted(true),[]);
  if(!mounted){
     return null;
  }
  return (
    <div className="flex item-center justify-center mx-4">
     
    </div>
  )
}

export default ThemeSwitcher
