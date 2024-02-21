import './App.css';
import React, { useState, useEffect, useRef } from 'react';

//localStorage.removeItem('workoutCard-save')

function App() {
  const colors = {
    "Deck 1": 'rgb(226, 139, 139)',
    "Deck 2": 'rgb(102, 190, 201)',
    "Deck 3": 'rgb(100, 160, 110)',
    "Deck 4": 'rgb(151, 113, 180)'
  };

  const [savedData, setSavedData] = useState({
    activeCard: 0,
    activeDeck: "Deck 1",
    "Deck 1": [],
    "Deck 2": [],
    "Deck 3": [],
    "Deck 4": []
  });
  
  const [textColor, setTextColor] = useState('white');
  const [activeCard, setActiveCard] = useState(0);
  const [activeDeck, setActiveDeck] = useState('Deck 1');
  const [activeDeckLength, setActiveDeckLength] = useState(0);
  const [displayingDeck, setDisplayingDeck] = useState([]);
  const [displayingCard, setDisplayingCard] = useState({
    workoutName: '',
    repRange: '',
    weightRange: '',
    setGoal: '',
    setsCompleted: ''
  });
  const [animation, setAnimation] = useState('')
  const [ cardTextOpacity, setCardTextOpacity] = useState(1)

  console.log(activeDeckLength)
  const [workoutName, setWorkoutName] = useState('');
  const [repRange, setRepRange] = useState('');
  const [weightRange, setWeightRange] = useState('');
  const [setsGoal, setSetsGoal] = useState('');

  const [showCard, setShowCard] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);

  useEffect(() => {
    retrieveData();

  }, []);
  useEffect(() => {
    retrieveData();
    setAnimation('fadeIn 1.5s ease-in-out')

  }, [savedData.activeDeck]);

  const retrieveData = async () => {
    try {
      const existingSave = await localStorage.getItem('workoutCard-save');
      if (existingSave !== null) {
        const objectValue = JSON.parse(existingSave);
        setSavedData(objectValue);
        let activeDeck = objectValue.activeDeck;
        let activeColor = colors[activeDeck];
        let activeCard = objectValue.activeCard;
        let displayingDeck = objectValue[activeDeck]
        let activeDeckLength = displayingDeck.length;
        setActiveCard(activeCard)
        setActiveDeck(activeDeck);
        setActiveDeckLength(activeDeckLength); 
        setDisplayingDeck(displayingDeck);
        let temp = displayingDeck[activeCard] || {
          workoutName: '',
          repRange: '',
          weightRange: '',
          setGoal: '',
          setsCompleted: ''
        }
        setDisplayingCard(temp)
        setTextColor(activeColor);
      } else {
        const initialData = {
          activeCard: 0,
          activeDeck: "Deck 1",
          "Deck 1": [],
          "Deck 2": [],
          "Deck 3": [],
          "Deck 4": []
        };
        setSavedData(initialData);
        await storeData(initialData); // Wait for storage operation to complete
        let activeDeck = 'Deck 1'
        let activeCard = 0
        let activeColor = colors[activeDeck];
        
        setTextColor(activeColor);
        setActiveCard(activeCard)
        setActiveDeck(activeDeck); 
        setDisplayingDeck(displayingDeck);// Update
        
      }
    } catch (error) {
      console.error('Error retrieving data: ', error);
    }
  };
 // console.log(savedData);

  const storeData = async (data) => {
    try {
      const existingSave = JSON.stringify(data);
       localStorage.setItem('workoutCard-save', existingSave);
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data: ', error);
    }
    setTimeout(() => retrieveData(), 1000)
  };
  const renderForm = () => {
    if (showForm) {
      return (
      <div id="form">
        <button 
        id="exit-button"
          onClick={() => {
            setShowForm(false) 
            setShowFormEdit(false)
            setShowCard(true)
          }
          }
          >
            cancel
          </button>
        <input
          type="text"
          className="textInputs"
          placeholder={showFormEdit ? displayingCard.workoutName : 'workout name'}
          value={workoutName}
          onChange={text => setWorkoutName(text.target.value)}
        />
        <input
          type="text"
          className="textInputs"
          placeholder={showFormEdit ? displayingCard.repRange : "Rep Range"}
          value={repRange}
          onChange={text => setRepRange(text.target.value)}
        />
        <input
          type="text"
          className="textInputs"
          placeholder={showFormEdit ? displayingCard.weightRange : "Weight Range"}
          value={weightRange}
          onChange={text => setWeightRange(text.target.value)}
        />
        <input
          type="text"
          className="textInputs"
          placeholder={showFormEdit ? displayingCard.setGoal : "Sets Goal"}
          value={setsGoal}
          onChange={text => setSetsGoal(text.target.value)}
        />
          <button 
          id="save-button"
          onClick={() => showFormEdit ? handleSaveEditPress() : handleSavePress()}
          >
            Save
          </button>
    </div>
      );
    } 
  };

