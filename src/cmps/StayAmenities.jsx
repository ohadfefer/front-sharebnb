import beach  from '../assets/logo/icons/beach.svg'
import wifi  from '../assets/logo/icons/wifi.svg'
import kitchen  from '../assets/logo/icons/kitchen.svg'
import ac  from '../assets/logo/icons/ac.svg'
import heating  from '../assets/logo/icons/heating.svg'
import parking from '../assets/logo/icons/parking.svg'
import elevator from '../assets/logo/icons/elevator.svg'



export function StayAmenities({ stay }) {
    function getAmenityIcon(amenity) {
        switch (amenity) {
            case 'Pool':
                return beach
            case 'Wifi':
                return wifi
            case 'Air conditioning':
                return ac
            case 'Kitchen':
                return kitchen
            case 'Parking':
                return parking
            case 'Heating':
                return heating
            case 'Elevator':
                return elevator
            default:
                return '🏠' 
        }
    }

    return (
        <div className="stay-amenities">
            <div className="amenities-grid">
                {stay.amenities.map((amenity, idx) => (
                    <div className="amenity-row" key={idx}>
                        <img src={getAmenityIcon(amenity)} alt="" width={24} />
                        <div className="amenity-name">{amenity}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}