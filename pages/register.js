import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <>
    <Layout title="Login">
    <div className="flex min-h-full items-center justify-center  ">
     <div className="w-full max-w-xl space-y-8 bg-black-gradient-2 rounded-[20px] box-shadow px-4 sm:px-6 py-12 lg:px-6">
       <div>
         <img
           className="mx-auto h-12 w-auto"
           src="https://droigon.com/images/logo.png"
           alt="Your Company"
         />
        
         <h2 className="mt-6 text-gradient text-center text-3xl font-bold tracking-tight text-gray-900">
           Sign up to create your account
         </h2>
         <p className="mt-2 text-center text-sm text-gray-600">
           and{' '}
           <a href="#" className="font-medium text-white hover:text-indigo-500">
             start your 14-day free trial
           </a>
         </p>
       </div>
       <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitHandler)} >
         
         <div className="-space-y-px rounded-md shadow-sm">
           <div className=''>
             <input
            type="text"
            className="relative block w-full mb-2 appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            id="name"
            placeholder='Name'
            autoFocus
            {...register('name', {
              required: 'Please enter name',
            })}
          />
             {errors.email && (
               <div className="text-red-500">{errors.name.message}</div>
             )}
           </div>
           <div >
           <input
            type="email"
            placeholder='Email'
            className="relative block w-full mb-2 appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
            id="email"
          ></input>
             {errors.email && (
               <div className="text-red-500">{errors.email.message}</div>
             )}
           </div>
           <div className='mb-10'>
           <input
            type="password"
            placeholder='Password'
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 6, message: 'password is more than 5 chars' },
            })}
            className="relative block w-full mb-2 appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            id="password"
            autoFocus
          ></input>
           </div>
           <div>
             <input
            className="relative block w-full  appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            type="password"
            placeholder='Confirm Password'
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please enter confirm password',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'confirm password is more than 5 chars',
              },
            })}
          />
             {errors.password && (
               <div className="text-red-500 ">{errors.password.message}</div>
             )}
           </div>
         </div>

         

         <div className="mb-4 text-sm  ">
       <span className='text-white'> Already have an account? &nbsp;</span>
       <Link href={`/login`} className=""><span className='font-medium text-indigo-600 hover:text-indigo-500 '> Login</span></Link>
     </div>

         <div>
           <button
             type="submit"
             className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
           >
             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
               
             </span>
             Register
           </button>
         </div>
       </form>
      
     </div>
   </div>
  
 </Layout>

   
    </>
  );
}
