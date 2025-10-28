import { createContext, useContext, useRef, useEffect } from "react"
import { useAppStore } from './../Store/index';
import { io } from "socket.io-client"
import { HOST_ } from './../Constants';
const SocketContext = createContext(null)

export const useSocket = () => {
    return useContext(SocketContext)
}
export const SocketProvider = ({ children }) => {
    const socket = useRef()
    const { userInfo } = useAppStore()
    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST_, {
                withCredentials: true,
                query: { userId: userInfo.id },
            })
            socket.current.on("connect", () => {
                console.log("Connected to socket server")
            })

            
            const handleReceiveMessage = (message)=>{
                const {
                    selectedChatData,
                    selectedChatType,
                    addMessage,
                    triggerNavPanelRefresh 
                } = useAppStore.getState()
                
                
                const isChatOpen = selectedChatType !== undefined && 
                                   selectedChatData &&
                                   (selectedChatData._id === message.sender._id || 
                                    selectedChatData._id === message.recipient._id);

                if(isChatOpen){
                   
                    addMessage(message)
                } else {
    
                    triggerNavPanelRefresh()
                }
            }
            socket.current.on("receiveMessage",handleReceiveMessage)
            return () => {
                socket.current.disconnect()
            }
        }
    }, [userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}