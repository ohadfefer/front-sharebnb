
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { loadStays, addStay, updateStay, removeStay } from '../store/actions/stay.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stayService } from '../services/stay/'
import { uploadService } from '../services/upload.service'
import plus from '../assets/logo/plus.png'

import { StayList } from '../cmps/StayList'
import { StayFilter } from '../cmps/StayFilter'

export function AddStay() {

    const { stays, filterBy, isLoading } = useSelector(storeState => storeState.stayModule)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formState, setFormState] = useState({
        name: '',
        type: '',
        city: '',
        price: '',
        imgUrls: [],
        //get default stay 
    })
    const navigate = useNavigate()

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

    function openModal() { setIsModalOpen(true) }
    function closeModal() { setIsModalOpen(false) }

    function handleChange(ev) {
        const { name, value } = ev.target
        setFormState(prev => ({ ...prev, [name]: name === 'price' ? Number(value) || '' : value }))
    }

    async function handleFileInput(ev) {
        try {
            const res = await uploadService.uploadImg(ev)
            const url = res?.secure_url || res?.url
            if (!url) throw new Error('No URL returned from upload')
            setFormState(prev => ({ ...prev, imgUrls: [...prev.imgUrls, url] }))
        } catch (err) {
            showErrorMsg('Image upload failed')
        }
    }

    async function onAddStay(ev) {
        ev?.preventDefault?.()
        if (!formState.name || !formState.price) return showErrorMsg('Name and price are required')

        try {
            const savedStay = await addStay(formState)
            showSuccessMsg(`Stay added (id: ${savedStay._id})`)
            setFormState({ name: '', type: '', city: '', price: '', imgUrls: [] })
            closeModal()
            // Redirect to stay list to see the new stay
            navigate('/stay')
        } catch (err) {
            showErrorMsg('Cannot add stay')
        }
    }

    async function onUpdateStay(stay) {
        const price = +prompt('New price?', stay.price) || 0
        if (price === 0 || price === stay.price) return

        const stayToSave = { ...stay, price }
        try {
            const savedStay = await updateStay(stayToSave)
            showSuccessMsg(`Stay updated, new price: ${savedStay.price}`)
        } catch (err) {
            showErrorMsg('Cannot update stay')
        }
    }

    return (
        <section className="add-stay">
            <header>
                <h1>Your listing</h1>
                <button className="add-btn" onClick={openModal}>+</button>
            </header>

            {/* {isLoading ? (
                <div>Loading...</div>
            ) : (
                <StayList
                    stays={stays}
                    onRemoveStay={onRemoveStay}
                    onUpdateStay={onUpdateStay}
                />
            )} */}

            {isModalOpen && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={ev => ev.stopPropagation()}>
                        <h3>Add new stay</h3>
                        <form onSubmit={onAddStay} className="stay-form">
                            <label>
                                <span>Name</span>
                                <input name="name" value={formState.name} onChange={handleChange} placeholder="e.g. Sea Breeze Villa" />
                            </label>
                            <label>
                                <span>Type</span>
                                <input name="type" value={formState.type} onChange={handleChange} placeholder="e.g. Villa" />
                            </label>
                            <label>
                                <span>City</span>
                                <input name="city" value={formState.city} onChange={handleChange} placeholder="e.g. Barcelona" />
                            </label>
                            <label>
                                <span>Price</span>
                                <input type="number" name="price" value={formState.price} onChange={handleChange} placeholder="e.g. 180" />
                            </label>

                            <label>
                                <span>Images</span>
                                <input type="file" accept="image/*" onChange={handleFileInput} />
                            </label>
                            {!!formState.imgUrls.length && (
                                <ul className="img-preview-list">
                                    {formState.imgUrls.map((url, idx) => (
                                        <li key={idx}><img src={url} alt="uploaded" width={80} /></li>
                                    ))}
                                </ul>
                            )}

                            <div className="actions">
                                <button type="button" onClick={closeModal}>Cancel</button>
                                <button type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}