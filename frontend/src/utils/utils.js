
import animationData from './../assets/Chat Animation.json';


export const animationoptions = {
  loop: true,
  autoplay: true,
  animationData,
}

export const colors = [
  "bg-[#965E00]/40 text-[#F59E0B] border-[2px] border-[#F59E0B]",
  "bg-[#008C56]/40 text-[#34D399] border-[2px] border-[#34D399]",
  "bg-[#004AA3]/40 text-[#60A5FA] border-[2px] border-[#60A5FA]",
  "bg-[#6E0707]/40 text-[#F87171] border-[2px] border-[#F87171]",
  "bg-[#4C0161]/40 text-[#C12EE8] border-[2px] border-[#C900FF]",
]

export const getColor = (color) =>{
  if(color>=0 && color < colors.length){
    return colors[color]
  }
  return colors[0]
}