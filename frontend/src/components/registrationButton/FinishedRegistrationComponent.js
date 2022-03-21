import PropTypes from 'prop-types'
import "./FinishedRegistrationComponent.css"

const FinishedRegistrationComponent = ({ text }) => {
    return (
        <button disabled className='btn button-rgstr-2'>
            {text}
        </button>
    )
}

export default FinishedRegistrationComponent