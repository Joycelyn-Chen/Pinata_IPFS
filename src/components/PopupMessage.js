import ReactModal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '600px', // add this line to limit the width
    maxHeight: '80vh', // add this line to limit the height
    overflow: 'auto' // add this line to enable scrolling
  }
};

const buttonStyles = {
  backgroundColor: '#4CAF50',
  border: 'none',
  color: 'white',
  padding: '8px 16px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  borderRadius: '4px',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
};

const PopupMessage = ({ message, isOpen, onRequestClose }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <h2 style={{ wordWrap: 'break-word' }}>{message}</h2>
      <button style={buttonStyles} onClick={onRequestClose}>OK</button>
    </ReactModal>
  );
};

export default PopupMessage;

