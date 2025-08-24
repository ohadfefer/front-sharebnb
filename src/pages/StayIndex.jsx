import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadStays, addStay, updateStay, removeStay, addStayMsg } from '../store/actions/stay.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stayService } from '../services/stay/'
import { userService } from '../services/user'

import { StayList } from '../cmps/StayList'
import { StayFilter } from '../cmps/StayFilter'

export function StayIndex() {

    const [ filterBy, setFilterBy ] = useState(stayService.getDefaultFilter())
    const stays = useSelector(storeState => storeState.stayModule.stays)

    useEffect(() => {
        loadStays(filterBy)
    }, [filterBy])

    async function onRemoveStay(stayId) {
        try {
            await removeStay(stayId)
            showSuccessMsg('Stay removed')            
        } catch (err) {
            showErrorMsg('Cannot remove stay')
        }
    }

    async function onAddStay() {
        const stay = stayService.getEmptyStay()
        stay.name = prompt('Name?', 'Some Name')
        try {
            const savedStay = await addStay(stay)
            showSuccessMsg(`Stay added (id: ${savedStay._id})`)
        } catch (err) {
            showErrorMsg('Cannot add stay')
        }        
    }

    async function onUpdateStay(stay) {
        const price = +prompt('New price?', stay.price) || 0
        if(price === 0 || price === stay.price) return

        const stayToSave = { ...stay, price }
        try {
            const savedStay = await updateStay(stayToSave)
            showSuccessMsg(`Stay updated, new price: ${savedStay.price}`)
        } catch (err) {
            showErrorMsg('Cannot update stay')
        }        
    }

    return (
        <section className="stay-index">
            <header>
                <h2>Stays</h2>
                {userService.getLoggedinUser() && <button onClick={onAddStay}>Add a Stay</button>}
            </header>
            <StayFilter filterBy={filterBy} setFilterBy={setFilterBy} />
            <StayList 
                stays={stays}
                onRemoveStay={onRemoveStay} 
                onUpdateStay={onUpdateStay}/>
        </section>
    )
}