const renderCard = () => {
  if (showCard) {
    if (activeDeckLength > 0 && activeCard < activeDeckLength) {
      return (
        <div id="card-container" style={{ animation: animation }}>
          <button 
          id="tally-plus-button"
          style={{ color: textColor, opacity: cardTextOpacity }}
          onClick={() => handleTallyPlusPress()}
          >
            +
          </button>
          <p style={{ color: textColor, opacity: cardTextOpacity }}>{displayingCard.workoutName}</p>
          <p style={{ color: textColor, opacity: cardTextOpacity }}>{displayingCard.repRange}</p>
          <p style={{ color: textColor, opacity: cardTextOpacity }}>{displayingCard.weightRange}</p>
          <p style={{ color: textColor, opacity: cardTextOpacity }}>Goal: {displayingCard.setGoal}</p>
          <p style={{ color: textColor, opacity: cardTextOpacity }}>{displayingCard.setsCompleted}</p>
          <p style={{ color: textColor, opacity: cardTextOpacity }}>Completed</p>
          <button 
          id="edit-button" 
          style={{ color: textColor }}
          onClick={() => handleFormEditPress()}
          >
            edit card
          </button>
          <button 
          id="tally-minus-button"
          style={{ color: textColor, opacity: cardTextOpacity }}
          onClick={() => handleTallyMinusPress()}
          >
            -
          </button>
         {checkButtons()}
        </div>
      );
    } else {
      return (
        <div>
          <p style={{ color: textColor, opacity: cardTextOpacity }}>No cards</p>
        </div>
      );
    }
  }
};

