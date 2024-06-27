"use client"
import Themes from '@/app/_data/Themes'
import FormUi from '@/app/edit_style/FormUi'
import { db } from '@/configs'
import { Jsonforms } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function LiveAiForm({ params }) {
    const [record, setRecord] = useState();
    const [jsonForm, setJsonForm] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(null);

    useEffect(() => {
        if (params) {
            GetFormData();
        }
    }, [params]);

    const GetFormData = async () => {
        const result = await db.select().from(Jsonforms)
            .where(eq(Jsonforms.id, Number(params?.formid)));
        
        if (result.length > 0) {
            const formData = result[0];
            setRecord(formData);
            setJsonForm(JSON.parse(formData.jsonform));
    
            // Find the theme that matches formData.theme
            const themeFromDB = Themes.find(theme => theme.theme === formData.theme);
    
            // If themeFromDB is not found, default to the first theme in Themes
            setSelectedTheme(themeFromDB || Themes[0]);
    
            console.log("Selected Theme:", themeFromDB || Themes[0]);
        }
    }

    return (
        <div className='p-10 flex justify-center items-center'
            style={{ backgroundImage: record?.background }}>
            {record && (
                <FormUi
                    jsonForm={jsonForm}
                    onFieldUpdate={() => console.log}
                    deleteField={() => console.log}
                    selectedtheme={selectedTheme}
                    editable={false}
                    submitbt={false}
                    formId={record.id}
                    enabledSignIn ={record?.enabledSignIn}
                />
            )}
        </div>
    )
}

export default LiveAiForm;

