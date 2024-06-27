"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateForm from './_components/CreateForm';
import FormList from './_components/FormList';



function Dashboard() {

  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl flex items-center justify-between'>Dashboard
      <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
      </h2>
      <FormList />
      <CreateForm open={openDialog} onClose={() => setOpenDialog(false)} />
    </div>
  )
}

export default Dashboard