const checkButtons = () => {
  if(activeCard === 0 && activeDeckLength > 1){
    return(
      <div>
      <button 
    id="next-button"
    style={{ color: textColor }}
    onClick={() => handleNextPress()}
    >
      Next
    </button>
    </div>
    )
  } else if(activeCard > 0 && activeDeckLength > 1 && activeCard < activeDeckLength -1){
    return(
    <div>
    <button 
    id="prev-button"
    style={{ color: textColor }}
    onClick={() => handlePrevPress()}
    >
      Prev
    </button>
    <button 
    id="next-button"
    style={{ color: textColor }}
    onClick={() => handleNextPress()}
    >
      Next
    </button>
    </div>
  )
  } else if(activeCard !== 0 && activeCard + 1 === activeDeckLength){
    return(
    <div>
    <button 
    id="prev-button"
    style={{ color: textColor }}
    onClick={() => handlePrevPress()}
    >
      Prev
    </button>
    </div>
    ) 
  } 
  
}
const buildDecks = () => {
  return (
  <div id="footer">
  <button 
    className="decks" 
    style={{ color: textColor, boxShadow: activeDeck === 'Deck 1' ? `inset 1px 1px 10px ${textColor}` : '' }}
    onClick={() => handleDeckPress("Deck 1")}
    onContextMenu={(e) => {
      e.preventDefault(); // Prevent default context menu
      handleDeleteDeck("Deck 1");
    }}>
    Deck 1
  </button>
  <button 
    className="decks" 
    style={{ color: textColor, boxShadow: activeDeck === 'Deck 2' ? `inset 1px 1px 10px ${textColor}` : '' }}
    onClick={() => handleDeckPress("Deck 2")}
    onContextMenu={(e) => {
      e.preventDefault(); // Prevent default context menu
      handleDeleteDeck("Deck 2");
    }}>
    Deck 2
  </button>
  <button 
    className="decks" 
    style={{ color: textColor, boxShadow: activeDeck === 'Deck 3' ? `inset 1px 1px 10px ${textColor}` : '' }}
    onClick={() => handleDeckPress("Deck 3")}
    onContextMenu={(e) => {
      e.preventDefault(); // Prevent default context menu
      handleDeleteDeck("Deck 3");
    }}>
    Deck 3
  </button>
  <button 
    className="decks" 
    style={{ color: textColor, boxShadow: activeDeck === 'Deck 4' ? `inset 1px 1px 10px ${textColor}` : '' }}
    onClick={() => handleDeckPress("Deck 4")}
    onContextMenu={(e) => {
      e.preventDefault(); // Prevent default context menu
      handleDeleteDeck("Deck 4");
    }}>
    Deck 4
  </button>
</div>

  )
  }
 
  const updateActiveCard = async (a) => {
    let newActiveCardIndex = 0
    if (a > 0){
      newActiveCardIndex = Number(activeCard) + Number(a);
    } else {
      let b = a + 2
      newActiveCardIndex = Number(activeCard) - Number(b);
    }
    if (newActiveCardIndex >= 0 && newActiveCardIndex < activeDeckLength) {
      setSavedData((prevState) => ({
        ...prevState,
        activeCard: newActiveCardIndex,
      }));
       storeData({
        ...savedData,
        activeCard: newActiveCardIndex,
      });
    }
  }

  const handleNextPress = () => {
    setAnimation('')
    setTimeout(() =>setAnimation('slideLeft 1.5s ease-in-out'), 500)
    setTimeout(() => setCardTextOpacity(0), 1900)
    setTimeout(() => setAnimation('slideRight 1.5s ease-in-out reverse'), 2000)
    setTimeout(() => setCardTextOpacity(1), 2100)
    setTimeout(() =>  updateActiveCard(1), 500)
  }
  const handlePrevPress = () => {
    setAnimation('')
    setTimeout(() => setAnimation('slideRight 1.5s ease-in-out'), 500)
    setTimeout(() => setCardTextOpacity(0), 1900)
     setTimeout(() => setAnimation('slideLeft 1.5s ease-in-out reverse'), 2000)
    setTimeout(() => setCardTextOpacity(1), 2100)
    setTimeout(() =>  updateActiveCard(-1), 500)
    
  }
    const handleFormPress = () => {
      setShowForm(true);
      setShowFormEdit(false);
      setShowCard(false);
    };
    const handleFormEditPress = () => {
      setShowForm(true);
      setShowFormEdit(true);
      setShowCard(false);
    };

    const addCardToActiveDeck = async (card) => {
      try {
        const activeDeck = savedData.activeDeck;
        const updatedDeck = [...savedData[activeDeck], card];
        const updatedData = { ...savedData, [activeDeck]: updatedDeck };
        setSavedData(updatedData);
        await storeData(updatedData);
      } catch (error) {
        console.error('Error adding card to active deck: ', error);
      }
    };
    const editCardToActiveDeck = async (card) => {
      try {
        const updatedDeck = [...savedData[activeDeck]];
        updatedDeck[activeCard] = card;
        const updatedData = { ...savedData, [activeDeck]: updatedDeck };
        setSavedData(updatedData);
        await storeData(updatedData);
      } catch (error) {
        console.error('Error editing card in active deck: ', error);
      }
    };

    const handleDeckPress = (deckName) => {
      setAnimation('')
      setTimeout(() => {
      setTextColor(colors[deckName]);
        setSavedData((prevState) => ({
          ...prevState,
          activeCard: 0,
          activeDeck: deckName,
        }));
        storeData({
          ...savedData,
          activeCard: 0,
          activeDeck: deckName,
        });
      }, 1000);
      retrieveData()
    };
    const handleDeleteDeck = (deckName) => {
      const emptyDeck = [];
      setSavedData(prevState => ({
        ...prevState,
        [deckName]: emptyDeck
      }));
      storeData({
        ...savedData,
        [deckName]: emptyDeck
      });

    }

    const handleSavePress = () => {
      const newCard = { 
        workoutName: workoutName ? workoutName: 'Workout Name',
        repRange: repRange ? repRange : 'Rep Range',
        weightRange: weightRange ? weightRange : 'Weight Range',
        setGoal: setsGoal ? setsGoal : 'Sets Goal',
        setsCompleted: 0, 
      };
      addCardToActiveDeck(newCard);
      setWorkoutName('');
      setRepRange('');
      setWeightRange('');
      setSetsGoal('');
      setShowForm(false);
      setShowCard(true);
    };
    const handleSaveEditPress = () => {
      const newCard = { 
        workoutName: workoutName ? workoutName : displayingCard.workoutName,
        repRange: repRange ? repRange : displayingCard.repRange,
        weightRange: weightRange ? weightRange: displayingCard.weightRange,
        setGoal: setsGoal ? setsGoal : displayingCard.setGoal,
        setsCompleted: displayingCard.setsCompleted ? displayingCard.setsCompleted : 0, 
      };
      editCardToActiveDeck(newCard);
      setWorkoutName('');
      setRepRange('');
      setWeightRange('');
      setSetsGoal('');
      setShowForm(false);
      setShowFormEdit(false);
      setShowCard(true);
  
    };
    const handleTallyPlusPress = () => {
      const activeDeck = savedData.activeDeck;
      const updatedDeck = [...savedData[activeDeck]];
      updatedDeck[savedData.activeCard] = {
        ...updatedDeck[savedData.activeCard],
        setsCompleted: updatedDeck[savedData.activeCard].setsCompleted + 1,
      };
      setSavedData({ ...savedData, [activeDeck]: updatedDeck });
      storeData({ ...savedData, [activeDeck]: updatedDeck });
    };
    const handleTallyMinusPress = () => {
      const activeDeck = savedData.activeDeck;
      const updatedDeck = [...savedData[activeDeck]];
      updatedDeck[savedData.activeCard] = {
        ...updatedDeck[savedData.activeCard],
        setsCompleted: Math.max(0, updatedDeck[savedData.activeCard].setsCompleted - 1),
      };
      setSavedData({ ...savedData, [activeDeck]: updatedDeck });
      storeData({ ...savedData, [activeDeck]: updatedDeck });
    };
    const SwipeDetector = () => {
    const [startX, setStartX] = useState(null);
    const [endX, setEndX] = useState(null);
    const swipeRef = useRef(null);
  
    const handleTouchStart = (event) => {
      setStartX(event.touches[0].clientX);
    };
  
    const handleTouchMove = (event) => {
      setEndX(event.touches[0].clientX);
    };
  
    const handleTouchEnd = () => {
      
      if (startX && endX) {
        const diff = startX - endX;
        if (diff > 50) {
          // Swipe left
          console.log('Swiped left');
          if(activeCard < activeDeckLength - 1){
          handleNextPress()
          }
        } else if (diff < -50) {
          // Swipe right
          console.log('Swiped right');
          if(activeCard > 0){
          handlePrevPress()
          }
        }
      }
      setStartX(null);
      setEndX(null);
    };
  
    return (
      <div
        ref={swipeRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }} // Prevent vertical scrolling
      >
        {renderCard()}
      </div>
    );
  };


  return (
    <div className="App">
      <header className="header"
        style={{ textShadow: `1px 1px 13px ${textColor}`}}
      >
        workoutCards
      </header>
      <button 
        id="add-a-card"
        style={{ color: textColor}}
       onClick={() => handleFormPress()}
      >
        add{'\n'}Card
        </button>
      {renderForm()}
      {SwipeDetector()}
      {buildDecks()}
    </div>
  );
}

export default App;
