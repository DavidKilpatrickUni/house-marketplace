import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'

import { toast } from 'react-toastify'
import OAuth from '../component/OAuth'

function SignUp() {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const { name, email, password } = formData

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData((prev) => (
            {
                ...prev,
                [e.target.id]: e.target.value
            }
        ))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()

            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            const user = userCredential.user

            updateProfile(auth.currentUser, {
                displayName: name
            })

            const formDataCopy = { ...formData }
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()

            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            navigate('/')

        } catch (err) {
            console.log(err.message)
            toast.error('Something went wrong')
        }

    }


    return (
        <>
            <div className="page-container">
                <header>
                    <p className='pageHeader'>
                        Create account
                    </p>
                </header>

                <form onSubmit={handleSubmit}>
                    <input
                        type='text'
                        className='nameInput'
                        placeholder='Enter Name'
                        id='name'
                        value={name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='email'
                        className='emailInput'
                        placeholder='Enter Email'
                        id='email'
                        value={email}
                        onChange={handleChange}
                        required
                    />
                    <div className="passwordInputDiv">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className='passwordInput'
                            placeholder='Enter Password'
                            id='password'
                            value={password}
                            onChange={handleChange}
                            required
                        />
                        <img
                            className='showPassword'
                            src={visibilityIcon}
                            alt='Show password'
                            onClick={() => setShowPassword((prev) => !prev)}
                        />
                    </div>
                    {/* <Link
                        to='/forgot-password'
                        className='forgotPasswordLink'
                    >
                        Forgot Password
                    </Link> */}
                    <div className='signUpBar'>
                        <p className='signUpText'>
                            Sign Up
                        </p>
                        <button className='signUpButton'>
                            <ArrowRightIcon
                                fill='#ffffff'
                                width='34px'
                                height='34px'
                            />
                        </button>
                    </div>
                </form>
                <OAuth />

                <Link
                    to='/sign-in'
                    className='registerLink'
                >
                    Sign in
                </Link>
            </div>
        </>
    )
}

export default SignUp
