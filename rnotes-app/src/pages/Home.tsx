import { IonButton, IonButtons, IonCol, IonContent, IonHeader, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonPage, IonPopover, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import { AddOutline, ArchiveOutline, BookmarkOutline, BookmarksOutline, ChevronDownCircleOutline, HeartDislikeOutline, Search, TrashOutline, } from 'react-ionicons';
import { useContext, useEffect, useRef, useState } from 'react';
import { defaultNoteBigObject, note, noteBigObject, NoteContext } from '../contexts/NoteContexts';


const Home: React.FC = () => {

  const [categoryModal, setCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState<String | undefined | null>('');
  const [categories, setCategories] = useState<Array<String | null>>([])
  const [selectedCategory, setSelectedCategory] = useState(0);

  const [bookmarkedArrayOne, setBookmarkedArrayOne] = useState<Array<note>>([]);
  const [bookmarkedArrayTwo, setBookmarkedArrayTwo] = useState<Array<note>>([]);
  const [regularArrayOne, setRegularArrayOne] = useState<Array<note>>([]);
  const [regularArrayTwo, setRegularArrayTwo] = useState<Array<note>>([]);

  // const [notes, setNotes] = useState<noteBigObject>(defaultNoteBigObject)

  const notes: noteBigObject = {
    priorityNotes: [
      {
        title: 'Meeting Notes',
        body: `Remember to buy donuts for everyone before the meeting.
    
During the meeting, grab a picture or ask for the graphics so we can analyze them later in detail to understand`,
        date: Date.now(),
        category: "General"
      }
    ],
    bookmarkedNotes: [
      {
        title: `Mike's birthday`,
        body: `Gift ideas
1. Toy car
2. Lego
3. Money`,
        date: Date.now(),
        category: "Events"
      },
      {
        title: `Upgrading setup`,
        body: `Contact Dan about his ideas for a camera system.
Talk to Kevin before going through with the microphone changes`,
        date: Date.now(),
        category: "Projects"
      },
      {
        title: `Morning Reflections`,
        body: `The sunrise today was breathtaking, filling the sky with shades of orange and pink. I felt a deep sense of gratitude for the beauty of nature.`,
        date: Date.now(),
        category: "General"
      },
      {
        title: `Project Update`,
        body: `The new feature has been successfully integrated into the app and tested. Next steps include finalizing the user interface and preparing for launch.`,
        date: Date.now(),
        category: "Projects"
      },
      {
        title: `Grocery List Reminder`,
        body: `Remember to pick up fresh vegetables, eggs, and milk from the store. Also, don't forget to grab some coffee and cereal for breakfast.`,
        date: Date.now(),
        category: "General"
      }
    ],
    regularNotes: [
      {
        title: "Weekend Plans",
        body: "Planning to visit the local museum this Saturday to see the new art exhibit. Afterwards, I'm meeting friends for a late lunch at our favorite café.",
        date: Date.now(),
        category: "Fun"
      },
      {
        title: "Book Recommendation",
        body: "Just finished reading 'The Midnight Library' by Matt Haig, a thought-provoking exploration of life's choices. Highly recommend it to anyone looking for an engaging read.",
        date: Date.now(),
        category: "Education"
      },
      {
        title: "Fitness Goals",
        body: "Started a new workout routine focusing on strength training and cardio. Feeling more energized and motivated to maintain a healthier lifestyle.",
        date: Date.now(),
        category: "Fitness"
      },
      {
        title: "Recipe Idea",
        body: "Thinking of making a homemade lasagna for dinner tonight, packed with layers of cheese, sauce, and fresh herbs. It's always a family favorite and perfect for leftovers.",
        date: Date.now(),
        category: "Fitness"
      },
      {
        title: "Travel Inspiration",
        body: "Dreaming of visiting Kyoto in the spring to see the cherry blossoms in full bloom. The city's rich history and beautiful gardens are calling my name.",
        date: Date.now(),
        category: "Projects"
      },
      {
        title: "Tech Conference Highlights",
        body: "Attended a virtual tech conference today, learned about the latest trends in AI and machine learning. Excited to apply some of these insights to our upcoming projects.",
        date: Date.now(),
        category: "Fun"
      },
      {
        title: "Meditation Practice",
        body: "Started incorporating meditation into my daily routine to help manage stress. Even a few minutes of deep breathing and mindfulness makes a big difference.",
        date: Date.now(),
        category: "Fitness"
      }
    ]
  }

  const { getAllNotes, getCategories, saveCategories } = useContext(NoteContext)

  const { priorityNotes, bookmarkedNotes, regularNotes } = notes

  useEffect(() => {
    async function settingUp() {
      let categories = await getCategories()
      setCategories(categories)

      let bookmarkedArrayOne: Array<note> = [];
      let bookmarkedArrayTwo: Array<note> = [];
      if (bookmarkedNotes) {
        bookmarkedNotes.map((item: note | null, index: number) => {
          if (item !== null) { // Check to ensure item is not null
            if (index % 2 === 0) {
              bookmarkedArrayOne.push(item);
            } else {
              bookmarkedArrayTwo.push(item);
            }
          }
        });
        setBookmarkedArrayOne(bookmarkedArrayOne);
        setBookmarkedArrayTwo(bookmarkedArrayTwo);
      }

      let regularArrayOne: Array<note> = [];
      let regularArrayTwo: Array<note> = [];
      if (regularNotes) {
        regularNotes.map((item: note | null, index: number) => {
          if (item !== null) { // Check to ensure item is not null
            if (index % 2 === 0) {
              regularArrayOne.push(item);
            } else {
              regularArrayTwo.push(item);
            }
          }
        });
        setRegularArrayOne(regularArrayOne);
        setRegularArrayTwo(regularArrayTwo);
      }
    }
    settingUp();
  }, []);



  function notePreviewLimit(text: string, wordLimit: number) {
    // Split text by line breaks
    const lines = text.split('\n');
    let wordCount = 0;
    let truncatedText = '';

    for (const line of lines) {
      const words = line.split(' ');

      if (wordCount + words.length > wordLimit) {
        // Calculate remaining words allowed and add them to truncatedText
        const remainingWords = wordLimit - wordCount;
        truncatedText += words.slice(0, remainingWords).join(' ') + '...';
        break;
      }

      // Add line to truncatedText
      truncatedText += line + '\n';
      wordCount += words.length;

      // Check if adding this line reaches the word limit
      if (wordCount + 10 >= wordLimit) {
        truncatedText += '...'; // Add ellipsis if text is truncated
        break;
      }
    }

    return truncatedText;
  }

  function handleSetSelectedCategory(index: number) {
    let oldHighlightedSelector = document.getElementById(`selector-item-${selectedCategory}`)
    oldHighlightedSelector?.classList.remove("selected-item")

    setSelectedCategory(index)
    let highlightedSelector = document.getElementById(`selector-item-${index}`)
    highlightedSelector?.classList.add("selected-item")
  }
  const handleDeleteCategory = (categoryIndex: number) => {
    let newCategories = categories.filter((_, index) => index !== categoryIndex)
    setCategories(newCategories);
    saveCategories(newCategories)
  };
  const handleMoveUpCategory = (categoryIndex: number) => {
    if (categoryIndex === 0) return; // Already at the top
    const newCategories = [...categories];
    const temp = newCategories[categoryIndex - 1];
    newCategories[categoryIndex - 1] = newCategories[categoryIndex];
    newCategories[categoryIndex] = temp;
    setCategories(newCategories);
    saveCategories(newCategories);
  };
  const handleMoveDownCategory = (categoryIndex: number) => {
    if (categoryIndex === categories.length - 1) return; // Already at the bottom
    const newCategories = [...categories];
    const temp = newCategories[categoryIndex + 1];
    newCategories[categoryIndex + 1] = newCategories[categoryIndex];
    newCategories[categoryIndex] = temp;
    setCategories(newCategories);
    saveCategories(newCategories);
  };
  const handleAddCategory = () => {
    if (newCategory === undefined) {
      return
    } else if (newCategory === "All Notes") {
      return
    } else if (newCategory === '') {
      return
    } else if (newCategory === null) {
      return
    }
    if (newCategory.trim() !== '') {
      let newCategories = [...categories, newCategory.trim()]
      console.log(newCategories)
      setCategories(newCategories);
      saveCategories(newCategories);
      setNewCategory(null)
    }
  };


  function handleArrays(array: Array<note>, bool: boolean, arrayNum: number) {

    return array.map((note, index) => (
      <div
        key={`reg-note-${index}`}
        className={`note ${bool ? 'note-array-one' : 'note-array-two'}`}>
        <div className='note-title'>
          {note.title}
        </div>
        <div className='note-body'>
          {notePreviewLimit(note.body, 15)}
        </div>
        <div className='note-footer'>
          <IonRow>
            <IonCol size='8'>
              <div className='note-footer-date'>
                {new Date(note.date).toLocaleDateString()}
              </div>
            </IonCol>
            <IonCol size='4'>
              <div className='note-options-button'
                id={`popover-button-reg-note-popover` + `${arrayNum}-${index}`}>
                <ChevronDownCircleOutline
                  width="30px"
                  height="30px" />
              </div>
              <IonPopover
                trigger={`popover-button-reg-note-popover` + `${arrayNum}-${index}`}
                dismissOnSelect={true}
                translucent={true}
              >
                <IonContent>
                  <IonList class='note-option-list'>
                    <IonItem
                      button={true}
                      detail={false}
                      className='note-option-list-item'
                    >
                      <IonCol size='2'>
                        <TrashOutline />
                      </IonCol>
                      <IonCol size='10'>
                        <div className='note-option-list-item-text'>
                          Delete
                        </div>
                      </IonCol>
                    </IonItem>
                    <IonItem
                      button={true}
                      detail={false}
                      className='note-option-list-item'>
                      <IonCol size='2'>
                        <ArchiveOutline />
                      </IonCol>
                      <IonCol size='10'>
                        <div className='note-option-list-item-text'>
                          Archive
                        </div>
                      </IonCol>
                    </IonItem>
                    <IonItem
                      button={true}
                      detail={false}
                      className='note-option-list-item'>
                      <IonCol size='2'>
                        <BookmarksOutline />
                      </IonCol>
                      <IonCol size='10'>
                        <div className='note-option-list-item-text'>
                          Remove Bookmark
                        </div>
                      </IonCol>
                    </IonItem>
                  </IonList>
                </IonContent>
              </IonPopover>
            </IonCol>
          </IonRow>
        </div>
      </div>
    ))
  }

  return (
    <IonPage>
      <IonContent fullscreen>

        {/* Category Modal */}
        <IonModal isOpen={categoryModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Categories</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setCategoryModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {categories.map((category, index) => {
              return (
                <IonItemSliding key={index}>
                  <IonItemOptions side="start">
                    {category === 'All Notes' ? null : (
                      <IonItemOption color="danger" onClick={() => handleDeleteCategory(index)}>
                        Delete
                      </IonItemOption>
                    )}
                  </IonItemOptions>
                  <IonItem>
                    <IonLabel>{category}</IonLabel>
                  </IonItem>
                  <IonItemOptions side="end">
                    <IonItemOption onClick={() => handleMoveUpCategory(index)}>Move Up</IonItemOption>
                    <IonItemOption onClick={() => handleMoveDownCategory(index)}>Move Down</IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              );
            })}
            <br />
            <IonRow>
              <IonCol size='12'>
                <IonItem>
                  <IonInput
                    label="New Category"
                    placeholder="Enter category"
                    onIonInput={(e) => {
                      setNewCategory(e.detail.value)
                    }} />
                </IonItem>
              </IonCol>
              <IonCol size='12'>
                <IonButton
                expand='block'
                  onClick={() => {
                    handleAddCategory()
                  }}>
                  Add
                </IonButton>
              </IonCol>
            </IonRow>
          </IonContent>
        </IonModal>


        <IonRow>
          <IonCol size='10'>
            <h1>
              My Notes
            </h1>
          </IonCol>
          <IonCol size='2'>
            <div className='search-icon'>
              <Search
                width="45px"
                height="45px"
              />
            </div>
          </IonCol>
        </IonRow>
        <IonRow>
          <div className="selector-row">
            <div className='selector-item'>
              <div
                className='add-note-plus'
                onClick={() => {
                  setCategoryModal(true)
                }}>
                +
              </div>
            </div>
            {categories.map((item, index) => (
              <div
                key={index}
                className={`selector-item ` + `${index ? `` : `selected-item`}`}
                id={`selector-item-${index}`}
                onClick={() => {
                  handleSetSelectedCategory(index)
                }}>
                #{item}
              </div>
            ))}
          </div>
        </IonRow>
        {priorityNotes ? (
          <>
            <IonRow>
              <IonCol size='2'>
                <div className='bookmark-icon'>
                  <BookmarkOutline
                    width="45px"
                    height="45px"
                  />
                </div>
              </IonCol>
              <IonCol size='10'>
                <div className='line' />
              </IonCol>
            </IonRow>
            <IonRow>
              {priorityNotes.map((note, index) => (
                <div
                  key={`priority-note-${index}`}
                  className='note priority-note '>
                  <div className='note-title'>
                    {note ? (note.title) : ('')}
                  </div>
                  <div className='note-body'>
                    {note ? (notePreviewLimit(note.body, 25)) : ''}
                  </div>
                  <div className='note-footer'>
                    <IonRow>
                      <IonCol size='8'>
                        <div className='note-footer-date'>
                          {note ? (new Date(note.date).toLocaleDateString()) : ''}
                        </div>
                      </IonCol>
                      <IonCol size='4'>
                        <div className='note-options-button'
                          id={`popover-button-priority-note-${index}`}>
                          <ChevronDownCircleOutline
                            width="30px"
                            height="30px" />
                        </div>
                        <IonPopover
                          trigger={`popover-button-priority-note-${index}`}
                          dismissOnSelect={true}>
                          <IonContent>
                            <IonList class='note-option-list'>
                              <IonItem
                                button={true}
                                detail={false}
                                className='note-option-list-item'
                              >
                                <IonCol size='6'>
                                  <TrashOutline />
                                </IonCol>
                                <IonCol size='6'>
                                  <div className='note-option-list-item-text'>
                                    Delete
                                  </div>
                                </IonCol>
                              </IonItem>
                              <IonItem
                                button={true}
                                detail={false}
                                className='note-option-list-item'>
                                <IonCol size='6'>
                                  <ArchiveOutline />
                                </IonCol>
                                <IonCol size='6'>
                                  <div className='note-option-list-item-text'>
                                    Archive
                                  </div>
                                </IonCol>
                              </IonItem>
                              <IonItem
                                button={true}
                                detail={false}
                                className='note-option-list-item'>
                                <IonCol size='2'>
                                  <HeartDislikeOutline />
                                </IonCol>
                                <IonCol size='10'>
                                  <div className='note-option-list-item-text'>
                                    Remove Priority
                                  </div>
                                </IonCol>
                              </IonItem>
                            </IonList>
                          </IonContent>
                        </IonPopover>
                      </IonCol>
                    </IonRow>
                  </div>
                </div>
              ))}
            </IonRow>
          </>
        ) : (
          <></>
        )}
        <IonRow>
          <IonCol size='6'>
            {handleArrays(bookmarkedArrayOne, false, 1)}
          </IonCol>
          <IonCol size='6'>
            {handleArrays(bookmarkedArrayTwo, true, 2)}
          </IonCol>
        </IonRow>
        <IonRow>
          <div className='second-line' />
        </IonRow>
        <IonRow>
          <IonCol size='6'>
            {handleArrays(regularArrayOne, false, 3)}
          </IonCol>
          <IonCol size='6'>
            {handleArrays(regularArrayTwo, true, 4)}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Home;
