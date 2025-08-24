import { Link } from 'react-router-dom'

export function StayPreview({ stay }) {
    return <article className="stay-preview">
        <header>
            <Link to={`/stay/${stay._id}`}>{stay.name}</Link>
        </header>

        <p>Price: <span>{stay.price.toLocaleString()} NIS</span></p>
        {stay.owner && <p>Owner: <span>{stay.owner.fullname}</span></p>}
        
    </article>
}