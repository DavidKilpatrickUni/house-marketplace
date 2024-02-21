import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import { toast } from 'react-toastify'
import OAuth from '../component/OAuth'

function SignIn() {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const { email, password } = formData

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
            const userCredential = await signInWithEmailAndPassword(auth, email, password)

            if (userCredential.user) {
                navigate('/')
            }

        } catch (err) {
            console.log(err)
            toast.error('Bad User Credentials')
        }

    }



    return (
        <>
            <div className="page-container">
                <header>
                    <p className='pageHeader'>
                        Welcome back
                    </p>
                </header>

                <form onSubmit={handleSubmit}>
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
                    <Link
                        to='/forgot-password'
                        className='forgotPasswordLink'
                    >
                        Forgot Password
                    </Link>
                    <div className='signInBar'>
                        <p className='signInText'>
                            Sign In
                        </p>
                        <button className='signInButton'>
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
                    to='/sign-up'
                    className='registerLink'
                >
                    Sign Up
                </Link>
            </div>
        </>
    )
}

export default SignIn
