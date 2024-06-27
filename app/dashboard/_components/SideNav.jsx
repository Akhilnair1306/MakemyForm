import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { db } from '@/configs';
import { Jsonforms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import { BarChart3, BookMarked, MessageSquareQuote, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React,{useEffect, useState} from 'react';

function SideNav() {
    const menuList = [
        {
            id: 1,
            name: 'My Forms',
            icon: BookMarked,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'Responses',
            icon: MessageSquareQuote,
            path: '/dashboard/responses'
        }
    ];

    const path = usePathname();
    useEffect(() => {
      getFormList();
    }, [path])
    
    const {user} = useUser();
    const[formList,setFormList] =useState();
    const[percFileCreated,setPercFileCreated] =useState();
    const getFormList = async () => {
        try {
            const result = await db.select().from(Jsonforms)
                .where(eq(Jsonforms.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(Jsonforms.id));
            setFormList(result);
            const perc = (result.length/3)*100;
            setPercFileCreated(perc);
            console.log(result);
        } catch (error) {
            console.error('Error fetching form list:', error);
        }
    };
    return (
        <div className='h-screen shadow-md border'>
            <div className='p-5'>
                {menuList.map((menu) =>
                    <Link key={menu.id} href={menu.path} className={`flex items-center gap-3 p-4 hover:bg-primary hover:text-white rounded-lg cursor-pointer mb-3
                    ${path == menu.path && 'bg-primary text-white'}`}>
                        <menu.icon />
                        {menu.name}
                    </Link>
                )}
            </div>
            <div className='fixed bottom-10 p-6 w-64'>
                <Button className='w-full'>+ Create Form</Button>
                <div className='my-5'>
                <h2 className='text-sm mt-2'><strong>{formList?.length} </strong> File Created</h2>
                </div>
            </div>

        </div>
    );
}

export default SideNav;
