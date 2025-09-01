import { userService } from '../services/user'
import { StayPreview } from './StayPreview'

export function StayList({ stays, onRemoveStay, onUpdateStay }) {

    function shouldShowActionBtns(stay) {
        const user = userService.getLoggedinUser()

        if (!user) return false
        if (user.isAdmin) return true
        return stay.host?._id === user._id
    }

    return <section>
        <ul className="stay-list">
            {stays.map(stay =>
                <li key={stay._id}>
                    <StayPreview stay={stay} />
                </li>)
            }
        </ul>
    </section>
}