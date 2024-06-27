"use client"
import { db } from '@/configs';
import { Jsonforms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import FormListItemForResponse from './_components/FormListItemForResponse';

function Responses() {
    const [formList, setFormList] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            getFormList();
        }
    }, [user]);

    const getFormList = async () => {
        try {
            const result = await db.select().from(Jsonforms)
                .where(eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress));
            setFormList(result);
            console.log(result);
        } catch (error) {
            console.error('Error fetching form list:', error);
        }
    };

    return formList&&(
        <div className='mx-2'> 
            <h2 className='font-bold text-3xl flex items-center justify-between p-10'>Responses</h2>
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-5 mx-4'>
            {formList&&formList.map((form, index) => (
                <div key={index}>
                    {/* Corrected props usage: jsonForm instead of JsonForm */}
                    <FormListItemForResponse
                    formRecord ={form}
                    jsonForm={JSON.parse(form.jsonform)}
                     />
                </div>
            ))}
            </div>
        </div>
    );
}

export default Responses;
