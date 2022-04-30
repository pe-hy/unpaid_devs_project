import "./RegistrationButtonComponent.css"

const RegistrationButtonComponent = ({text, click, disable}) => {
    return (
        <button className='btn button-rgstr-1' disabled={disable} onClick={click}>
            {text}
        </button>
    )
}

export default RegistrationButtonComponent