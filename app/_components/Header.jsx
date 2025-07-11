"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Header() {
  const {user,isSignedIn} = useUser();
  const path = usePathname();
  useEffect(() => {
    console.log(path)
  }, [])
  
  return !path.includes('aiform')&&(
    <div className='p-5 border-b shadow-sm'>
        <div className='flex items-center justify-between'>
          <Link href= "/">
          <div className='flex gap-5 cursor-pointer'>
            <Image src={'/logo.svg'} width={35} height={35} alt="logo"/>
            <h2 className='text-2xl font-bold'>MakemyForm</h2>
            </div>
            </Link>
            {isSignedIn?
            <div className='flex items-center gap-5'>
              <Link href={'/dashboard'}>
            <Button variant="outline">Dashboard</Button>
            </Link>
            <UserButton />
            </div>:
            <SignInButton>
            <Button>Get Started</Button>
            </SignInButton>
            }
            
        </div>
    </div>
  )
}

export default Header