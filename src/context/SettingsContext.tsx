import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AASTMT_SLOTS, ROOM_DATABASE } from '../utils/timeUtils';

interface SettingsContextType {
  rooms: string[];
  slots: string[];
  isSpecialMode: boolean;
  addRoom: (room: string) => void;
  removeRoom: (room: string) => void;
  // Slot Management
  addSlot: (slot: string) => void;
  removeSlot: (index: number) => void;
  editSlot: (index: number, newSlot: string) => void;
  updateSlots: (newSlots: string[], special: boolean) => void;
  restoreNormalSlots: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<string[]>(ROOM_DATABASE);
  const [slots, setSlots] = useState<string[]>(AASTMT_SLOTS);
  const [isSpecialMode, setIsSpecialMode] = useState(false);

  const addRoom = (roomName: string) => {
    if (!rooms.includes(roomName)) setRooms(prev => [...prev, roomName]);
  };

  const removeRoom = (roomName: string) => {
    setRooms(prev => prev.filter(r => r !== roomName));
  };

  const addSlot = (slot: string) => {
    setSlots(prev => [...prev, slot]);
  };

  const removeSlot = (index: number) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const editSlot = (index: number, newSlot: string) => {
    const updated = [...slots];
    updated[index] = newSlot;
    setSlots(updated);
  };

  const updateSlots = (newSlots: string[], special: boolean) => {
    setSlots(newSlots);
    setIsSpecialMode(special);
  };

  const restoreNormalSlots = () => {
    setSlots(AASTMT_SLOTS);
    setIsSpecialMode(false);
  };

  return (
    <SettingsContext.Provider value={{ rooms, slots, isSpecialMode, addRoom, removeRoom, addSlot, removeSlot, editSlot, updateSlots, restoreNormalSlots }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    return {
      rooms: ROOM_DATABASE, slots: AASTMT_SLOTS, isSpecialMode: false,
      addRoom: () => {}, removeRoom: () => {}, addSlot: () => {}, removeSlot: () => {}, editSlot: () => {}, updateSlots: () => {}, restoreNormalSlots: () => {}
    };
  }
  return context;
};
