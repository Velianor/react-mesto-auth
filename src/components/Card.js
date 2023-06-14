import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({card, onCardClick, onCardLike, onCardDelete}) {
    const currentUser = useContext(CurrentUserContext);
    
    const isOwn = card.owner._id === currentUser._id;
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    const cardLikeButtonClassName = `element__button ${isLiked && 'element__button_active'}`;
   
    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card)
    };

    function handleDeleteClick() {
        onCardDelete(card)
    };

    return (
        <div className="element">
            {isOwn && (<button type="button" className="element__delete" onClick={handleDeleteClick} />)}
                <img src={card.link} alt={card.name} onClick={handleClick} className="element__img" />
            
            <div className="element__info">
                <h2 className="element__title">{card.name}</h2>
                <button type="button" className={cardLikeButtonClassName} aria-label="Лайк" onClick={handleLikeClick}>
                    <p className="element__button-check">{card.likes.length}</p>
                </button>
            </div>
        </div>
    )
};

export default Card;