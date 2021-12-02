import PropTypes from 'prop-types'
import "./UnReservationButtonStyles.css"

const ReservationButtonComponent = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className='btn dereservation'>
            {text}
        </button>
    )
}

ReservationButtonComponent.defaultProps = {
    color: 'steelblue',
    customBorder: '2px'
}

ReservationButtonComponent.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func,
}

export default ReservationButtonComponent