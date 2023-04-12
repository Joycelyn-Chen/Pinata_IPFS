import ReactModal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const PopupMessage = ({ message, isOpen, onRequestClose }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <h2>{message}</h2>
      <button onClick={onRequestClose}>OK</button>
    </ReactModal>
  );
};

export default PopupMessage;
