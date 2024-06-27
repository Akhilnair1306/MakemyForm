import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Themes from '@/app/_data/Themes';
import GradientBg from '@/app/_data/GradientBg';
import { Checkbox } from '@/components/ui/checkbox';


function Controller({selectedtheme,selectedBackground,setSignInEnable}) {
  return (
    <div>
      
      <h2 className='my-2'>Select Themes</h2>
      <Select onValueChange={(value) => selectedtheme(Themes.find(theme => theme.theme === value))}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {Themes.map((theme,index) => (
                <SelectItem value={theme.theme} key={index}>
                  <div className='flex gap-3'>
                    <div className='flex'>
                      <div className='h-5 w-5 rounded-l-md' style={{backgroundColor: theme.primary}}>
                      </div>
                      <div className='h-5 w-5' style={{backgroundColor: theme.secondary}}>
                      </div>
                      <div className='h-5 w-5' style={{backgroundColor: theme.accent}}>
                      </div>
                      <div className='h-5 w-5 rounded-r-md' style={{backgroundColor: theme.neutral}}>
                      </div>
                      
                      </div>
                      {theme.theme}
                    </div>
                </SelectItem>
          ))}
          

        </SelectContent>
      </Select>

      {/*Background Selection Controller */}
      <h2 className='mt-8 my-1'>Background</h2>
      <div className='grid grid-cols-3 gap-4'>
        {GradientBg.map((bg,index) => (
          <div className='w-full h-[70px] rounded-lg cursor-pointer
          hover: border-black hover:border-2 flex items-center justify-center'
          style={{background: bg.gradient}}
          key={index}
          onClick={()=> selectedBackground(bg.gradient)}>
              {index ==0 && 'None'}
          </div>
        ))}
      </div>
      <div className='flex gap-2 items-center my-8'>
        <Checkbox onCheckedChange={(e) => setSignInEnable(e) } /> <h2>Enable Social Authentication before submit the form</h2>
      </div>
    </div>
  )
}

export default Controller