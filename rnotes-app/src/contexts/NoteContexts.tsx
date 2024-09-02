import React, { ReactNode, createContext, useEffect, useState } from "react";
import { Storage } from '@ionic/storage';

export interface note {
    id: number;
    title: string | undefined;
    body: string | undefined;
    date: date | undefined; 
    category: string | undefined;
}

export interface newNote {
    title: string | undefined;
    body: string | undefined;
    date: date | undefined; 
    category: string | undefined;
}


export interface noteBigObject {
    priorityNotes: Array<note | undefined> | undefined;
    bookmarkedNotes: Array<note | undefined> | undefined;
    regularNotes: Array<note | undefined> | undefined;
}

interface NoteContextProps {
    notes: Array<note>[] | undefined;
    getAllNotes: () => Promise<noteBigObject>;
    getCategories: () => Promise<Array<String | null>>;
    saveCategories: (categories: Array<String | null>) => Promise<void>;
}

interface NoteContextProviderProps {
    children: ReactNode;
}

export const defaultNoteBigObject: noteBigObject = {
    priorityNotes: [],
    bookmarkedNotes: [],
    regularNotes: []
};

// Updated createContext with a proper default value for getAllNotes
export const NoteContext = createContext<NoteContextProps>({
    notes: [],
    getAllNotes: () => Promise.resolve(defaultNoteBigObject),
    getCategories: () => Promise.resolve([""]),
    saveCategories: (categories: Array<String | null>) => Promise.resolve()
});

export const NoteProvider = ({ children }: NoteContextProviderProps) => {
    const [store, setStorage] = useState<Storage>()
    const [notes, setNotes] = useState<Array<note>[] | undefined>()
    const [latestNoteId, setLatestNoteId] = useState<number>(0)

    const myNotes = 'myNotes'

    useEffect(() => {
        const initStorage = async () => {
            const newStore = new Storage({
                name: 'rnotesdb'
            })
            const store = await newStore.create()
            setStorage(store)

            const storedNotes = await store.get(myNotes) || []
            setNotes(storedNotes)

            let noteId = await localStorage.getItem("latestNoteId")
            if (noteId) {
                setLatestNoteId(JSON.parse(noteId))
            }
        }
        initStorage()
    })

    const saveNewNote = async (note: newNote): Promise<void> => {
        try {
            const newNote: note = {
                title: note.title,
                body: note.body,
                date: note.date,
                id: latestNoteId + 1,
                category: note.category
            }
        } catch {
            return
        }
    }



    const getAllNotes = async (): Promise<noteBigObject> => {
        try {
            let priorityNotes: any = localStorage.getItem("priorityNotes");
            let bookmarkedNotes: any = localStorage.getItem("bookmarkedNotes");
            let regularNotes: any = localStorage.getItem("regularNotes");

            priorityNotes = priorityNotes ? JSON.parse(priorityNotes) : [];
            bookmarkedNotes = bookmarkedNotes ? JSON.parse(bookmarkedNotes) : [];
            regularNotes = regularNotes ? JSON.parse(regularNotes) : [];

            let notes: noteBigObject = {
                priorityNotes,
                bookmarkedNotes,
                regularNotes
            };

            return notes;
        } catch (error: any) {
            return defaultNoteBigObject;
        }
    };

    const getCategories = async (): Promise<Array<String | null>> => {
        try {
            let categories: any = localStorage.getItem("Categories")
            if (!categories) {
                categories = ["All Notes"]
                localStorage.setItem("Categories", JSON.stringify(["All Notes"]))
            }

            categories = categories ? JSON.parse(categories) : []
            return categories
        } catch {
            return []
        }
    }

    const saveCategories = async (categories: Array<String | null>): Promise<void> => {
        try {
            localStorage.setItem("Categories", JSON.stringify(categories))
            return
        } catch {
            return
        }
    }

    return (
        <NoteContext.Provider
            value={{
                notes,
                getAllNotes,
                getCategories,
                saveCategories
            }}>
            {children}
        </NoteContext.Provider>
    );
};

export default NoteProvider;
