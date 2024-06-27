"use client"
import { db } from '@/configs';
import { Jsonforms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import FormListItem from './FormListItem';

function FormList() {
    const { user } = useUser();
    const [formList, setFormList] = useState([]);

    useEffect(() => {
        if (user) {
            getFormList();
        }
    }, [user]);

    const getFormList = async () => {
        try {
            const result = await db.select().from(Jsonforms)
                .where(eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(Jsonforms.id));
            setFormList(result);
            console.log(result);
        } catch (error) {
            console.error('Error fetching form list:', error);
        }
    };

    return (
        <div className='mt-5 grid grid-cols-2 md:grid-cols-2 gap-5'>
            {formList.map((form, index) => (
                <div key={index}>
                    {/* Corrected props usage: jsonForm instead of JsonForm */}
                    <FormListItem 
                    formRecord ={form}
                    jsonForm={JSON.parse(form.jsonform)}
                    refreshData = {getFormList} />
                </div>
            ))}
        </div>
    );
}

export default FormList;
