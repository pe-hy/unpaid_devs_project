import PropTypes from 'prop-types'
import "./ReservationButtonStyles.css"

const ReservationButtonComponent = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className='btn reservation'>
            {text}
        </button>
    )
}

ReservationButtonComponent.defaultProps = {
    color: "#0F6E49",
    customBorder: '3px'
}

ReservationButtonComponent.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func,
}

export default ReservationButtonComponent