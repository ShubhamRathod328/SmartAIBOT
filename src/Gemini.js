import { prevUser } from "./context/UserContext"

const API_Url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_APP_TITLE}`

export async function  generateResponse(params) {
    let RequestOption={
        method:"POST",
        Headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            "contents": [
    {
      "parts": [
        {
          "text": prevUser.prompt
        },
        prevUser.data?[{
          "inline_data": {
            "mime_type": prevUser.mime_type,
            "data": prevUser.data
          }
        }]:[]
        
      ]
    }
  ]
        })
    }
    try{
        let response =await fetch(API_Url,RequestOption)
        let data=await response.json()
        let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
        return apiResponse;
    }
    catch{

    }
}