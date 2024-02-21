import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'

import 'swiper/swiper-bundle.css'

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Spinner from './Spinner'

const Slider = () => {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {

        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings')

            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))

            const querySnap = await getDocs(q)

            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            console.log(listings)
            setListings(listings)
            setLoading(false)
        }

        fetchListings()

    }, [])


    if (loading) {
        return <Spinner />
    }

    if (listings.length === 0) {
        return <></>
    }

    return (listings && (
        <>
            <p className='exploreHeading'>
                Recommended
            </p>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                autoplay
                spaceBetween={50}
                slidesPerView={1}
                pagination={{ clickable: true }}

                scrollbar={{ draggable: true }}
            >
                {listings.map(({ data, id }) => (
                    <SwiperSlide
                        key={id}
                        onClick={() => navigate(`/category/${data.type}/${id}`)}
                    >
                        <div
                            style={{ background: `url(${data.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover' }}
                            className='swiperSlideDiv'
                        >
                            <p className='swiperSlideText'>
                                {data.name}
                            </p>
                            <p className='swiperSlidePrice'>
                                £{data.discountedPrice ?? data.regularPrice}
                                {data.type === 'rent' && ' / Month'}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
    )

}

export default Slider
