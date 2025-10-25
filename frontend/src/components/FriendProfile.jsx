import React from 'react';
import { useAppStore } from '../Store';
import Avatar from '@mui/material/Avatar';
import { HOST_ } from '../Constants';
import { getColor } from '../utils/utils';
import { Dialog, DialogBackdrop, DialogPanel, Transition } from '@headlessui/react';

const FriendProfile = ({ isOpen, onClose }) => {
  const { selectedChatData } = useAppStore();

  if (!selectedChatData) return null;

  return (
    <Transition appear show={isOpen}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <DialogBackdrop
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl 
                                    bg-gray-800/80 backdrop-blur-lg border border-white/10 p-6 
                                    text-left align-middle shadow-xl transition-all">
                
                <div className="flex flex-col items-center text-white">
                  <div className="mt-4">
                    {selectedChatData.image ? (
                      <Avatar src={`${HOST_}/${selectedChatData.image}`} sx={{ width: 120, height: 120 }} />
                    ) : (
                      <Avatar sx={{ width: 120, height: 120, bgcolor: getColor(selectedChatData.color), fontSize: '3rem' }}>
                        {selectedChatData.firstname ? selectedChatData.firstname.charAt(0).toUpperCase() : 'C'}
                      </Avatar>
                    )}
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold">
                    {`${selectedChatData.firstname} ${selectedChatData.lastname}`}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {selectedChatData.email}
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    Hi everyone! I am using Synk app.
                  </p>

                  <div className="w-full h-px bg-white/10 my-6" />

                  <div>
                    <h3 className="text-lg font-semibold text-center">Shared Media</h3>
                    <p className="text-sm text-gray-500 mt-2">No media shared yet.</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-5 bg-purple-600 px-4 py-2 
                               text-sm font-medium text-white hover:bg-purple-700 focus:outline-none"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FriendProfile;