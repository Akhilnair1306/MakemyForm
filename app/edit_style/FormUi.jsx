import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from '@/components/ui/checkbox';
import FieldEdit from './_components/FieldEdit';
import { db } from '@/configs';
import moment from 'moment';
import { toast } from 'sonner';
import { userResponses } from '@/configs/schema';
import { useRouter } from 'next/navigation';
import { TrendingUp } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { SignIn, SignInButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

function FormUi({ jsonForm, onFieldUpdate, deleteField, selectedtheme, editable = true,submitbt = true,formId = 0,enabledSignIn = false}) {
    const [formData, setFormData] = useState({});
    const router = useRouter();

    const{user,isSignedIn} =useUser();

    let formRef = useRef(null);
    
    const onFormSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
        const result = await db.insert(userResponses)
        .values({
            jsonResponse: formData,
            createdDate: moment().format('YYYY-MM-DD HH:mm:ss'), 
            formRef: formId
       })

       if(result)
        {
            formRef.current.reset();
            router.push('/')
            toast('Response Submitted Successfully !')
        }
        else{
            toast("Internal Server ERROR")
        }
    }

    const handleCheckboxChange = (fieldName,itemName,value)=>{
        console.log(fieldName,itemName,value)
        const list = formData?.[fieldName]?formData?.[fieldName]:[];
        console.log(list)
        if(value)
            {
                list.push({
                    formLabel: itemName,
                    value: value
                })
                setFormData({
                    ...formData,
                    [fieldName]: list
                })
            }
            else{
                const result = list.filter((item) => item.label == itemName);
                setFormData({
                    ...formData,
                    [fieldName]: result
                })
            }
            console.log(formData)
    }

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const defaultTheme = {
        add: '#000',
        base100: '#fff',
        primary: '#000',
        primaryContent: '#000',
        neutral: '#fff'
    };

    const theme = selectedtheme || defaultTheme;
    const textColor = { color: theme.add };

    return (
        <form 
            ref={formRef}
            onSubmit={onFormSubmit}
            className='border p-5 md:w-[600px] rounded-lg' 
            style={{ color: theme.add, backgroundColor: theme.base100 }}
        >
            <h2 className='font-bold text-center text-2xl'>{jsonForm?.formTitle}</h2>
            <h3 className='text-sm text-gray-400 text-center'>{jsonForm?.formHeading}</h3>
            <h4 className='text-sm text-gray-400 text-center'>{jsonForm?.formSubheading}</h4>

            {jsonForm?.formFields?.map((field, index) => (
                <div key={index} className='my-4 flex items-center gap-2'>
                    {field.fieldType === 'select' ? (
                        <div className="w-full">
                            <Label className='text-sm text-gray-600 w-full' style={textColor}>{field.formLabel}</Label>
                            <Select onValueChange={(v) => handleSelectChange(field.fieldName, v)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={field.placeholderName} style={textColor} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options.map((item, index) => (
                                        <SelectItem key={index} value={item.value} style={{ color: theme.primary }}>{item.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : field.fieldType === 'radio' ? (
                        <div className='my-3 w-full'>
                            <Label className='text-sm text-gray-600' style={textColor}>{field.formLabel}</Label>
                            <RadioGroup>
                                {field.options.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2 my-2 w-full">
                                        <RadioGroupItem value={item.value} id={item.value} onClick={() => handleSelectChange(field.fieldName, item.label)} />
                                        <Label htmlFor={item.value} style={textColor}>{item.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    ) : field.fieldType === 'checkbox' ? (
                        <div className='my-3 w-full'>
                            <Label className='text-sm text-gray-600' style={textColor}>{field.formLabel}</Label>
                            {field.options ? field.options.map((item, index) => (
                                <div key={index} className='flex gap-2 items-center my-2'>
                                    <Checkbox onCheckedChange={(v) =>handleCheckboxChange(field?.formLabel,item.label,v)} />
                                    <Label htmlFor={item.value} style={textColor}>{item.label}</Label>
                                </div>
                            )) : (
                                <div className='flex gap-2 items-center'>
                                    <Checkbox />
                                    <Label style={textColor}>{field.formLabel}</Label>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='w-full'>
                            <Label className='text-sm text-gray-600' style={textColor}>{field.formLabel}</Label>
                            <Input
                                type={field.fieldType}
                                placeholder={field.placeholderName}
                                name={field.fieldName}
                                required={field.isRequired}
                                style={{ color: theme.primaryContent, backgroundColor: theme.neutral }}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>
                    )}
                    {editable && (
                        <div>
                            <FieldEdit 
                                defaultValue={field}
                                onUpdate={(value) => onFieldUpdate(value, index)}
                                deleteField={() => deleteField(index)}
                            />
                        </div>
                    )}
                </div>
            ))}
            {!enabledSignIn?
            <button 
            disabled ={submitbt}
                type='submit'
                className='btn rounded-lg'
                style={{ backgroundColor: selectedtheme?.primary, color: selectedtheme?.primaryContent }}
            >
                {submitbt ? "Disabled" : "Submit"}
            </button>:
            isSignedIn?
             <button 
             disabled ={submitbt}
                 type='submit'
                 className='btn rounded-lg'
                 style={{ backgroundColor: selectedtheme?.primary, color: selectedtheme?.primaryContent }}
             >
                 {submitbt ? "Disabled" : "Submit"}
             </button>:
             <Button>
                <SignInButton mode='modal'>Sign in before Submit</SignInButton>
             </Button>
        }
            
        </form>
    );
}

export default FormUi;
