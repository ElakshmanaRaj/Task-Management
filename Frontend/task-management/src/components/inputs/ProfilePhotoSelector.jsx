import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";


const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if(file){
            setImage(file);

            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    }

    const handleImageRemove = ()=>{
        setImage(null);
        setPreviewUrl(null);
    }

    const onChooseFile = ()=>{
        inputRef.current.click();
    };


  return (
    <div className='flex justify-center mb-4'>
        <input type="file" 
        accept='image/x'
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
        />

        {!image ? (
            <div className='w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full cursor-pointer relative overflow-hidden'>
            <LuUser className='text-4xl text-blue-600 bg-transparent' />
            
            <button
              type="button"
              onClick={onChooseFile}
              className='w-8 h-8 flex items-center justify-center bg-white text-blue-700 rounded-full absolute -bottom-0 right-1 cursor-pointer z-10'
            >
              <LuUpload />
            </button>
          </div>
          
        ): (
            <div className='relative'>
                <img src={previewUrl} alt="profile photo"  className='w-20 h-20 rounded-full object-cover' />
                <button type="button" onClick={handleImageRemove} className='w-8 h-8 flex items-center justify-center bg-white text-red-600  rounded-full absolute -bottom-0 right-1 z-10 cursor-pointer'>
                    <LuTrash/>
                </button>
            </div>
        )
        }


    </div>
  )
}

export default ProfilePhotoSelector;