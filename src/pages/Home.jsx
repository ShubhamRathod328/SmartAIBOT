import React, { useContext } from 'react'
import "../App.css"
import { RiImageAiLine } from "react-icons/ri";
import { LuImageUp } from "react-icons/lu";
import { BsChatLeft } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { IoMdArrowRoundUp } from "react-icons/io";
import { dataContext, prevUser, user } from '../context/UserContext';
import Chat from './chat';
import { generateResponse } from '../Gemini';
import { query } from '../huggingface';



function Home() {
    let{startRes,setStartRes,popUp,setpopUP,input,setInput, feature
        ,setFeature,showResult,setShowResult,prevFeature,setPrevFeature,genImgUrl,setGenImgUrl}=useContext(dataContext)
    async function handleSubmit(e) {

        setStartRes(true);
        setPrevFeature(feature);
        setShowResult("");
        prevUser.data=user.data;
        prevUser.mime_type=user.mime_type;
        prevUser.imgUrl=user.imgUrl;
        prevUser.prompt=input;
        user.data=null
        user.mime_type=null
        user.imgUrl=null
        setInput("");
        let result=await generateResponse();        
        setShowResult(result);
        setFeature("chat")
    }
    function handleImg(e){
        setFeature("upimg")
        let file=e.target.files[0]
        let reader=new FileReader()
        reader.onload=(event)=>{
        let base64=event.target.result.split(",")[1]
        user.data=base64
        user.mime_type=file.type
        console.log(event);
        user.imgUrl=`data:${user.mime_type};base64,${user.data}`
    }
      reader.readAsDataURL(file);
}

    async function handleGenerateImg() {
  setStartRes(true);
  setPrevFeature(feature);

  // attach the prompt
  prevUser.prompt = input;

  try {
    let result = await query(); 
    let url = URL.createObjectURL(result);
    console.log("Blob:", result);
    console.log("Generated URL:", url);
    setGenImgUrl(url);
  } catch (error) {
    console.error("Error generating image:", error);
  }
  setInput("");
  setFeature("chat");
}

    return (
        <div className='home'>
            <nav>
                <div className="logo" onClick={()=>{
                    setStartRes(false);
                    setFeature("chat")
                    user.data=null
                    user.mime_type=null
                    user.imgUrl=null
                    setpopUP(false)
                }}>
                    Smart AI Bot
                </div>
            </nav>
            <input type="file" accept='image/*' hidden  id="inputImg" onChange={handleImg}/>
            {!startRes ? <div className="hero">
                <span id='tag'>What Can I help with..?</span>
                <div className="cate">
                    <button className="upImg" onClick={()=>{
                        document.getElementById("inputImg").click()
                    }}>
                        <LuImageUp />
                        <span>upload Image</span>

                    </button>
                    <button className="genimg" onClick={()=>setFeature("genimg")}>
                        <RiImageAiLine />
                        <span>Generate Image</span>

                    </button> 
                    <button className="chatImg" onClick={()=>setFeature("chat")}>
                        <BsChatLeft />
                        <span>let's Chat</span>

                    </button>

                </div>
            </div>
            :
            <Chat/>
            }
 
            <form className='input-box' onSubmit={ (e)=>{
              e.preventDefault()
                if(input){
                    if(feature=="genimg"){
                        handleGenerateImg()
                    }else{
                     handleSubmit()}
                    }
                  }
               }>
                <img src={user.imgUrl} alt='' id="im"/>
                {
                popUp?<div className="pop-up">
                    <div className="select-up"  onClick={()=>{
                        setpopUP(false);
                        setFeature("chat")
                        document.getElementById("inputImg").click()
                    }}>
                        <LuImageUp />
                        <span>upload Image</span>
                    </div>
                      <div className="select-gen"  onClick={()=>{setpopUP(false);setFeature("genimg")}}>
                         <RiImageAiLine />
                        <span>Generate Image</span>
                    </div>
                </div>:null
                }
                
                <div id='add' onClick={()=>{
                    setpopUP(prev=>!prev)
                 }}>
                    {feature=="genimg"?<RiImageAiLine id="genimg"/>:  <FaPlus />}
                  
               </div>
                <input type="text " placeholder='Ask Something...' onChange={(e)=>setInput(e.target.value)} value={input}/>
                {/* <button id='submit'>
                    <IoMdArrowRoundUp />
                 </button> */}
                 {input? <button id='submit'>
                    <IoMdArrowRoundUp />
                </button>:null}
                 

            </form>

        </div>
    )
}


export default Home
