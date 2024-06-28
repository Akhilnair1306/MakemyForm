"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateForm from '../dashboard/_components/CreateForm';
import { SignInButton, useUser } from '@clerk/nextjs';

function Hero() {
    const { user, isSignedIn } = useUser();
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <div>
            <section className="bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen ">
                    <div className="mx-auto max-w-xl text-center">
                        <h1 className="text-3xl font-extrabold sm:text-5xl">
                            Effortless Form with
                            <strong className="font-extrabold text-primary sm:block"> AI Precision </strong>
                        </h1>

                        <p className="mt-4 sm:text-xl/relaxed">
                            Generate dynamic forms with unparalleled accuracy using AI technology. Simplify form creation, ensure precision, and effortlessly capture data with intelligently designed forms tailored to your needs.
                        </p>
                        {isSignedIn ? (
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
                                <a
                                    className="block w-full rounded px-12 py-3 text-sm font-medium text-primary shadow hover:text-blue-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
                                    href="#"
                                >
                                    Learn More
                                </a>
                            </div>
                        ) : (
                            <div className='gap-4 mt-8'>
                            <SignInButton>
                                <Button>Get Started</Button>
                            </SignInButton>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <CreateForm open={openDialog} onClose={() => setOpenDialog(false)} />
        </div>
    );
}

export default Hero;

