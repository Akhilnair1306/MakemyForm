"use client"
import { db } from '@/configs'
import { Jsonforms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import { ArrowLeft, Share, SquareArrowOutUpLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FormUi from '../FormUi'
import { toast } from 'sonner';
import Controller from '../_components/Controller'
import Themes from '@/app/_data/Themes'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RWebShare } from 'react-web-share'

function EditForm({ params }) {
    const { user } = useUser();
    const router = useRouter();
    const [jsonForm, setJsonForm] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(null);
    const [record, setRecord] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(Themes[0]);
    const [selectedBackground, setSelectedBackground] = useState('');

    useEffect(() => {
        if (user) {
            GetFormData();
        }
    }, [user]);

    const GetFormData = async () => {
        try {
            const result = await db.select().from(Jsonforms)
                .where(and(eq(Jsonforms.id, params?.formId), eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress)));

            if (result.length > 0) {
                const formData = result[0];
                console.log(formData);
                console.log(JSON.parse(formData.jsonform));

                // Set state variables
                setRecord(formData);
                setJsonForm(JSON.parse(formData.jsonform));
                setSelectedBackground(formData.background);

                // Find matching theme or default to first theme
                const themeFromDB = Themes.find(theme => theme.theme === formData.theme) || Themes[0];
                setSelectedTheme(themeFromDB);
            } else {
                console.warn("No form data found for the specified ID and user.");
            }
        } catch (error) {
            console.error("Error fetching form data:", error);
            // Handle error appropriately (e.g., show error message)
        }
    };

    useEffect(() => {
        if (updateTrigger) {
            setJsonForm(jsonForm);
            updateJsonFormInDb();
        }
    }, [updateTrigger]);

    const onFieldUpdate = (value, index) => {
        const updatedFields = [...jsonForm.formFields];
        updatedFields[index] = { ...updatedFields[index], ...value };
        setJsonForm({ ...jsonForm, formFields: updatedFields });
        setUpdateTrigger(Date.now());
    };

    const updateJsonFormInDb = async () => {
        try {
            // Debugging information
            console.log("Updating DB with jsonForm:", JSON.stringify(jsonForm));
            console.log("Record ID:", record.id);
            console.log("User Email:", user?.primaryEmailAddress?.emailAddress);

            await db.update(Jsonforms)
                .set({
                    jsonform: JSON.stringify(jsonForm)
                })
                .where(and(eq(Jsonforms.id, record.id), eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress)));

            console.log("Form data updated successfully");

            toast('Form updated successfully!');
        } catch (error) {
            console.error("Error updating form data:", error);
        }
    };

    const deleteField = (indexToRemove) => {
        const updatedFormFields = jsonForm.formFields.filter((_, index) => index !== indexToRemove);
        setJsonForm({ ...jsonForm, formFields: updatedFormFields });
        setUpdateTrigger(Date.now()); // Trigger the update to save changes to the database
    };

    const updateControllerFields = async (value, columnName) => {
        try {
            await db.update(Jsonforms).set({
                [columnName]: value
            })
                .where(and(eq(Jsonforms.id, record.id), eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress)))
                .returning({ id: Jsonforms.id });

            if (columnName === 'theme') {
                const themeFromDB = Themes.find(theme => theme.theme === value) || Themes[0];
                setSelectedTheme(themeFromDB);
            } else if (columnName === 'background') {
                setSelectedBackground(value);
            }

            toast('Updated successfully!');
        } catch (error) {
            console.error("Error updating controller fields:", error);
        }
    };

    return (
        <div className='p-10'>
            <div className='flex justify-between items-center'>
                <h2 className='flex gap-2 items-center my-5 cursor-pointer hover:font-bold' onClick={() => router.push('/dashboard')}>
                    <ArrowLeft /> Back
                </h2>
                <div className='flex gap-2'>
                    <Link href={'/aiform/' + record?.id} target='_blank'>
                        <Button className='flex gap-2'> <SquareArrowOutUpLeft className='h-5 w-5' />Live Preview</Button>
                    </Link>
                    <RWebShare
                        data={{
                            text: jsonForm?.formHeading + " ,Build your in Sec with makemyForm",
                            url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + record?.id,
                            title: jsonForm?.formTitle,
                        }}
                        onClick={() => console.log("shared successfully!")}
                    >
                        <Button className='flex gap-2 bg-green-500 hover:bg-green-700'><Share />Share</Button>
                    </RWebShare>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div className='p-5 border rounded-lg shadow-md'>
                    <Controller
                        selectedtheme={(value) => {
                            updateControllerFields(value.theme, 'theme');
                        }}
                        selectedBackground={(value) => {
                            updateControllerFields(value, 'background');
                        }}
                        setSignInEnable={(value) =>{
                            updateControllerFields(value, 'enabledSignin');
                        }}
                    />
                </div>
                <div className='md:col-span-2 border rounded-lg p-5 flex items-center justify-center'
                    style={{ backgroundImage: selectedBackground }}>
                    <FormUi jsonForm={jsonForm}
                        selectedtheme={selectedTheme}
                        onFieldUpdate={onFieldUpdate}
                        deleteField={deleteField} />
                </div>
            </div>
        </div>
    )
}

export default EditForm;
