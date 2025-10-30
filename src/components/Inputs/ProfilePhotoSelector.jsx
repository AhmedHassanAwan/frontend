import React, { use } from 'react'
import { useRef, useState } from 'react';
import {LuUser , LuUpload , LuTrash } from 'react-icons/lu';    

function ProfilePhotoSelector({image , setimage}) {
    const inputRef = useRef(null);
    const [previewUrl , setpreviewUrl]= useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setimage(file);
            const reader = URL.createObjectURL(file);
            setpreviewUrl(reader);
        }
    };

    const handleRemoveImage = () => {
        setimage(null);
        setpreviewUrl(null);
    };


    const onchosefile = () => {
        inputRef.current.click();
    }


 return  <div className='flex justify-center mb-6'>
    <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className='hidden'
        onChange={handleImageChange}
    />

    {!image ? (
        <div className='w-20 h-20 rounded-full border-2 border-dashed bg-purple-100 border-gray-400 flex items-center justify-center text-gray-400 relative'>
            <LuUser className='text-4xl text-primary'/>
            <button
        type="button"
        className="bg-primary text-white rounded-full p-1 absolute -bottom-1 -right-1"
        onClick={onchosefile}
      >
        <LuUpload className="w-4 h-4" />
      </button>
        </div>
    ) : (
        <div className='relative'>
            <img
                src={previewUrl}
                alt="Profile"
                className='w-24 h-24 rounded-full object-cover'
            />
            <button type='button' className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1' onClick={handleRemoveImage}>
                <LuTrash />
            </button>
        </div>      

    )}











    </div>

}

export default ProfilePhotoSelector