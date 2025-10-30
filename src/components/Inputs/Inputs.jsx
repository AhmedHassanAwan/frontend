

import React, { use, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

function Inputs({value, onChange, type, placeholder, lable}) {
    const [showpassword, setshowpassword]= useState(false);

    const toglepasswaord=()=>{
        setshowpassword(!showpassword);
    }
  return (
    <div>
        <label className='text-[13px] text-slate-800'>{lable}</label>

        <div className='input-box'>
            <input
            type={type == 'password' ? showpassword ? 'text' : 'password' : type }
            placeholder={placeholder}
            value={value}
            className='w-full bg-transparent outline-none'
           onChange={(e)=> onChange(e)}
            />

            {type == 'password'  && (
                <>
                {showpassword ? (
                    <FaRegEye
                    size={22}
                    className='cursor-pointer text-primary'
                    onClick={toglepasswaord}/>
                ) : (
                    <FaRegEyeSlash
                    size={22}
                    className='cursor-pointer text-slate-600'
                    onClick={toglepasswaord}
                    />
                )}
                </>
            )}

        </div>

    </div>
   
  )
}

export default Inputs