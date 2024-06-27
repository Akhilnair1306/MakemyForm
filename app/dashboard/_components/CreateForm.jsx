"use client"
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AiChatSession } from '@/configs/AiModal';
import { Jsonforms } from '@/configs/schema';
import { useUser } from '@clerk/clerk-react';
import moment from 'moment';
import { db } from '@/configs';
import { useRouter } from 'next/navigation';

function CreateForm({ open, onClose }) {
    const prompt = ",Based on the description, please provide me with a form in JSON format. The JSON should include formTitle, formHeading, formSubheading, and formFields. Each field in formFields should have the following properties: formLabel, placeholderName, fieldName, fieldType, and isRequired. Ensure the field names are consistently named as formLabel and placeholderName. The fieldType cannot be dropdown; use select instead. Always include  field at the end I agree to terms and conditions, which should be required. Also make sure each option in the options array is defined as an object with label and value properties.";
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const route = useRouter();

    const onCreateForm = async () => {
        setLoading(true);
        try {
            const result = await AiChatSession.sendMessage("Description:" + userInput + prompt);
            const responseText = await result.response.text();
            console.log(responseText);
            const resp = await db.insert(Jsonforms).values({
                jsonform: responseText,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdDate: moment().format('YYYY-MM-DD HH:mm:ss')
            }).returning({ id: Jsonforms.id });
            console.log("New Form ID", resp[0].id);
            if (resp[0].id) {
                route.push('/edit_style/' + resp[0].id);
            }
            setLoading(false);
            onClose();
        } catch (error) {
            console.error('Error sending message:', error);
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Form</DialogTitle>
                    <DialogDescription>
                        <div>
                            <Textarea className='my-3'
                                onChange={(event) => setUserInput(event.target.value)}
                                placeholder="Write Description of your form" />
                        </div>
                        <div className='flex gap-2 my-3 justify-end'>
                            <Button variant="destructive" onClick={onClose}>Cancel</Button>
                            <Button disabled={loading} onClick={onCreateForm}>
                                {loading ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default CreateForm;
