import { Link, NavLink } from 'react-router-dom'
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

export function StayPreview({ stay }) {
    const [idx, setIdx] = useState(0)

    const len = stay.imgUrls.length || 1

    function next() {
        setIdx((idx + 1) % len)
    }

    function prev() {
        setIdx((idx - 1 + len) % len)
    }

    return (
        <NavLink to={`/stay/${stay._id}`} className="stay-details">
                <Swiper
                    cssMode={true}
                    navigation={true}
                    pagination={true}
                    mousewheel={true}
                    keyboard={true}
                    modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                    className="carousel"
                >
                    <i class="fa-solid fa-heart heart-icon "></i>
                    {stay.imgUrls.map((img, idx) => (

                        <SwiperSlide className='preview-picture' key={idx}>
                            <img className='carousel-img' src={img} alt="" />
                            </SwiperSlide>
                        
                    ))}
                </Swiper>
                    
                
                <p className='preview-title'>{stay.type} in {stay.loc.city}</p>
                <p className='preview-details'><span>${stay.price.toLocaleString()} for 1 night</span></p>
                {stay.owner && <p>Owner: <span>{stay.owner.fullname}</span></p>}
        </NavLink>
    )
}