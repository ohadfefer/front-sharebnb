import { Link, NavLink, useSearchParams } from 'react-router-dom'
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

export function StayPreview({ stay }) {
    const [idx, setIdx] = useState(0)
    const [searchParams] = useSearchParams()

    const queryString = searchParams.toString()
    const toUrl = queryString
        ? `/stay/${stay._id}?${queryString}`
        : `/stay/${stay._id}`



    const len = stay.imgUrls.length || 1

    return (
        <NavLink to={toUrl} className="stay-preview">
                <Swiper
                    cssMode={true}
                    navigation={true}
                    pagination={true}
                    mousewheel={true}
                    keyboard={true}
                    modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                    className="carousel"
                >
                    <i className="fa-solid fa-heart heart-icon "></i>
                    {stay.imgUrls.map((img, idx) => (

                    <SwiperSlide className='preview-picture' key={idx}>
                        <img className='carousel-img' src={img} alt="" />
                    </SwiperSlide>

                ))}
            </Swiper>

<div className='preview-txt'>

            <p className='preview-title'>{stay.type} in {stay.loc.city}</p>
            <p className='preview-date'>8-9 Sept</p>
            <p className='preview-details'><span>${stay.price.toLocaleString()} for 1 night</span></p>
</div>
        </NavLink>
    )
}