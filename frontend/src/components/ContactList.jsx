import Avatar from "@mui/material/Avatar"
import { useAppStore } from "../Store"
import { getColor } from "../utils/utils"
import { HOST_ } from "../Constants"

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
    userInfo
  } = useAppStore()
  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel")
    else setSelectedChatType("contact")
    setSelectedChatData(contact)
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([])
    }
  }
  return (
    <div className="mt-1">
      {contacts.map((contact) => (
        <div key={contact._id} className={`pl-5 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#2c0529] hover:bg-[#610a5a]" : "hover:bg-[#101010]"} rounded-xl mt-2`}

          onClick={() => handleClick(contact)}
        >
          <div class="flex gap-3 items-center justify-start text-neutral-300 ">
            {
              !isChannel && (<div className="h-12 w-12 rounded-full overflow-hidden">
                {contact.image ? (
                  <Avatar src={`${HOST_}/${contact.image}`} className='w-100 h-100' />
                ) : (
                  <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-5 ${getColor(contact.color)} `} >
                    {contact.firstname
                      ? contact.firstname.split("").shift()
                      : contact.email.split("").shift()
                    }
                  </div>
                )}
              </div>)
            }
            {
              isChannel && (
                <div className="flex bg-[#fffff222] h-10 w-10 items-center justify-center rounded-full">
                  #

                </div>
            )}
            <div className="flex flex-col overflow-hidden min-w-0">
              {
                isChannel? (
                  <span className="truncate">{contact.name}</span>
                ):(
                  <span className="truncate">{`${contact.firstname} ${contact.lastname}`}</span>
                )
              }
              
              {contact.lastMessage && !isChannel && (
                <span className="text-sm text-gray-400 truncate">
                  {contact.lastMessageSender === selectedChatData?._id ? "" : "You:  "}
                  {contact.lastMessage}
                </span>
              )}
            </div>
            
          </div>
        </div>
      ))}

    </div>
  )
}

export default ContactList
