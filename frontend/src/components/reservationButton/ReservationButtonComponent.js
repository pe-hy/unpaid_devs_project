import PropTypes from 'prop-types'

const ReservationButtonComponent = ({ color, text, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{ backgroundColor: color, border: "solid 2px rgb(72, 219, 207)", borderRadius: "0px"}}
            className='btn'
        >
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