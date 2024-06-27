import { Button } from '@/components/ui/button'
import { db } from '@/configs'
import { userResponses } from '@/configs/schema'
import { eq } from 'drizzle-orm';
import { LoaderIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function FormListItemForResponse({ jsonForm, formRecord }) {
    const [loading, setLoading] = useState(false);
    const [jsonData, setJsonData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await db.select().from(userResponses)
                .where(eq(userResponses.formRef, formRecord.id));
            
            if (result) {
                const parsedData = result.map(item => JSON.parse(item.jsonResponse));
                setJsonData(parsedData);
                setLoading(false);
            }
        };

        fetchData();
    }, [formRecord.id]);

    const ExportData = () => {
        setLoading(true);
        exporttoExcel(jsonData);
        setLoading(false);
    }

    const exporttoExcel = (jsonData) => {
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, jsonForm?.formTitle + ".xlsx");
    }

    return (
        <div>
            <div className='border shadow-sm rounded-lg p-4 my-5'>
                <h2 className='text-lg font-bold text-black'>{jsonForm?.formTitle}</h2>
                <h2 className='text-sm text-gray-800'>{jsonForm?.formHeading}</h2>
                <hr className='my-4'></hr>
                <div className='flex justify-between items-center'>
                    <h2 className='text-sm'><strong>{jsonData.length}</strong> Responses</h2>
                    <Button
                        onClick={ExportData}
                        className="" size="sm"
                        disabled={loading}>
                        {loading ? <LoaderIcon className='animatespin' /> : 'Export'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default FormListItemForResponse;
