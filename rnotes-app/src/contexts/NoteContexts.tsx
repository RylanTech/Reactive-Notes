import React, { ReactNode, createContext } from "react";

export interface note {
    id: number;
    title: string;
    body: string;
    date: date; 
    category: string;
}

export interface noteBigObject {
    priorityNotes: Array<note | null> | null;
    bookmarkedNotes: Array<note | null> | null;
    regularNotes: Array<note | null> | null;
}

interface NoteContextProps {
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
    getAllNotes: () => Promise.resolve(defaultNoteBigObject),
    getCategories: () => Promise.resolve([""]),
    saveCategories: (categories: Array<String | null>) => Promise.resolve()
});

export const NoteProvider = ({ children }: NoteContextProviderProps) => {

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
                getAllNotes,
                getCategories,
                saveCategories
            }}>
            {children}
        </NoteContext.Provider>
    );
};

export default NoteProvider;
